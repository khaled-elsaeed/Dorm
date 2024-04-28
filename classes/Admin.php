<?php
require_once('../includes/db_connect.php');
require_once('../includes/functions.php');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

class Admin {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function adminAuthenticate($email, $password) {
        $conn = $this->db->getConnection();
        try {
            $sql = "SELECT adminId, passwordHash, username, role FROM admincredentials WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($data) {
                if (password_verify($password, $data['passwordHash'])) {
                    $responseData = [
                        'adminId' => $data['adminId'],
                        'username' => $data['username']
                    ];
                    return successResponse($responseData);
                } else {
                    log_error("Authentication failed for email: $email - Incorrect password", $conn);
                    return errorResponseText("Incorrect password");
                }
            } else {
                log_error("Authentication failed - Email not found: $email", $conn);
                return errorResponseText("Email not found");
            }
        } catch (PDOException $e) {
            log_error("Database error: " . $e->getMessage(), $conn);
            return errorResponse();
        }
    }
    

    public function logout() {
        session_unset();
        session_destroy();
        header("Location: ../Public_html/login.php");
        exit();
    }
}
?>
