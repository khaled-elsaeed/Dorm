<?php
require_once('../classes/Reservation.php');
require_once('../includes/functions.php');


class ReservationHandler {
    private $Reservation;

    public function __construct(Database $db) {
        $this->Reservation = new Reservation($db);
    }



    public function handleAction($action) {
        
        try {
            switch ($action) {
                case 'fetchReservations':
                    return $this->fetchFieldsAndReservation();
                case 'startProcess':
                    return $this->assignRoomsToResidents();  
                case 'removeReservation':
                    return $this->DeleteReservation();  
                default:
                    return array("success" => false, "message" => "Invalid admin action");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();
        }
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

    private function fetchFieldsAndReservation() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $json_data = file_get_contents('php://input');
                $fetchResult = $this->Reservation->getReservations();   
        
                // Check if the fetch was successful
                if ($fetchResult['success']) {
                    return array(
                        "success" => true,
                        "message" => "Reservations fetched successfully",
                        "data" => $fetchResult['data']
                    );
                } else {
                    // If fetch was not successful, return an error message
                    return array(
                        "success" => false,
                        "message" => "Failed to fetch Reservations"
                    );
                }
            } else {
                return array("success" => false, "message" => "Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();        
        }
        
        
    }

    private function assignRoomsToResidents() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $postData = file_get_contents('php://input');
                $postDataArray = json_decode($postData, true);
    
                // Call the method to update maintenance status from the Maintenance class
                $updateResult = $this->Reservation->assignRoomsToResidents();
    
                if ($updateResult['success']) {
                    return array(
                        "success" => true,
                        "message" => "Rooms successfully assigned to residents.",
                    );
                } else {
                    return array(
                        "success" => false,
                        "message" => "Failed to assigned room to resident."
                    );
                }
            } else {
                return array("success" => false, "message" => "Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();        
        }
        
    }

    private function AddReservation() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                $postData = file_get_contents('php://input');
                $postDataArray = json_decode($postData, true);
    
                $fieldId = isset($postDataArray['fieldId']) ? $postDataArray['fieldId'] : null;
                $weight = isset($postDataArray['weight']) ? $postDataArray['weight'] : null;
                $type = isset($postDataArray['type']) ? $postDataArray['type'] : null;
                $reservation = isset($postDataArray['reservation']) ? $postDataArray['reservation'] : null;
                
                $updateResult = $this->Reservation->addReservation($fieldId, $type, $reservation, $weight);
    
                if ($updateResult['success']) {
                    return array(
                        "success" => true,
                        "message" => "Reservations successfully done",
                    );
                } else {
                    return array(
                        "success" => false,
                        "message" => "Failed to make reservations"
                    );
                }
            } else {
                return array("success" => false, "message" => "Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();        
        }
        
    }

    private function DeleteReservation() {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $postData = file_get_contents('php://input');
                $postDataArray = json_decode($postData, true);
                $reservationId = isset($postDataArray['reservationId']) ? $postDataArray['reservationId'] : null;
                
                $updateResult = $this->Reservation->deleteReservation($reservationId);
    
                if ($updateResult['success']) {
                    return array(
                        "success" => true,
                        "message" => "Reservation deleted successfully ",
                    );
                } else {
                    return array(
                        "success" => false,
                        "message" => "Failed to deleted reservation"
                    );
                }
            } else {
                return array("success" => false, "message" => "Invalid request method");
            }
        } catch (Exception $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();        
        }
        
    }


    public function handleCalculateWeights($data) {
        try{
            return($this->Reservation->calculateWeights($data));

        }catch(Exception $e){
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return $this->errorResponse();  
        }
    }

  
}
?>
