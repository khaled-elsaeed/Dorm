<?php
require_once('../classes/Member.php');
require_once('../includes/functions.php');

class MemberHandler {
    private $member;
    private $criteriaHandler;
    public function __construct(Database $db) {
        $this->member = new Member($db);
        $this->criteriaHandler = new CriteriaHandler($db);

    }

    public function handleAction($action) {
        switch ($action) {
            case 'createmember':
                return $this->createMember();
            case 'memberAuth':
                return $this->memberAuth();
            case 'fetchExpelledStudents':
                return $this->getexpelledStudents();
            case 'makeAlert':
            case 'makeWarning':
                return $this->makeAlert();
            case 'makeExpulsion':
                return $this->updateStudentExpulsion();

            default:
                return array("success" => false, "message" => "Invalid member action");
        }
    }

    private function memberAuth() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $json_data = file_get_contents('php://input');
            $data = json_decode($json_data, true);
            $email = isset($data['signin-email']) ? $data['signin-email'] : '';
            $password = isset($data['signin-password']) ? $data['signin-password'] : '';
    
            // Basic form data validation
            if (empty($email) || empty($password)) {
                return array("success" => false, "message" => "Email and password are required");
            }
    
            $authenticationResult = $this->member->memberAuthenticate($email, $password);
    
            if ($authenticationResult['success']) {
                $_SESSION['user_id'] = $authenticationResult['admin_id'];

                return array("success" => true, "message" => "login successfully");
            }
    
            return $authenticationResult;
        } else {
            return array("success" => false, "message" => "Invalid request method");
        }
    }

    private function createMember() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = $_POST; 

        $invoice = $_FILES['invoice_file'];


            $score = $this->criteriaHandler->handleCalculateWeights($data);
            $data['score'] = $score;
            $UniversityId = $data['studentId'];
            
            $isExpelled =  $this->member->isExpelled($UniversityId);
            if($isExpelled['expelled']){
                return array("success" => "reject", "reason" => $isExpelled['reason']);
            }
            $createResult = $this->member->addNewMember($data,$invoice);

            if ($createResult['success']) {
                return array("success" => true, "message" => "Member created successfully");
            }

            return $createResult; // Return the result from addNewMember() method
        
    } else {
        return array("success" => false, "message" => "Invalid request method");
    }
}

private function getexpelledStudents() {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Assuming $member is an instance of some class with the method getExpelledStudents()
        $fetchData = $this->member->getExpelledStudents();

        if ($fetchData['success']) {
            return successResponse($fetchData['data']); // Assuming successResponse is a method in the same class
        } else {
            return errorResponse("Failed to fetch expelled students data");
        }
    } else {
        return array("success" => false, "message" => "Invalid request method");
    }
}

private function makeAlert() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $jsonData = file_get_contents('php://input');
        $requestData = json_decode($jsonData, true);
        if (!$requestData) {
            return errorResponse( "Invalid JSON data");
        }
        $expelledId = isset($requestData['expelledId']) ? $requestData['expelledId'] : null;
        $type = isset($requestData['type']) ? $requestData['type'] : null;
        $description = isset($requestData['description']) ? $requestData['description'] : null;
        if (empty($expelledId) || empty($description)) {
            return errorResponse("Maintenance Id and assigned To are required");
        }
        $fetchData = $this->member->addStudentAlert($expelledId, $type, $description);

        if ($fetchData['success']) {
            return successResponse(); 
        } else {
            return errorResponse("Failed to fetch expelled students data");
        }
    } else {
        return array("success" => false, "message" => "Invalid request method");
    }
}

private function updateStudentExpulsion() {
    try {
        $jsonData = file_get_contents('php://input');
        $requestData = json_decode($jsonData, true);
        if (!$requestData) {
            return errorResponse( "Invalid JSON data");
        }
        $expelledId = isset($requestData['expelledId']) ? $requestData['expelledId'] : null;
        $description = isset($requestData['description']) ? $requestData['description'] : null;
        if (empty($expelledId) || empty($description)) {
            return errorResponse("Maintenance Id and assigned To are required");
        }
        $updateResult = $this->member->updateStudentExpulsion($expelledId, $description);
        if ($updateResult['success']) {
            return successResponse(null, "Status Updated successfully");
        } else {
            return errorResponse("Failed to Update maintenance status");
        }
    } catch (Exception $e) {
        logerror($e . " An error occurred: " . $e->getMessage());
        return errorResponse();    
        }
}





    
    
}
?>
