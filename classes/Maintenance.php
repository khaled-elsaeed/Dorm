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
            $sql = 'SELECT maintenance.*, member.firstName, member.lastName, room.roomNumber, apartment.apartmentNumber, building.buildingNumber FROM maintenance JOIN room ON room.id = maintenance.roomId JOIN reservation ON room.id = reservation.roomId JOIN resident ON resident.id = reservation.residentId JOIN member ON member.id = resident.memberId JOIN apartment ON apartment.id = room.apartmentId JOIN building ON building.id = apartment.buildingId;
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

    public function getRoomIdByMemberId($memberId) {
        try {
            $conn = $this->db->getConnection();
    
            // Get the first resident ID by member ID
            $sqlResident = "SELECT id FROM resident WHERE memberId = :memberId ORDER BY id ASC LIMIT 1";
            $stmtResident = $conn->prepare($sqlResident);
            $stmtResident->bindParam(':memberId', $memberId);
            $stmtResident->execute();
            $residentResult = $stmtResident->fetch(PDO::FETCH_ASSOC);
    
            if (!$residentResult) {
                return null; // No resident found for the member
            }
    
            $residentId = $residentResult['id'];
    
            // Using the resident ID, get the corresponding room ID from the reservation table
            $sqlReservation = "SELECT roomId FROM reservation WHERE residentId = :residentId";
            $stmtReservation = $conn->prepare($sqlReservation);
            $stmtReservation->bindParam(':residentId', $residentId);
            $stmtReservation->execute();
            $reservationResult = $stmtReservation->fetch(PDO::FETCH_ASSOC);
    
            if ($reservationResult) {
                return $reservationResult['roomId'];
            } else {
                return null; // No reservation found for the member's resident
            }
        } catch (PDOException $e) {
            $this->logError($e . " An error occurred: " . $e->getMessage());
            return null; // Error occurred, return null
        }
    }
    

    public function newMaintenance($maintenanceDescription, $memberId) {
        try {
            // Get room ID based on member ID
            $roomId = $this->getRoomIdByMemberId($memberId);
            
            if ($roomId === null) {
                // Handle case where no room is found for the member
                return $this->errorResponse("No room found for member ID: $memberId");
            }
    
            // Insert maintenance request with retrieved room ID
            $conn = $this->db->getConnection();
            $sql = "INSERT INTO `maintenance` (`description`, `roomId`) VALUES (:description, :roomId)";
            $stmt = $conn->prepare($sql); 
            $stmt->bindParam(':description', $maintenanceDescription);
            $stmt->bindParam(':roomId', $roomId);
            $result = $stmt->execute(); 
            
            if ($result) {
                return $this->successResponse();
            } else {
                return $this->errorResponse();
            }
        } catch (PDOException $e) {
            $this->logError($e . " An error occurred: " . $e->getMessage());
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
