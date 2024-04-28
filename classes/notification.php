<?php

require_once('../includes/db_connect.php');
require_once('../includes/functions.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class Notification {
    
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }



    Public function newNotification($notificationText, $senderId, $receiverId, $allResidents) {
        $conn = $this->db->getConnection();

        try {
            $stmt = $conn->prepare("INSERT INTO notification (notificationText, senderId, receiverId, allResidents) 
                                    VALUES (:notificationText, :senderId, :receiverId, :allResidents)");
            $stmt->bindParam(':notificationText', $notificationText);
            $stmt->bindParam(':senderId', $senderId);
            $stmt->bindParam(':receiverId', $receiverId);
            $stmt->bindParam(':allResidents', $allResidents);
            if ($stmt->execute()) {
                return successResponse();
            } else {
                return errorResponse();
            }
        } catch (PDOException $e) {
            $this->logerror($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
            
            }
    }

    public function getAllNotifications() {
        try {
            $conn = $this->db->getConnection();
            $sql = "SELECT notification.id, notification.notificationText, notification.sentAt, CASE WHEN allResidents != 1 THEN CONCAT(member.firstName, ' ', member.lastName) ELSE 'All Residents' END AS resident FROM notification LEFT JOIN resident ON resident.residentId = notification.receiverId LEFT JOIN member ON member.memberId = resident.memberId";
            $stmt = $conn->prepare($sql);
            if ($stmt->execute()) {
                $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return successResponse($notifications);
            } else {
                return errorResponse();
            }
        } catch (PDOException $e) {
            $this->logError($e . " An error occurred: " . $e->getMessage());
            return errorResponse();
        }
    }
    
    

}

?>
