<?php
require_once('../includes/db_connect.php');
require_once('../includes/functions.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class Resident {
    private $db;

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

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getOccupiedResidentsCount() {
        try {
            $conn = $this->db->getConnection();

            $sql = "SELECT COUNT(id) AS residentCount FROM resident WHERE occupancyStatus = 'occupied'";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            return $this->successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function getAllResidentNameAndId(){
        try {
            $conn = $this->db->getConnection();

            $sql = "SELECT 
            resident.id,
            member.firstName,
            member.lastName
        FROM 
            resident
        JOIN 
            member ON member.memberId = resident.memberId;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function getAllResidentInfo(){
        try {
            $conn = $this->db->getConnection();

            $sql = "SELECT 
            resident.id,
            member.firstName,
            member.middleName,
            member.lastName,
            room.roomNumber,
            apartment.apartmentNumber,
            building.buildingNumber,
            facultyinfo.faculty,
            facultyinfo.yearOfStudy,
            facultyinfo.studentId
        FROM 
            resident
        JOIN 
            member ON member.memberId = resident.memberId
            JOIN facultyinfo on facultyinfo.memberId = member.memberId
        Join 
            reservation ON reservation.residentId = resident.id
        JOin room ON room.roomId = reservation.roomId
        JOIN apartment ON apartment.apartmentId = room.apartmentId
        JOIN building ON building.buildingId = apartment.buildingId;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

}

?>
