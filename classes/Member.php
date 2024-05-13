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

    public function memberAuthenticate($email, $password) {
        $conn = $this->db->getConnection();
        try {
            $sql = "SELECT 
            memberId, 
            passwordHash,
            CONCAT(member.firstName, member.lastName) AS username
        FROM 
            logininfo 
        JOIN 
            member ON logininfo.memberId = member.id 
        WHERE 
            email = :email;
        ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($data) {
                if (password_verify($password, $data['passwordHash'])) {
                    $responseData = [
                        'memberId' => $data['memberId'],
                        'username' => $data['username']
                    ];
                    return successResponse($responseData);
                } else {
                    log_error("Authentication failed for email: $email - Incorrect password", $conn);
                    return errorResponseText("Incorrect password");
                }
            } else {
                log_error("Authentication failed - Email not found: $email", $conn);
                return errorResponseText("Email not found");
            }
        } catch (PDOException $e) {
            log_error("Database error: " . $e->getMessage(), $conn);
            return errorResponse();
        }
    }

    public function addNewMember($data, $invoice, $profilePicture)
    {
        $conn = $this->db->getConnection();
        try {
            $conn->beginTransaction();
    
            $memberId = $this->insertMember($data, $conn);
            $this->insertLoginInfo($data, $memberId, $conn);
            $this->insertContactInfo($data, $memberId, $conn);
            $this->insertAddressInfo($data, $memberId, $conn);
            $this->insertFacultyInfo($data, $memberId, $conn);
    
            if (isset($data["cgpa"])) {
                $cgpa = $data["cgpa"];
                $certificateType = null;
                $certificateScore = null;
            } else {
                $cgpa = null;
                $certificateType = $data["certificateType"];
                $certificateScore = $data["certificateScore"];
            }
    
            $paymentId = $this->insertPayment($memberId, $conn);
            $this->uploadInvoice($memberId, $invoice, $paymentId, $profilePicture);
            $this->insertResident($memberId, $data["score"], $conn);
    
            $conn->commit();
    
            return [
                "success" => true,
                "message" => "Member added successfully",
                "memberId" => $memberId,
            ];
        } catch (PDOException $e) {
            $conn->rollBack();
            log_error("Transaction failed: " . $e->getMessage(), $conn);
            return [
                "success" => false,
                "message" => "Transaction failed: " . $e->getMessage(),
            ];
        } catch (Exception $e) {
            $conn->rollBack();
            log_error("Error adding member: " . $e->getMessage(), $conn);
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
    
    private function insertMember($data, $conn)
    {
        try {
            $insertMemberStmt = $conn->prepare(
                "INSERT INTO Member (firstName, middleName, lastName, birthDate, gender, nationality, governmentId) VALUES (:firstName, :middleName, :lastName, :birthDate, :gender, :nationality, :governmentId)"
            );
            $insertMemberStmt->bindParam(":firstName", $data["firstName"]);
            $insertMemberStmt->bindParam(":middleName", $data["middleName"]);
            $insertMemberStmt->bindParam(":lastName", $data["lastName"]);
            $insertMemberStmt->bindParam(":birthDate", $data["birthDate"]);
            $insertMemberStmt->bindParam(":gender", $data["gender"]);
            $insertMemberStmt->bindParam(":nationality", $data["nationality"]);
            $insertMemberStmt->bindParam(":governmentId", $data["govtIssuedId"]);
            $insertMemberStmt->execute();
            return $conn->lastInsertId();
        } catch (PDOException $e) {
            log_error("Error inserting into member table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into member table: " . $e->getMessage());
        }
    }
    
    private function insertLoginInfo($data, $memberId, $conn)
    {
        try {
            $generatedPassword = $this->generatePassword();
            $hashedPassword = $generatedPassword["hashedPassword"];
            $insertLoginStmt = $conn->prepare(
                "INSERT INTO LoginInfo (email, passwordHash, memberId) VALUES (:emailAddress, :hashedPassword, :memberId)"
            );
            $insertLoginStmt->bindParam(":emailAddress", $data["email"]);
            $insertLoginStmt->bindParam(":hashedPassword", $hashedPassword);
            $insertLoginStmt->bindParam(":memberId", $memberId);
            $insertLoginStmt->execute();
        } catch (PDOException $e) {
            log_error("Error inserting into LoginInfo table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into LoginInfo table: " . $e->getMessage());
        }
    }
    
    private function insertContactInfo($data, $memberId, $conn)
    {
        try {
            $insertContactStmt = $conn->prepare(
                "INSERT INTO ContactInfo (email, phoneNumber, memberId) VALUES (:emailAddress, :phoneNumber, :memberId)"
            );
            $insertContactStmt->bindParam(":emailAddress", $data["email"]);
            $insertContactStmt->bindParam(":phoneNumber", $data["phoneNumber"]);
            $insertContactStmt->bindParam(":memberId", $memberId);
            $insertContactStmt->execute();
        } catch (PDOException $e) {
            log_error("Error inserting into ContactInfo table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into ContactInfo table: " . $e->getMessage());
        }
    }
    
    private function insertAddressInfo($data, $memberId, $conn)
    {
        try {
            $insertAddressStmt = $conn->prepare(
                "INSERT INTO AddressInfo ( governorate, city, address, memberId) VALUES (:addressGovernorate, :addressCity, :address, :memberId)"
            );
            $insertAddressStmt->bindParam(":addressGovernorate", $data["governorate"]);
            $insertAddressStmt->bindParam(":addressCity", $data["city"]);
            $insertAddressStmt->bindParam(":address", $data["street"]);
            $insertAddressStmt->bindParam(":memberId", $memberId);
            $insertAddressStmt->execute();
        } catch (PDOException $e) {
            log_error("Error inserting into AddressInfo table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into AddressInfo table: " . $e->getMessage());
        }
    }
    
    private function insertFacultyInfo($data, $memberId, $conn)
    {
        try {
            if (isset($data["cgpa"])) {
                $cgpa = $data["cgpa"]; 
                $certificateType = null;
                $certificateScore = null;
            } else {
                $cgpa = null;
                $certificateType = $data["certificateType"];
                $certificateScore = $data["certificateScore"];
            }
    
            $sql = "INSERT INTO FacultyInfo (faculty, department, studentId, level, cgpa, certificateType, certificateScore, email, memberId) 
                    VALUES (:faculty, :department, :studentId, :level, :cgpa, :certificateType, :certificateScore, :email, :memberId)";
    
            $insertFacultyStmt = $conn->prepare($sql);
            $insertFacultyStmt->bindParam(":faculty", $data["faculty"]);
            $insertFacultyStmt->bindParam(":department", $data["program"]);
            $insertFacultyStmt->bindParam(":email", $data["email"]);
            $insertFacultyStmt->bindParam(":level", $data["level"]);
            $insertFacultyStmt->bindParam(":studentId", $data["studentId"]);
            $insertFacultyStmt->bindParam(":cgpa", $cgpa);
            $insertFacultyStmt->bindParam(":certificateType", $certificateType);
            $insertFacultyStmt->bindParam(":certificateScore", $certificateScore);
            $insertFacultyStmt->bindParam(":memberId", $memberId);
    
            $insertFacultyStmt->execute();
        } catch (PDOException $e) {
            log_error("Error inserting into FacultyInfo table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into FacultyInfo table: " . $e->getMessage());
        }
    }
    
    private function insertPayment($memberId, $conn)
    {
        try {
            $insertPaymentStmt = $conn->prepare(
                "INSERT INTO Payment ( memberId ) VALUES (:memberId)"
            );
            $insertPaymentStmt->bindParam(":memberId", $memberId);
            $insertPaymentStmt->execute();
            return $conn->lastInsertId();
        } catch (PDOException $e) {
            log_error("Error inserting into Payment table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into Payment table: " . $e->getMessage());
        }
    }
    
    private function uploadInvoice($memberId, $invoice, $paymentId, $profilePicture)
{
    try {
        // Directory for uploads
        $targetDir = "../dashboard/admin/pages/invoice/";

        // Create directory if it doesn't exist
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Uploading Invoice
        $invoiceFileName = basename($invoice["name"]);
        $targetFilePathInvoice = $targetDir . $invoiceFileName;
        move_uploaded_file($invoice["tmp_name"], $targetFilePathInvoice);

        // Uploading Profile Picture
        $profilePictureName = basename($profilePicture["name"]);
        $targetFilePathProfile = $targetDir . $profilePictureName;
        move_uploaded_file($profilePicture["tmp_name"], $targetFilePathProfile);

        // Updating docs Table with File Paths
        $conn = $this->db->getConnection();
        $insertDocsStmt = $conn->prepare(
            "INSERT INTO docs (memberId, invoicePath, profilePicturePath) VALUES (:memberId, :invoicePath, :profilePicturePath)"
        );
        $insertDocsStmt->bindParam(":memberId", $memberId);
        $insertDocsStmt->bindParam(":invoicePath", $targetFilePathInvoice);
        $insertDocsStmt->bindParam(":profilePicturePath", $targetFilePathProfile);
        $insertDocsStmt->execute();

        
    } catch (PDOException $e) {
        log_error("Error uploading files: " . $e->getMessage(), $conn);
        throw new Exception("Error uploading files: " . $e->getMessage());
    }
}

function getAllDocsData() {
    try {
        $conn = $this->db->getConnection();

        // Prepare the SQL query to fetch all data from the docs table
        $sql = "SELECT d.*, CONCAT(m.firstName, ' ', m.lastName) AS memberName , m.status FROM docs d JOIN Member m ON d.memberId = m.id";
        $stmt = $conn->query($sql);
        $docsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return success response with the retrieved data
        return successResponse($docsData);
    } catch (PDOException $e) {
        // Log any database errors
        log_error("Database error: " . $e->getMessage());
        // Return error response
        return errorResponseText("Database error occurred");
    }
}



    
    private function insertResident($memberId, $score, $conn)
    {
        try {
            $insertResidentStmt = $conn->prepare(
                "INSERT INTO Resident (score, memberId) VALUES (:score, :memberId)"
            );
            $insertResidentStmt->bindParam(":score", $score);
            $insertResidentStmt->bindParam(":memberId", $memberId);
            $insertResidentStmt->execute();
        } catch (PDOException $e) {
            log_error("Error inserting into Resident table: " . $e->getMessage(), $conn);
            throw new Exception("Error inserting into Resident table: " . $e->getMessage());
        }
    }
    
    function randomPassword($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $password = '';
        $charLength = strlen($characters);
        
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, $charLength - 1)];
        }
        
        return $password;
    }
    
    private function generatePassword()
    {
        $password = $this->randomPassword();
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        return ["password" => $password, "hashedPassword" => $hashedPassword];
    }
    
    
    
   
    public function getAllMemberStatuses() {
        try {
            // Establish a database connection
            $conn = $this->db->getConnection();
    
            // Prepare and execute the SQL query to retrieve member statuses
            $query = "SELECT id AS memberId, status, CONCAT(firstName, ' ', middleName,' ',lastName) AS name FROM member";
            $statement = $conn->prepare($query);
            $statement->execute();
    
            // Fetch all member statuses as associative array
            $memberStatuses = $statement->fetchAll(PDO::FETCH_ASSOC);
            
            if (!$memberStatuses) {
                throw new Exception("No member statuses found.");
            }
            
            return $memberStatuses;
        } catch (PDOException $e) {
            // Handle database connection or query errors
            die("Error retrieving member statuses: " . $e->getMessage());
        } catch (Exception $e) {
            // Handle other exceptions
            die("Error: " . $e->getMessage());
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
    public function updateDocStatues($memberId, $docStatues)
    {
    try {
        $conn = $this->db->getConnection();
        $sql = "UPDATE member SET status = :docStatues WHERE id = :memberId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":memberId", $memberId); // Corrected parameter binding
        $stmt->bindParam(":docStatues", $docStatues);

        $stmt->execute();
        return successResponse();
    } catch (PDOException $e) {
        logerror($e . " An error occurred: " . $e->getMessage());
        return errorResponse();
    }
}

}


?>
