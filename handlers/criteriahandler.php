<?php
require_once "../classes/Criteria.php";
require_once "../includes/functions.php";

class CriteriaHandler
{
    private $Criteria;

    public function __construct(Database $db)
    {
        $this->Criteria = new Criteria($db);
    }

    private function errorResponse($message)
    {
        return ["success" => false, "message" => $message];
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

    public function handleAction($action)
    {
        switch ($action) {
            case "fetchCriteria":
                return $this->fetchFieldsAndCriteria();
            case "updateCriteriaWeight":
                return $this->updateCriteriaWeight();
            case "newCriteria":
                return $this->addCriteria();
            case "removeCriteria":
                return $this->DeleteCriteria();
            default:
                return $this->errorResponse("Invalid admin action");
        }
    }

    private function fetchFieldsAndCriteria()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] === "GET") {
                $json_data = file_get_contents("php://input");
                $fetchResult = $this->Criteria->fetchFieldsAndCriteria();
                // Check if the fetch was successful
                if ($fetchResult["success"]) {
                    if (empty($fetchResult["data"])) {
                    
                        return successResponse("empty");
                    }
                    return successResponse($fetchResult["data"]);
                } else {
                    return $this->errorResponse("Failed to fetch critera");
                }
            } else {
                return $this->errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function updateCriteriaWeight()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] === "POST") {
                $postData = file_get_contents("php://input");
                $postDataArray = json_decode($postData, true);

                $criteriaId = isset($postDataArray["criteriaId"])? $postDataArray["criteriaId"]: null;
                $newWeight = isset($postDataArray["newWeight"])? $postDataArray["newWeight"]: null;

                if (empty($criteriaId) || empty($newWeight)) {
                    return $this->errorResponse(
                        "Maintenance Id and assigned To are required"
                    );
                }

                // Call the method to update maintenance status from the Maintenance class
                $updateResult = $this->Criteria->updateCriteriaWeight($criteriaId,$newWeight);

                if ($updateResult["success"]) {
                    return $this->successResponse(
                        null,
                        "Criteria Updated successfully"
                    );
                } else {
                    return $this->errorResponse(
                        "Criteria Not Updated successfully"
                    );
                }
            } else {
                return $this->errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function addCriteria()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] === "POST") {
                $postData = file_get_contents("php://input");
                $postDataArray = json_decode($postData, true);
                $fieldId = isset($postDataArray["fieldId"])? $postDataArray["fieldId"]: null;
                $weight = isset($postDataArray["weight"])? $postDataArray["weight"]: null;
                $type = isset($postDataArray["type"])? $postDataArray["type"]: null;
                $criteria = isset($postDataArray["criteria"])? $postDataArray["criteria"]: null;

                $updateResult = $this->Criteria->addCriteria($fieldId,$type,$criteria,$weight);

                if ($updateResult["success"]) {
                    return $this->successResponse(
                        null,
                        "Criteria added successfully"
                    );
                } else {
                    return $this->errorResponse(
                        "Criteria Not added successfully"
                    );
                }
            } else {
                return $this->errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function deleteCriteria()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] === "POST") {

                $postData = file_get_contents("php://input");
                $postDataArray = json_decode($postData, true);
                $criteriaId = isset($postDataArray["criteriaId"])? $postDataArray["criteriaId"] : null;

                $updateResult = $this->Criteria->deleteCriteria($criteriaId);

                if ($updateResult["success"]) {
                    return $this->successResponse(
                        null,
                        "Criteria deleted successfully"
                    );
                } else {
                    return errorResponseText($updateResult["error"]);
                }
            } else {
                return $this->errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function handleCalculateWeights($data)
    {
        return $this->Criteria->calculateWeights($data);
    }
}
?>
