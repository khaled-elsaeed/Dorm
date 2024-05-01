<?php
require_once "../includes/db_connect.php";
require_once "../includes/mongodb_connect.php";
require_once "../includes/functions.php";

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class Member
{
    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    public function memberAuthenticate($email, $password)
    {
        $conn = $this->db->getConnection();

        $sql =
            "SELECT admin_id, password_hash, username FROM admin WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin && password_verify($password, $admin["password_hash"])) {
            error_log(
                "Admin with ID {$admin["admin_id"]} authenticated successfully."
            );
            return [
                "success" => true,
                "message" => "Authentication successful",
                "admin_id" => $admin["admin_id"],
                "username" => $admin["username"],
            ];
        } else {
            error_log("Authentication failed for email: $email");
            return [
                "success" => false,
                "message" => "Invalid email or password",
            ];
        }
    }

    public function addNewMember($data, $invoice)
    {
        $conn = $this->db->getConnection();
        try {
            $conn->beginTransaction();

            try {
                $insertMemberStmt = $conn->prepare(
                    "INSERT INTO Member (firstName, middleName, lastName, birthDate, gender, nationality, governmentId) VALUES (:firstName, :middleName, :lastName, :birthDate, :gender, :nationality, :governmentId)"
                );
                $insertMemberStmt->bindParam(":firstName", $data["firstName"]);
                $insertMemberStmt->bindParam(
                    ":middleName",
                    $data["middleName"]
                );
                $insertMemberStmt->bindParam(":lastName", $data["lastName"]);
                $insertMemberStmt->bindParam(":birthDate", $data["birthDate"]);
                $insertMemberStmt->bindParam(":gender", $data["gender"]);
                $insertMemberStmt->bindParam(
                    ":nationality",
                    $data["nationality"]
                );
                $insertMemberStmt->bindParam(
                    ":governmentId",
                    $data["govtIssuedId"]
                );
                $insertMemberStmt->execute();
                $memberId = $conn->lastInsertId();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into member table: " . $e->getMessage()
                );
            }

            // LoginInfo table
            try {
                $generatedPassword = $this->generatePassword();
                $password = $generatedPassword["password"];
                $hashedPassword = $generatedPassword["hashedPassword"];
                $insertLoginStmt = $conn->prepare(
                    "INSERT INTO LoginInfo (email, passwordHash, memberId) VALUES (:emailAddress, :hashedPassword, :memberId)"
                );
                $insertLoginStmt->bindParam(":emailAddress", $data["email"]);
                $insertLoginStmt->bindParam(":hashedPassword", $hashedPassword);
                $insertLoginStmt->bindParam(":memberId", $memberId);
                $insertLoginStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into LoginInfo table: " . $e->getMessage()
                );
            }

            // ContactInfo table
            try {
                $insertContactStmt = $conn->prepare(
                    "INSERT INTO ContactInfo (email, phoneNumber, memberId) VALUES (:emailAddress, :phoneNumber, :memberId)"
                );
                $insertContactStmt->bindParam(":emailAddress", $data["email"]);
                $insertContactStmt->bindParam(
                    ":phoneNumber",
                    $data["phoneNumber"]
                );
                $insertContactStmt->bindParam(":memberId", $memberId);
                $insertContactStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into ContactInfo table: " .
                        $e->getMessage()
                );
            }

            // AddressInfo table
            try {
                $insertAddressStmt = $conn->prepare(
                    "INSERT INTO AddressInfo ( governorate, city, address, memberId) VALUES (:addressGovernorate, :addressCity, :address, :memberId)"
                );
                $insertAddressStmt->bindParam(
                    ":addressGovernorate",
                    $data["governorate"]
                );
                $insertAddressStmt->bindParam(":addressCity", $data["city"]);
                $insertAddressStmt->bindParam(":address", $data["street"]);
                $insertAddressStmt->bindParam(":memberId", $memberId);
                $insertAddressStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into AddressInfo table: " .
                        $e->getMessage()
                );
            }

            if (isset($data["cgpa"])) {
                $cgpa = $data["cgpa"]; // Assuming 'gpa' corresponds to cgpa
                $certificateType = null;
                $certificateScore = null;
            } else {
                $cgpa = null;
                $certificateType = $data["certificateType"];
                $certificateScore = $data["certificateScore"];
            }

            $sql = "INSERT INTO FacultyInfo (faculty, department, studentId, level, cgpa, certificateType, certificateScore, email, memberId) 
                    VALUES (:faculty, :department, :studentId, :level, :cgpa, :certificateType, :certificateScore, :email, :memberId)";

            try {
                $insertFacultyStmt = $conn->prepare($sql);
                $insertFacultyStmt->bindParam(":faculty", $data["faculty"]);
                $insertFacultyStmt->bindParam(":department", $data["program"]);
                $insertFacultyStmt->bindParam(":email", $data["email"]);
                $insertFacultyStmt->bindParam(":level", $data["level"]);
                $insertFacultyStmt->bindParam(":studentId", $data["studentId"]);
                $insertFacultyStmt->bindParam(":cgpa", $cgpa);
                $insertFacultyStmt->bindParam(
                    ":certificateType",
                    $certificateType
                );
                $insertFacultyStmt->bindParam(
                    ":certificateScore",
                    $certificateScore
                );
                $insertFacultyStmt->bindParam(":memberId", $memberId);

                $insertFacultyStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into FacultyInfo table: " .
                        $e->getMessage()
                );
            }

            // ParentalInfo table
            try {
                $parentName =
                    $data["parentFirstName"] . " " . $data["parentLastName"];
                $insertParentStmt = $conn->prepare(
                    "INSERT INTO ParentalInfo (name, phoneNumber, location, memberId) VALUES (:parentName, :parentPhoneNumber, :parentLocation, :memberId)"
                );
                $insertParentStmt->bindParam(":parentName", $parentName);
                $insertParentStmt->bindParam(
                    ":parentPhoneNumber",
                    $data["parentPhoneNumber"]
                );
                $insertParentStmt->bindParam(
                    ":parentLocation",
                    $data["parentLocation"]
                );
                $insertParentStmt->bindParam(":memberId", $memberId);
                $insertParentStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into ParentalInfo table: " .
                        $e->getMessage()
                );
            }

            try {
                $insertPaymentStmt = $conn->prepare(
                    "INSERT INTO payment (memberID) VALUES (:memberID)"
                );
                $insertPaymentStmt->bindParam(":memberID", $memberId);
                $insertPaymentStmt->execute();
                $paymentId = $conn->lastInsertId();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into Payment table: " . $e->getMessage()
                );
            }

            try {
                $this->uploadInvoice($invoice, $paymentId);
            } catch (PDOException $e) {
                throw new Exception(
                    "Error uploading invoice image: " . $e->getMessage()
                );
            }

            try {
                $insertResidentStmt = $conn->prepare(
                    "INSERT INTO resident (memberID, score) VALUES (:memberID, :score)"
                );
                $insertResidentStmt->bindParam(":memberID", $memberId);
                $insertResidentStmt->bindParam(":score", $data["score"]);
                $insertResidentStmt->execute();
            } catch (PDOException $e) {
                throw new Exception(
                    "Error inserting into Resident table: " . $e->getMessage()
                );
            }

            $conn->commit();

            return [
                "success" => true,
                "message" => "Member added successfully",
                "memberId" => $memberId,
            ];
        } catch (PDOException $e) {
            $conn->rollBack();
            return [
                "success" => false,
                "message" => "Transaction failed: " . $e->getMessage(),
            ];
        } catch (Exception $e) {
            $conn->rollBack();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }

    public function generatePassword()
    {
        $length = 10;
        $chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $password = "";
        $charsLength = strlen($chars) - 1;
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[rand(0, $charsLength)];
        }

        $hashedPassword = md5($password);

        return ["password" => $password, "hashedPassword" => $hashedPassword];
    }

    public function uploadInvoice($invoice, $paymentId)
    {
        try {
            $imageData = file_get_contents($invoice["tmp_name"]);

            $encodedImage = new MongoDB\BSON\Binary(
                $imageData,
                MongoDB\BSON\Binary::TYPE_GENERIC
            );

            $document = [
                "paymentId" => $paymentId,
                "image" => $encodedImage,
            ];

            $result = insertDocument($document);

            if ($result->getInsertedCount() > 0) {
                return "sucess to upload image to MongoDB.";
            } else {
                return "Failed to upload image to MongoDB.";
            }
        } catch (Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }


    public function getAllPayments(){
        try {
            $conn = $this->db->getConnection();

            $sql = "SELECT * FROM payment";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $data;

        } catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }



    public function getAllInvoices(): array {
        try {
            // Retrieve all payments
            $payments = $this->getAllPayments();
    
            if (!empty($payments)) {
                // Retrieve all invoices associated with payments
                $invoices = $this->getInvoicesByPaymentIds(array_column($payments, 'id'));
    
                // Decode invoice images if they are stored as BSON binary
                $invoices = $this->decodeInvoiceImages($invoices);
    
                // Combine payments with their associated invoices
                $paymentsWithInvoices = $this->combinePaymentsWithInvoices($payments, $invoices);
    
                return successResponse($paymentsWithInvoices);
            } else {
                // If no payments were retrieved, return an empty array
                return [];
            }
        } catch (MongoDB\Driver\Exception\Exception $e) {
            // Handle any exceptions that occur during the retrieval process
            die("Error retrieving invoices: " . $e->getMessage());
        }
    }
    
    
    private function getInvoicesByPaymentIds($paymentIds) {
        // Retrieve invoices associated with the given payment IDs
        $invoices = getAllDocuments(); // Assuming this method retrieves invoices from MongoDB
        $filteredInvoices = [];
    
        foreach ($invoices as $invoice) {
            if (in_array($invoice['paymentId'], $paymentIds)) {
                $filteredInvoices[] = $invoice;
            }
        }
        return $filteredInvoices;
    }
    
    private function decodeInvoiceImages($invoices) {
        foreach ($invoices as &$invoice) {
            if (isset($invoice['image']) && $invoice['image'] instanceof MongoDB\BSON\Binary) {
                $invoice['image'] = $this->decodeInvoiceImage($invoice['image']);
            }
        }
        return $invoices;
    }
    
    private function combinePaymentsWithInvoices($payments, $invoices) {
        $paymentsWithInvoices = [];
    
        foreach ($payments as $payment) {
            $paymentId = $payment['id'];
            $payment['invoices'] = [];
    
            foreach ($invoices as $invoice) {
                if ($invoice['paymentId'] == $paymentId) {
                    $payment['invoices'][] = $invoice;
                }
            }
    
            $paymentsWithInvoices[] = $payment;
        }
    
        return $paymentsWithInvoices;
    }
    
    public function decodeInvoiceImage($encodedImage) {
        try {
            $imageData = $encodedImage->getData();
            return $imageData;
        } catch (Exception $e) {
            return "Error decoding image: " . $e->getMessage();
        }
    }
    
    
    
    

    public function isExpelled($universityId)
    {
        $conn = $this->db->getConnection();
        $sql =
            "SELECT expelledstudent.studentId, note.description
            FROM expelledstudent
            JOIN alert ON alert.expelledId = expelledstudent.id
            JOIN note ON note.alertId = alert.id 
            WHERE expelledstudent.expulsionStatus = 'yes' AND expelledstudent.studentId = :universityId AND alert.type = 'expulsion';";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":universityId", $universityId);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $expelledData = $stmt->fetch(PDO::FETCH_ASSOC);
            $reason = $expelledData["expelledReason"];
            return ["expelled" => true, "reason" => $reason];
        } else {
            return ["expelled" => false];
        }
    }

    public function fetchExpelledStudents()
    {
        try {
            $conn = $this->db->getConnection();

            $sql_students = "SELECT * FROM expelledstudent";
            $stmt_students = $conn->prepare($sql_students);
            $stmt_students->execute();
            return $stmt_students->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception(
                "Database error while fetching expelled students: " .
                    $e->getMessage()
            );
        }
    }

    public function fetchAllAlerts()
    {
        $conn = $this->db->getConnection();

        $sql_alerts = "SELECT * FROM alert";
        $stmt_alerts = $conn->prepare($sql_alerts);
        $stmt_alerts->execute();
        return $stmt_alerts->fetchAll(PDO::FETCH_ASSOC);
    }

    public function organizeAlertsByStudent($alerts)
    {
        $alertsByStudent = [];
        foreach ($alerts as $alert) {
            $expelledId = $alert["expelledId"];
            if (!isset($alertsByStudent[$expelledId])) {
                $alertsByStudent[$expelledId] = [];
            }
            $alertsByStudent[$expelledId][] = $alert;
        }
        return $alertsByStudent;
    }

    public function fetchAllNotes()
    {
        $conn = $this->db->getConnection();

        $sql_notes = "SELECT * FROM note";
        $stmt_notes = $conn->prepare($sql_notes);
        $stmt_notes->execute();
        return $stmt_notes->fetchAll(PDO::FETCH_ASSOC);
    }

    public function organizeNotesByAlert($notes)
    {
        $notesByAlert = [];
        foreach ($notes as $note) {
            $alertId = $note["alertId"];
            if (!isset($notesByAlert[$alertId])) {
                $notesByAlert[$alertId] = [];
            }
            $notesByAlert[$alertId][] = $note;
        }
        return $notesByAlert;
    }

    public function assembleStudentsArray(
        $expelledStudents,
        $alertsByStudent,
        $notesByAlert
    ) {
        $students = [];
        foreach ($expelledStudents as $expelledStudent) {
            $expelledId = $expelledStudent["id"];
            $studentName = $expelledStudent["name"]; // Assuming the column name is 'studentName'
            $studentId = $expelledStudent["studentId"]; // Assuming the column name is 'studentId'
            $expulstionStatues = $expelledStudent["expulsionStatus"]; // Assuming the column name is 'studentId'
            $expulsionType = $expelledStudent["expulsionType"]; // Assuming the column name is 'studentId'

            $studentAlerts = isset($alertsByStudent[$expelledId])
                ? $alertsByStudent[$expelledId]
                : [];
            $student = [
                "id" => $expelledId,
                "name" => $studentName,
                "studentId" => $studentId,
                "expulsionStatus" => $expulstionStatues,
                "expulsionType" => $expulsionType,
                "alerts" => [],
            ];
            foreach ($studentAlerts as $alert) {
                $alertId = $alert["id"];
                $description = isset($notesByAlert[$alertId])
                    ? $notesByAlert[$alertId][0]["description"]
                    : "";
                // Construct alert array
                $alertArray = [
                    "id" => $alert["id"],
                    "type" => $alert["type"],
                    "expelledId" => $alert["expelledId"],
                    "date" => $alert["date"],
                    "description" => $description,
                ];
                $student["alerts"][] = $alertArray; // Add alert array to alerts array of student
            }
            $students[] = $student; // Add student array to students array
        }
        return $students;
    }

    public function getExpelledStudents()
    {
        try {
            $conn = $this->db->getConnection();
            $students = [];

            // Fetch all expelled students
            $expelledStudents = $this->fetchExpelledStudents($conn);

            // Fetch all alerts
            $alerts = $this->fetchAllAlerts($conn);

            // Organize alerts by student
            $alertsByStudent = $this->organizeAlertsByStudent($alerts);

            // Fetch all notes
            $notes = $this->fetchAllNotes($conn);

            // Organize notes by alert
            $notesByAlert = $this->organizeNotesByAlert($notes);

            // Assemble students array with alerts
            $students = $this->assembleStudentsArray(
                $expelledStudents,
                $alertsByStudent,
                $notesByAlert
            );

            return successResponse($students);
        } catch (PDOException $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function addExpelledStudent($studentId, $name)
    {
        try {
            $conn = $this->db->getConnection();
            $sql =
                "INSERT INTO expelledstudent (studentId, name) VALUES (:studentId, :name)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":studentId", $studentId);
            $stmt->bindParam(":name", $name);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function addStudentAlert($expelledId, $type, $description)
    {
        try {
            $conn = $this->db->getConnection();
            $sql =
                "INSERT INTO alert (expelledId, type) VALUES (:expelledId, :type)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":expelledId", $expelledId);
            $stmt->bindParam(":type", $type);
            $stmt->execute();

            // Get the ID of the last inserted row
            $alertId = $conn->lastInsertId();

            $sql =
                "INSERT INTO note (alertId, description) VALUES (:alertId, :description)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":alertId", $alertId);
            $stmt->bindParam(":description", $description);
            $stmt->execute();
            return successResponse();
        } catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function updateStudentExpulsion($expelledId, $description,$duration)
    {
        try {
            $conn = $this->db->getConnection();
            $sql =
                "UPDATE expelledstudent SET expulsionStatus = 'yes' , expulsionType	 = :duration WHERE id = :expelledId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":expelledId", $expelledId);
            $stmt->bindParam(":duration", $duration);

            $stmt->execute();

            $this->addStudentAlert($expelledId, "expulsion", $description);
            return successResponse();
        } catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }
    public function updatePaymentStatues($paymentId, $paymentStatues)
{
    try {
        $conn = $this->db->getConnection();
        $sql = "UPDATE payment SET status = :paymentStatues WHERE id = :paymentId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":paymentId", $paymentId); // Corrected parameter binding
        $stmt->bindParam(":paymentStatues", $paymentStatues);

        $stmt->execute();
        return successResponse();
    } catch (PDOException $e) {
        logerror($e . " An error occurred: " . $e->getMessage());
        return errorResponse();
    }
}

}


?>
