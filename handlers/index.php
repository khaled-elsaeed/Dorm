<?php
require_once('../includes/db_connect.php');
require_once('../includes/functions.php');

// Autoload classes
spl_autoload_register(function ($class) {
    require_once  $class . '.php';
});

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function handleServiceResult($result) {
    echo json_encode($result);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

$db = Database::getInstance();

// Map actions to handler classes
$actionHandlers = [
    'adminAuth' => 'adminhandler',
    'logout' => 'adminhandler',
    'memberAuth' => 'memberhandler',
    'createmember' => 'memberhandler',
    'fetchExpelledStudents' => 'memberhandler',

    'makeAlert' => 'memberhandler',
    'makeWarning' => 'memberhandler',
    'makeExpulsion' => 'memberhandler',
    'addExpelledStudent' => 'memberhandler',
    'fetchDocs' => 'memberhandler',
    'updateDocStatues' => 'memberhandler',





    'fetchMaintenanceRequests' => 'maintenancehandler',
    'startMaintenanceProcess' => 'maintenancehandler',
    'endMaintenanceProcess' => 'maintenancehandler',
    'rejectMaintenanceProcess' => 'maintenancehandler',
    'fetchMaintenanceRequestsCount' => 'maintenancehandler',
    'newRequest' => 'maintenancehandler',

    'fetchCriteria' => 'criteriahandler',
    'updateCriteriaWeight' => 'criteriahandler',
    'newCriteria' => 'criteriahandler',
    'removeCriteria' => 'criteriahandler',
    'fetchBuildings' => 'dormhandler',
    'removeBuilding' => 'dormhandler',
    'addBuilding' => 'dormhandler',
    'fetchRooms' => 'dormhandler',
    'removeRoom' => 'dormhandler',
    'addRoom' => 'dormhandler',
    'fetchApartments' => 'dormhandler',
    'removeApartment' => 'dormhandler',
    'addApartment' => 'dormhandler',
    'fetchRoomOccupancyRate' => 'dormhandler',
    'fetchReservations' => 'reservationhandler',
    'startProcess' => 'reservationhandler',
    'removeReservation' => 'reservationhandler',
    'fetchOccupiedResidentsCount' => 'residenthandler',
    'fetchResidentInfo' => 'residenthandler',
    'fetchResidentDetails' => 'residenthandler',
    'fetchResidents' => 'residenthandler',
    'fetchNotifications' => 'notificationhandler',
    'addNotification' => 'notificationhandler'
];


// Handle actions
if (isset($actionHandlers[$action])) {
    $handlerClass = $actionHandlers[$action];
    $handler = new $handlerClass($db);
    handleServiceResult($handler->handleAction($action));
} else {
    echo json_encode(array("success" => false, "message" => "Invalid action"));
}
?>
