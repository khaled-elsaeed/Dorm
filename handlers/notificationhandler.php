<?php
require_once('../classes/notification.php');

class NotificationHandler {
    private $Notification;

    public function __construct(Database $db) {
        $this->Notification = new Notification($db);
    }

    public function handleAction($action) {
        switch ($action) {
            case 'fetchNotifications':
                return $this->fetchNotifications();
            case 'addNotification':
                return $this->addNotification();
            default:
                return array("success" => false, "message" => "Invalid admin action nottt $action");
        }
    }

    // Fetch Buildings
    private function fetchNotifications() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            return array("success" => false, "message" => "Invalid request method");
        }

        $fetchResult = $this->Notification->getAllNotifications();   

        if ($fetchResult['success']) {
            return array(
                "success" => true,
                "message" => "Buildings fetched successfully",
                "data" => $fetchResult['data']
            );
        } else {
            return array(
                "success" => false,
                "message" => $fetchResult['error']
            );
        }
    }

    // Add Building
    private function addNotification() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return array("success" => false, "message" => "Invalid request method");
        }

        $data = $this->decodeJsonInput();
        
        if ($data === null) {
            return array("success" => false, "message" => "Invalid JSON data");
        }

        $result = $this->Notification->newNotification($data['notificationText'], $data['sender'],$data['recieverID'],$data['allResident']);

        if ($result['success']) {
            return array(
                "success" => true,
                "message" => "Building added successfully"
            );
        } else {
            return array(
                "success" => false,
                "message" => $result['error']
            );
        }
    }

  




    // Function to decode JSON input
    private function decodeJsonInput() {
        // Get JSON data from input stream
        $json_data = file_get_contents('php://input');

        // Decode JSON data
        $decoded_data = json_decode($json_data, true);

        // Return decoded data
        return $decoded_data;
    }
}
?>
