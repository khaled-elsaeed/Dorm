<?php
require_once('../includes/functions.php');

class Reservation {
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

    public function assignRoomsToResidents() {
        try {
            $vacantRooms = $this->getVacantRooms();
            $vacantResidents = $this->getVacantResidentsOrderedByScore();
            foreach ($vacantRooms as $room) {
                if (empty($vacantResidents)) {
                    break;
                }
                $resident = array_shift($vacantResidents);
                $this->assignRoomToResident($room['roomId'], $resident['residentId']);
                $this->updateRoomStatus($room['roomId'], 'occupied');
                $this->updateResidentStatus($resident['residentId'], 'occupied');
            }
            return $this->successResponse();
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }
    

    private function getVacantRooms() {
        try {
            $conn = $this->db->getConnection();
            $query = "SELECT roomId FROM room WHERE occupancyStatus = 'vacant'";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $vaccantRooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $vaccantRooms;
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function getVacantResidentsOrderedByScore() {
        try {
            $conn = $this->db->getConnection();
            $query = "SELECT id FROM resident WHERE occupancyStatus = 'vacant' ORDER BY score DESC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $VacantResidents = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $VacantResidents;
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function assignRoomToResident($roomId, $residentId) {
        try {
            $conn = $this->db->getConnection();
            $query = "INSERT INTO reservation (roomId, residentId) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->execute([$roomId, $residentId]);
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function updateRoomStatus($roomId, $status) {
        try {
            $conn = $this->db->getConnection();
            $query = "UPDATE room SET occupancyStatus = ? WHERE roomId = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$status, $roomId]);
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    private function updateResidentStatus($residentId, $status) {
        try {
            $conn = $this->db->getConnection();
            $query = "UPDATE resident SET occupancyStatus = ? WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$status, $residentId]);
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function getReservations() {
        try {
            $conn = $this->db->getConnection();
            $query = "SELECT reservation.*,room.roomNumber, apartment.apartmentNumber, building.buildingNumber
            FROM reservation
            JOIN room on room.id = reservation.roomId
            JOIN apartment ON apartment.id = room.apartmentId
            JOIN building ON building.id = apartment.buildingId;
            ";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $data =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $this->successResponse($data);
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function deleteReservation($reservationId) {
        try {
            $conn = $this->db->getConnection();
            $query = "SELECT roomId, residentId FROM reservation WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$reservationId]);
            $reservationData = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$reservationData) {
                return $this->errorResponse("Reservation not found");
            }
            $roomId = $reservationData['roomId'];
            $residentId = $reservationData['residentId'];

            $query = "DELETE FROM reservation WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->execute([$reservationId]);

            $this->updateRoomStatus($roomId, 'vacant');
            $this->updateResidentStatus($residentId, 'vacant');

            return $this->successResponse();
        } catch (PDOException $e) {
            $this->logerror("An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }
}

?>
