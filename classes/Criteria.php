<?php
class Criteria
{
    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    private function errorResponse()
    {
        return ["success" => false];
    }

    private function logerror($error)
    {
        log_error("Error: " . $error);
    }

    private function successResponse($data = null, $message = null)
    {
        $response = ["success" => true];
        if ($data !== null) {
            $response["data"] = $data;
        }
        if ($message !== null) {
            $response["message"] = $message;
        }
        return $response;
    }

    public function addCriteria($fieldId, $type, $criteria, $weight)
    {
        try {
            $conn = $this->db->getConnection();

            $sql =
                "INSERT INTO fieldcriteria (fieldId, type, criteria, weight) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$fieldId, $type, $criteria, $weight]);

            return $this->successResponse();
            
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function deleteCriteria($criteriaId)
    {
        try {
            $conn = $this->db->getConnection();
            $sql = "DELETE FROM fieldcriteria WHERE id = :criteriaId";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":criteriaId", $criteriaId);
            $stmt->execute();
            return $this->successResponse();

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function updateCriteriaWeight($criteriaId, $newWeight)
    {
        try {
            $conn = $this->db->getConnection();
            $sql =
                "UPDATE fieldcriteria SET weight=:newWeight WHERE id=:criteriaId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":newWeight", $newWeight);
            $stmt->bindParam(":criteriaId", $criteriaId);
            $stmt->execute();
            return $this->successResponse();

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function fetchFieldsAndCriteria()
{
    try {
        $conn = $this->db->getConnection();
        
        // Check if there are any fields in the database
        $fieldsCountSql = "SELECT COUNT(*) as count FROM field";
        $fieldsCountResult = $conn->query($fieldsCountSql);
        $fieldsCount = $fieldsCountResult->fetchColumn();
        
        // If there are no fields, return 0
        if ($fieldsCount === 0) {
            return 0; // Return 0 if there are no fields
        }
        
        // Proceed with fetching fields and criteria
        $fieldsAndCriteria = [];
        $fieldsSql = "SELECT * FROM field";
        $fieldsResult = $conn->query($fieldsSql);
        if ($fieldsResult->rowCount() > 0) {
            while ($fieldRow = $fieldsResult->fetch(PDO::FETCH_ASSOC)) {
                $fieldId = $fieldRow["id"];
                $fieldsAndCriteria[$fieldId] = [
                    "name" => $fieldRow["name"],
                    "type" => $fieldRow["type"],
                    "criteria" => [],
                ];
                $criteriaSql =
                    "SELECT * FROM fieldcriteria WHERE id = :fieldId";
                $criteriaStmt = $conn->prepare($criteriaSql);
                $criteriaStmt->bindParam(":fieldId", $fieldId);
                $criteriaStmt->execute();
                if ($criteriaStmt->rowCount() > 0) {
                    while (
                        $criteriaRow = $criteriaStmt->fetch(
                            PDO::FETCH_ASSOC
                        )
                    ) {
                        $criteriaId = $criteriaRow["id"];
                        $fieldsAndCriteria[$fieldId]["criteria"][
                            $criteriaId
                        ] = [
                            "type" => $criteriaRow["type"],
                            "criteria" => $criteriaRow["criteria"],
                            "weight" => $criteriaRow["weight"],
                        ];
                    }
                }
            }
        }
        return $this->successResponse($fieldsAndCriteria);

    } catch (PDOException $e) {
        $this->logerror($e . " An error occurred: " . $e->getMessage());
        return $this->errorResponse();
    }
}


    public function evaluateSimpleNumericalCriterion($fieldValue,$operator,$value) {
        try {
            switch ($operator) {
                case "<":
                    return $fieldValue < $value;
                case "<=":
                    return $fieldValue <= $value;
                case ">":
                    return $fieldValue > $value;
                case ">=":
                    return $fieldValue >= $value;
                case "==":
                    return $fieldValue == $value;
                default:
                    return false;
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function evaluateComplexNumericalCriterion($fieldValue,$operator1,$value1,$conjunction,$operator2,$value2) {
        try {
            $condition1 = $this->evaluateSimpleNumericalCriterion(
                $fieldValue,
                $operator1,
                $value1
            );
            $condition2 = $this->evaluateSimpleNumericalCriterion(
                $fieldValue,
                $operator2,
                $value2
            );

            if ($conjunction === "and") 
            {
                return $condition1 && $condition2;
            } 
            else 
            {
                return $condition1 || $condition2;
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function calculateWeights($data)
    {
        try {
            $fieldsDataResponse = $this->fetchFieldsAndCriteria();
            if($fieldsDataResponse == 0){
                return 0;
            }
            $fieldsAndCriteria = $fieldsDataResponse["data"];

            $totalWeight = 0;

            foreach ($data as $key => $value) {
                $fieldName = $key;
                $fieldValue = $value;

                foreach ($fieldsAndCriteria as $fieldCriteria) {
                    if ($fieldCriteria["name"] == $fieldName) {
                        foreach (
                            $fieldCriteria["criteria"]
                            as $criteriaDetails
                        ) {
                            $inequalityType = $criteriaDetails["type"];
                            $weight = (int) $criteriaDetails["weight"];
                            $conditionText = $criteriaDetails["criteria"];

                            if ($inequalityType === "simple") {
                                $criteriaParts = explode(" ", $conditionText);
                                $operator = $criteriaParts[1];
                                $value = (float) $criteriaParts[2];
                                $evaluation = $this->evaluateSimpleNumericalCriterion(
                                    $fieldValue,
                                    $operator,
                                    $value
                                );
                            } elseif ($inequalityType === "compound") {
                                $criteriaParts = explode(" ", $conditionText);
                                $operator1 = $criteriaParts[1];
                                $value1 = (float) $criteriaParts[2];
                                $conjunction = $criteriaParts[3];
                                $operator2 = $criteriaParts[5];
                                $value2 = (float) $criteriaParts[6];

                                $evaluation = $this->evaluateComplexNumericalCriterion(
                                    $fieldValue,
                                    $operator1,
                                    $value1,
                                    $conjunction,
                                    $operator2,
                                    $value2
                                );
                            } else {
                                $criteriaParts = explode(" ", $conditionText);
                                $operator1 = $criteriaParts[1];
                                $value1 = $criteriaParts[2];
                                $evaluation = $fieldValue === $value1;
                            }
                            if ($evaluation) {
                                $totalWeight += $weight;
                            }
                        }
                        break;
                    }
                }
            }

            return $totalWeight;
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }
}
?>
