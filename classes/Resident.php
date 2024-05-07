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
            member ON member.id = resident.memberId;";
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
            facultyinfo.level,
            facultyinfo.studentId
        FROM 
            resident
        JOIN 
            member ON member.id = resident.memberId
            JOIN facultyinfo on facultyinfo.memberId = member.id
        Join 
            reservation ON reservation.residentId = resident.id
        JOin room ON room.id = reservation.roomId
        JOIN apartment ON apartment.id = room.apartmentId
        JOIN building ON building.id = apartment.buildingId;";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return successResponse($data);

        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
    }

    public function getResidentDetails($residentId) {
        try {
            $conn = $this->db->getConnection();
    
            $sql = "SELECT 
                        r.id AS residentId,
                        r.score AS residentScore,
                        r.moveInDate,
                        r.moveOutDate,
                        m.id AS memberId,
                        m.firstName,
                        m.middleName,
                        m.lastName,
                        m.birthdate,
                        m.gender,
                        m.nationality,
                        m.governmentId,
                        ci.email AS email,
                        ci.phoneNumber AS phoneNumber,
                        pi.name AS parentName,
                        pi.phoneNumber AS parentPhoneNumber,
                        pi.location As parentLocation,
                        fi.faculty,
                        fi.department,
                        fi.studentId AS facultyStudentId,
                        fi.level AS facultyLevel,
                        fi.email AS facultyEmail,
                        fi.cgpa,
                        fi.certificateType,
                        fi.certificateScore,
                        i.insuranceId,
                        i.amount AS insuranceAmount,
                        i.memberId AS insuranceMemberId,
                        li.email AS loginEmail,
                        li.passwordHash AS loginPasswordHash,
                        p.amount AS paymentAmount,
                        p.status AS paymentStatus,
                        res.id AS reservationId,
                        res.reservationDate,
                        res.roomId,
                        room.roomNumber,
                        room.apartmentId,
                        apartment.apartmentNumber,
                        building.buildingNumber
                    FROM 
                        resident AS r
                    LEFT JOIN 
                        member AS m ON r.memberId = m.id
                    LEFT JOIN 
                        contactinfo AS ci ON m.id = ci.memberId
                    LEFT JOIN 
                        parentalinfo AS pi ON m.id = pi.memberId
                    LEFT JOIN 
                        facultyinfo AS fi ON m.id = fi.memberId
                    LEFT JOIN 
                        insurance AS i ON m.id = i.memberId
                    LEFT JOIN 
                        logininfo AS li ON m.id = li.memberId
                    LEFT JOIN 
                        payment AS p ON m.id = p.memberId
                    LEFT JOIN 
                        reservation AS res ON r.id = res.residentId
                    LEFT JOIN 
                        room ON res.roomId = room.id
                    LEFT JOIN 
                        apartment ON room.apartmentId = apartment.id
                    LEFT JOIN 
                        building ON apartment.buildingId = building.id
                    WHERE 
                        r.id = :residentId";
    
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':residentId', $residentId, PDO::PARAM_INT);
            $stmt->execute();
            $resident = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$resident) {
                // Handle case where no resident found
                return errorResponse("Resident not found");
            }
    
            if (isset($resident['roomId']) && $resident['roomId'] !== null) {
                // Fetch maintenance requests for the resident
                $maintenanceSql = "SELECT description, requestDate FROM maintenance WHERE roomId = :roomId";
                $maintenanceStmt = $conn->prepare($maintenanceSql);
                $maintenanceStmt->bindParam(':roomId', $resident['roomId'], PDO::PARAM_INT);
                $maintenanceStmt->execute();
                $maintenanceRequests = $maintenanceStmt->fetchAll(PDO::FETCH_ASSOC);
    
                // Add maintenance requests to the resident array
                $resident['maintenanceRequests'] = $maintenanceRequests;
            } else {
                // Handle case where no room associated with the resident
                $resident['maintenanceRequests'] = [];
            }
    
            return successResponse($resident);
    
        } catch (PDOException $e) {
            $this->logError($e . " An error occurred: " . $e->getMessage());
            return errorResponse("An error occurred while fetching resident details");
        }
    }
    
    
    
    
    
    
    

}

?>
