<?php

require_once('../includes/functions.php');

class Dorm
{
    private $db;
    public function __construct(Database $db)
    {
        $this->db = $db;
    }

    // Building Methods
    public function fetchBuildings()
    {
        try {
            $conn   = $this->db->getConnection();
            $sql    = "SELECT * FROM building";
            $result = $conn->query($sql);
            $data   = $result->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($data);
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function addBuilding($buildingNumber, $buildingCategory	)
    {
        try {
            $conn = $this->db->getConnection();
            $sql  = "INSERT INTO building (buildingNumber, buildingCategory	) VALUES (?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(1, $buildingNumber, PDO::PARAM_STR);
            $stmt->bindParam(2, $buildingCategory, PDO::PARAM_STR);
            $stmt->execute();
            return successResponse();
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function removeBuilding($buildingId)
    {
        try {
            $conn = $this->db->getConnection();
            $sql  = "DELETE FROM building WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(1, $buildingId, PDO::PARAM_INT);
            $stmt->execute();
            return successResponse();
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    // Room Methods
    public function fetchRooms()
    {
        try {
            $conn   = $this->db->getConnection();
            $sql    = "SELECT room.*, apartment.apartmentNumber, building.buildingNumber
            FROM room
            JOIN apartment ON apartment.id = room.apartmentId
            JOIN building ON building.id = apartment.buildingId";
            $result = $conn->query($sql);
            $data   = $result->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($data);
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function addRoom($apartmentId, $roomNumber)
{
    try {
        $conn = $this->db->getConnection();
        
        // Check if adding a new room will exceed the limit
        $apartmentRoomCount  = $this->getApartmentRoomCount($apartmentId);
        $currentRoomCount    = $this->getCurrentRoomCount($apartmentId);
        
        if ($currentRoomCount >= $apartmentRoomCount) {
            return array(
                "success" => false,
                "error" => "Exceeds the limit of rooms per apartment"
            );
        }

        $sql  = "INSERT INTO room (apartmentId, roomNumber) VALUES (:apartmentId, :roomNumber)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':apartmentId', $apartmentId, PDO::PARAM_INT);
        $stmt->bindParam(':roomNumber', $roomNumber, PDO::PARAM_INT);
        $stmt->execute();
        
        return successResponse();
    }
    catch (PDOException $e) {
        logerror($e . " An error occurred: " . $e->getMessage());
        return errorResponse();
    }
}

private function getApartmentRoomCount($apartmentId)
{
    $conn = $this->db->getConnection();
    $sql  = "SELECT roomCount FROM apartment WHERE id = :apartmentId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':apartmentId', $apartmentId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchColumn();
}

private function getCurrentRoomCount($apartmentId)
{
    $conn = $this->db->getConnection();
    $sql  = "SELECT COUNT(*) FROM room WHERE apartmentId = :apartmentId";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':apartmentId', $apartmentId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchColumn();
}


    public function deleteRoom($roomId,$ApartmentId)
    {
        try {
            $conn = $this->db->getConnection();
            $sql  = "DELETE FROM room WHERE id = :roomId AND apartmentId = :apartmentId ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':roomId', $roomId, PDO::PARAM_INT);
            $stmt->bindParam(':apartmentId', $ApartmentId, PDO::PARAM_INT);

            $stmt->execute();
            return successResponse();
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    // Apartment Methods
    public function fetchApartments()
    {
        try {
            $conn   = $this->db->getConnection();
            $sql    = "SELECT apartment.*, building.buildingNumber 
                    FROM apartment 
                    JOIN building ON apartment.buildingId = building.id";
            $result = $conn->query($sql);
            $data   = $result->fetchAll(PDO::FETCH_ASSOC);
            return successResponse($data);
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function addApartment($buildingId, $apartmentNumber)
    {
        try {
            $conn                   = $this->db->getConnection();
            // Check if adding a new apartment will exceed the limit
            $buildingApartmentCount = $this->getBuildingApartmentCount($buildingId);
            $currentApartmentCount  = $this->getCurrentApartmentCount($buildingId);
            if ($currentApartmentCount >= $buildingApartmentCount) {
                return array(
                    "success" => false,
                    "error" => "Exceeds the limit of apartments per building"
                );
            }
            $sql  = "INSERT INTO apartment (buildingId, apartmentNumber) VALUES (:buildingId, :apartmentNumber)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':buildingId', $buildingId, PDO::PARAM_INT);
            $stmt->bindParam(':apartmentNumber', $apartmentNumber, PDO::PARAM_INT);
            $stmt->execute();
            return successResponse();
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    public function deleteApartment($apartmentId, $buildingId)
    {
        try {
            $conn = $this->db->getConnection();
            $sql  = "DELETE FROM apartment WHERE id = :apartmentId AND buildingId = :buildingId";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':apartmentId', $apartmentId, PDO::PARAM_INT);
            $stmt->bindParam(':buildingId', $buildingId, PDO::PARAM_INT);
            $stmt->execute();
            return successResponse();
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    // Other Methods
    public function getRoomOccupancyRate()
    {
        try {
            $conn          = $this->db->getConnection();
            $occupiedCount = $this->getOccupiedRoomCount($conn);
            $totalCount    = $this->getTotalRoomCount($conn);
            $occupancyRate = ($totalCount > 0) ? ($occupiedCount / $totalCount) * 100 : 0;
            $data          = $occupancyRate;
            return successResponse($data);
        }
        catch (PDOException $e) {
            logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }

    private function getBuildingApartmentCount($buildingId)
    {
        $conn = $this->db->getConnection();
        $sql  = "SELECT apartmentLimit FROM building WHERE id = :buildingId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':buildingId', $buildingId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    private function getCurrentApartmentCount($buildingId)
    {
        $conn = $this->db->getConnection();
        $sql  = "SELECT COUNT(*) FROM apartment WHERE buildingId = :buildingId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':buildingId', $buildingId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    private function getOccupiedRoomCount($conn)
    {
        $sql = "SELECT COUNT(id) AS occupiedCount FROM room WHERE occupancyStatus = 'occupied'";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $occupiedCount = $stmt->fetchColumn(); // Directly fetch the count value
        return $occupiedCount;
    }

    private function getTotalRoomCount($conn)
    {
        $sql = "SELECT COUNT(id) FROM room";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $totalCount = $stmt->fetchColumn(); // Directly fetch the count value
        return $totalCount;
    }

}
?>