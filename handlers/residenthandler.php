<?php
require_once('../classes/Resident.php');
require_once('../includes/functions.php');

class ResidentHandler {
    private $resident;

    public function __construct(Database $db) {
        $this->resident = new Resident($db);
    }

    public function handleAction($action) {
        switch ($action) {
            case 'fetchOccupiedResidentsCount':
                return $this->getOccupiedResidentsCount();
            case 'fetchResidents':
                return $this->getAllResidentNameAndId();
            case 'fetchResidentInfo':
                return $this->getAllResidentInfo();
                case 'fetchResidentDetails':
                    return $this->getResidentDetails();

            default:
                return array("success" => false, "message" => "Invalid request action");
        }
    }

    private function errorResponse() {
        return array("success" => false);
    }

    private function logerror($error) {
        log_error("Error: " . $error);
    }

    private function successResponse($data = null, $message = null) {
        $response = array("success" => true);
        if ($data !== null) {
            $response["data"] = $data;
        }
        if ($message !== null) {
            $response["message"] = $message;
        }
        return $response;
    }


    private function getOccupiedResidentsCount() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $data = $this->resident->getOccupiedResidentsCount();
                return $this->successResponse($data['data']);
            } catch (PDOException $e) {
                $this->logerror("An error occurred: " . $e->getMessage());
                return $this->errorResponse();
            }
        } else {
            return $this->errorResponse();
        }
    }
    
    private function getAllResidentNameAndId() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $data = $this->resident->getAllResidentNameAndId();
                return $this->successResponse($data['data']);
            } catch (PDOException $e) {
                $this->logerror("An error occurred: " . $e->getMessage());
                return $this->errorResponse();
            }
        } else {
            return $this->errorResponse();
        }
    }

    private function getAllResidentInfo() {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $data = $this->resident->getAllResidentInfo();
                return successResponse($data['data']);
            } catch (PDOException $e) {
                $this->logerror("An error occurred: " . $e->getMessage());
                return $this->errorResponse();
            }
        } else {
            return $this->errorResponse();
        }
    }

    private function getResidentDetails() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                // Get the raw POST data
                $postData = file_get_contents('php://input');
                // Decode JSON data
                $data = json_decode($postData, true);
                // Extract resident ID from the data
                $residentId = $data['residentId'];
                // Fetch resident details from the database
                $result = $this->resident->getResidentDetails($residentId);
                // Return success response with resident data
                return successResponse($result);
            } catch (PDOException $e) {
                // Log database error
                logerror("An error occurred: " . $e->getMessage());
                // Return error response
                return errorResponse();
            } catch (Exception $ex) {
                // Log any other exceptions
                logerror("An error occurred: " . $ex->getMessage());
                // Return error response
                return errorResponse();
            }
        } else {
            // Return error response if request method is not POST
            return errorResponse();
        }
    }
    
    private function fetchFieldsAndReservation() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $fetchResult = $this->Reservation->getAllResidentNameAndId();   
    
                if ($fetchResult['success']) {
                    return $this->successResponse($fetchResult['data']);
                } else {
                    return $this->errorResponse();
                }
            }
        } catch (Exception $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();        
        }
    }
    
    
    
}
?>
