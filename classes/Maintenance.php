<?php

require_once('../includes/db_connect.php');
require_once('../includes/functions.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class Maintenance {
    
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
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


    public function getMaintenanceRequest() {
        try
        {
            $conn = $this->db->getConnection();
            $sql = 'SELECT maintenance.*, member.firstName, member.lastName, room.roomNumber, apartment.apartmentNumber, building.buildingNumber FROM maintenance JOIN room ON room.roomId = maintenance.roomId JOIN reservation ON room.roomId = reservation.roomId JOIN resident ON resident.residentId = reservation.residentId JOIN member ON member.memberId = resident.memberId JOIN apartment ON apartment.apartmentId = room.apartmentId JOIN building ON building.buildingId = apartment.buildingId;
            ';
            $stmt = $conn->prepare($sql); 
            $stmt->execute(); 
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 
            
            return $this->successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function updateMaintenanceStatusStart($maintenanceRequestId, $assignedToName) {
        try {
            $conn = $this->db->getConnection();
            $sql = "UPDATE maintenance SET status='inProgress', assignedTo=:assignedToName WHERE id=:maintenanceRequestId";
            $stmt = $conn->prepare($sql); 
            $stmt->bindParam(':maintenanceRequestId', $maintenanceRequestId);
            $stmt->bindParam(':assignedToName', $assignedToName);
            $result = $stmt->execute(); 
             
            if ($result) {
                return $this->successResponse();
            } else {
                return $this->errorResponse();

            }
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();


        }
    }

    public function updateMaintenanceStatusEnd($maintenanceRequestId) {
        try {
            $conn = $this->db->getConnection();
            $sql = "UPDATE maintenance SET status='complete', completeDate=DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i') WHERE id=:maintenanceRequestId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':maintenanceRequestId', $maintenanceRequestId);
            $result = $stmt->execute();
        
            if ($result) {
                return $this->successResponse();
            } else {
                return $this->errorResponse();

            }
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();


        }
    }

    public function updateMaintenanceStatusReject($maintenanceRequestId) {
        try {
            $conn = $this->db->getConnection();
            $sql = "UPDATE maintenance SET status='reject', completeDate=DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i') WHERE id=:maintenanceRequestId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':maintenanceRequestId', $maintenanceRequestId);
            $result = $stmt->execute();
        
            if ($result) {
                return $this->successResponse();
            } else {
                return $this->errorResponse();


            }
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();


        }
    }

    public function getMaintenanceRequestsCount() {
        try {
            $conn = $this->db->getConnection();
            $sql = "SELECT 
                        (SELECT COUNT(id) FROM maintenance WHERE status = 'pending') AS PendingMaintenance,
                        (SELECT COUNT(id) FROM maintenance WHERE status = 'inProgress') AS inProgressMaintenance";
            $stmt = $conn->prepare($sql); 
            $stmt->execute(); 
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            return $this->successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();


        }
    }
}

?>
