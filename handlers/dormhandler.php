<?php
require_once('../classes/Dorm.php');
require_once('../includes/functions.php');


class DormHandler
{
    private $dorm;
    
    public function __construct(Database $db)
    {
        $this->dorm = new Dorm($db);
    }
    
    public function handleAction($action)
    {
        try {
            switch ($action) {
                case 'fetchBuildings':
                    return $this->fetchBuildings();
                case 'removeBuilding':
                    return $this->removeBuilding();
                case 'addBuilding':
                    return $this->addBuilding();
                case 'fetchRooms':
                    return $this->fetchRooms();
                case 'removeRoom':
                    return $this->removeRoom();
                case 'addRoom':
                    return $this->addRoom();
                case 'fetchApartments':
                    return $this->fetchApartments();
                case 'removeApartment':
                    return $this->removeApartment();
                case 'addApartment':
                    return $this->addApartment();
                case 'fetchRoomOccupancyRate':
                    return $this->getRoomOccupancyRate();
                
                default:
                    return errorResponseText('Invalid admin action');
                    
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Fetch Buildings
    private function fetchBuildings()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                return errorResponseText('Invalid request method');
            }
            
            $fetchResult = $this->dorm->fetchBuildings();
            
            if ($fetchResult['success']) {
                return successResponse($fetchResult['data']);
            } else {
                return errorResponseText('Error fetch Building');
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Add Building
    private function addBuilding()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
                
            }
            
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }            
            
            $result = $this->dorm->addBuilding($data['buildingNumber'], $data['buildingCategory']);
            
            if ($result['success']) {
                return successResponse();
                
            } else {
                return errorResponseText('Error add Building');
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Remove Building
    private function removeBuilding()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
                
            }
            
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }            
            
            $buildingId = $data['buildingId'];
            
            $result = $this->dorm->removeBuilding($buildingId);
            
            if ($result['success']) {
                return successResponse();
                
            } else {
                return errorResponseText('Error remove Building');
                
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    
    private function fetchRooms()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                return errorResponseText('Invalid request method');
                
            }
            
            $fetchResult = $this->dorm->fetchRooms();
            
            if ($fetchResult['success']) {
                return successResponse($fetchResult['data']);
                
            } else {
                return errorResponseText('Error fetch rooms');
                
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Add Building
    private function addRoom()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
            }
            
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }
            
            $result = $this->dorm->addRoom($data['roomApartment'], $data['roomNumber']);
            
            if ($result['success']) {
                return successResponse();
            } else {
                return errorResponseText('Error add room');
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }
    
    // Remove Building
    private function removeRoom()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
                
            }
            
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }            
            
            $roomId = $data['roomId'];
            $apartmentId = $data['apartmentId'];
            
            $result = $this->dorm->deleteRoom($roomId,$apartmentId);
            
            if ($result['success']) {
                return successResponse();
                
            } else {
                return errorResponseText('Error remove room');
                
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    
    private function fetchApartments()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                return errorResponseText('Invalid request method');
                
            }
            
            $fetchResult = $this->dorm->fetchApartments();
            
            if ($fetchResult['success']) {
                return successResponse($fetchResult['data']);
                
            } else {
                return errorResponseText('Error fetch apartment');
                
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Add Building
    private function addApartment()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
                
            }
            
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }            
            
            $result = $this->dorm->addApartment($data['apartmentBuilding'], $data['apartmentNumber']);
            
            if ($result['success']) {
                return successResponse();
            } else {
                $errorMessage = isset($result['error']) ? $result['error'] : 'Error add apartment';
                return errorResponseText($errorMessage);
            }
            
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Remove Building
    private function removeApartment()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                return errorResponseText('Invalid request method');
            }
        
            $data = $this->decodeJsonInput();
            
            if (!$data) {
                return errorResponseText('Invalid JSON data');
            }            
            
            $apartmentId = $data['apartmentId'];
            $buildingId  = $data['buildingId'];
            
            $result = $this->dorm->deleteApartment($apartmentId, $buildingId);
            
            if ($result['success']) {
                return successResponse();
            } else {
                return errorResponseText('Error remove apartment');
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
        }
    }
    
    // Fetch Buildings
    private function getRoomOccupancyRate()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                return errorResponseText('Invalid request method');
            }
            $fetchResult = $this->dorm->getRoomOccupancyRate();
            if ($fetchResult['success']) {
                return successResponse($fetchResult['data']);
            } else {
                return errorResponseText('Error get Room Occupancy Rate');
            }
        }
        catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }
    
    
    // Function to decode JSON input
    private function decodeJsonInput()
    {
        $json_data    = file_get_contents('php://input');
        $decoded_data = json_decode($json_data, true);
        $securedData  = secureData($decoded_data);
        return $securedData;
    }
}
?>