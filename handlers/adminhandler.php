<?php
require_once "../classes/Admin.php";
require_once "../includes/functions.php";



class AdminHandler
{
    private $admin;

    public function __construct(Database $db)
    {
        $this->admin = new Admin($db);
    }

    public function handleAction($action)
    {
        switch ($action) {
            case "adminAuth":
                return $this->adminAuth();
            case "logout":
                return $this->logout();
            default:
                return errorResponse();
        }
    }

    private function adminAuth()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $json_data = file_get_contents("php://input");
            $data = json_decode($json_data, true);
            $securedData = secureData($data);
            $email = isset($securedData["signin-email"]) ? $securedData["signin-email"] : "";
            $password = isset($securedData["signin-password"]) ? $securedData["signin-password"] : "";
            if (empty($email) || empty($password)) {
                return errorResponseText('Email and password are required');
            }
            $fetchResult = $this->admin->adminAuthenticate($email, $password);
            if ($fetchResult["success"]) {
                $_SESSION["userId"] = $fetchResult["data"]["adminId"];
                $_SESSION["username"] = $fetchResult["data"]["username"];
                return successResponse();
            } else {
                return errorResponseText($fetchResult['error']); 
            }
        } else {
            return errorResponse();
        }
    }

    private function logout()
    {
        return $this->admin->logout();
    }
}
?>
