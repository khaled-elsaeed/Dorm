<?php
require_once('../classes/Maintenance.php');

class MaintenanceHandler {
    private $Maintenance;

    public function __construct(Database $db) {
        $this->Maintenance = new Maintenance($db);
    }

    private function errorResponse($message) {
        return array("success" => false, "message" => $message);
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

    public function handleAction($action) {
        try {
            switch ($action) {
                case 'fetchMaintenanceRequests':
                    return $this->fetchMaintenanceRequests();
                case 'startMaintenanceProcess':
                    return $this->updateMaintenanceStatusStart();
                case 'endMaintenanceProcess':
                    return $this->updateMaintenanceStatusEnd();
                case 'rejectMaintenanceProcess':
                    return $this->updateMaintenanceStatusReject();
                case 'fetchMaintenanceRequestsCount':
                    return $this->getMaintenanceRequestsCount();
                    case 'newRequest':
                        return $this->newMaintenance();
                default:
                    return errorResponse("Invalid admin action");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    private function fetchMaintenanceRequests() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $fetchResult = $this->Maintenance->getMaintenanceRequest();       
                if ($fetchResult['success']) {
                    return $this->successResponse($fetchResult['data'], "Requests fetched successfully");
                } else {
                    return errorResponse( "Failed to fetch maintenance requests");
                }
            } else {
                return errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();        
        }
    }

    private function updateMaintenanceStatusStart() {
        try {
            $jsonData = file_get_contents('php://input');
            $requestData = json_decode($jsonData, true);
            if (!$requestData) {
                return errorResponse( "Invalid JSON data");
            }
            $maintenanceRequestId = isset($requestData['maintenanceRequestId']) ? $requestData['maintenanceRequestId'] : null;
            $assignedToName = isset($requestData['assignedToName']) ? $requestData['assignedToName'] : null;
            if (empty($maintenanceRequestId) || empty($assignedToName)) {
                return errorResponse("Maintenance Id and assigned To are required");
            }
            $updateResult = $this->Maintenance->updateMaintenanceStatusStart($maintenanceRequestId, $assignedToName);
            if ($updateResult['success']) {
                return $this->successResponse(null, "Status Updated successfully");
            } else {
                return errorResponse("Failed to Update maintenance status");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();    
            }
    }


    private function newMaintenance() {
        try {
            $jsonData = file_get_contents('php://input');
            $requestData = json_decode($jsonData, true);
            if (!$requestData) {
                return errorResponse( "Invalid JSON data");
            }
            $maintanenceDes = isset($requestData['maintenanceDescription']) ? $requestData['maintenanceDescription'] : null;
            $memberId = $_SESSION['userId'];

            $updateResult = $this->Maintenance->newMaintenance($maintanenceDes, $memberId);
            if ($updateResult['success']) {
                return $this->successResponse(null, "Status Updated successfully");
            } else {
                return errorResponse("Failed to Update maintenance status");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();    
            }
    }
    
    private function updateMaintenanceStatusEnd() {
        try {
            $jsonData = file_get_contents('php://input');
            $requestData = json_decode($jsonData, true);
            if (!$requestData) {
                return errorResponse( "Invalid JSON data");
            }
            $maintenanceRequestId = isset($requestData['maintenanceRequestId']) ? $requestData['maintenanceRequestId'] : null;
            if (empty($maintenanceRequestId)) {
                return errorResponse("Maintenance Id is required");
            }
            $updateResult = $this->Maintenance->updateMaintenanceStatusEnd($maintenanceRequestId);
            if ($updateResult['success']) {
                return $this->successResponse(null, "Status Updated successfully");
            } else {
                return errorResponse("Failed to Update maintenance status");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();        
        }
    }

    private function updateMaintenanceStatusReject() {
        try {
            $jsonData = file_get_contents('php://input');
            $requestData = json_decode($jsonData, true);
            if (!$requestData) {
                return errorResponse( "Invalid JSON data");
            }
            $maintenanceRequestId = isset($requestData['maintenanceRequestId']) ? $requestData['maintenanceRequestId'] : null;
            if (empty($maintenanceRequestId)) {
                return errorResponse( "Maintenance Id is required");
            }
            $updateResult = $this->Maintenance->updateMaintenanceStatusReject($maintenanceRequestId);
            if ($updateResult['success']) {
                return $this->successResponse(null, "Status Updated successfully");
            } else {
                return errorResponse("Failed to Update maintenance status");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();    
            }
    }
    
    private function getMaintenanceRequestsCount() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $json_data = file_get_contents('php://input');
                $fetchResult = $this->Maintenance->getMaintenanceRequestsCount();   
                if ($fetchResult['success']) {
                    return $this->successResponse($fetchResult['data'], "RequestsCount fetched successfully");
                } else {
                    return errorResponse("Failed to fetch maintenance requests");
                }
            } else {
                return errorResponse("Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();        
        
        }
    }
}
?>
