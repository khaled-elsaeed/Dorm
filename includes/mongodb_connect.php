<?php
require_once '../config/mongodb.php';

function connectToMongoDB() {
    try {
        return new MongoDB\Driver\Manager(mongoDbUri);
    } catch (MongoDB\Driver\Exception\Exception $e) {
        die("Error connecting to MongoDB: " . $e->getMessage());
    }
}


function insertDocument($document) {
    try {
        $manager = connectToMongoDB();
        $database = mongoDbDatabase;
        $collection = mongoDbCollection;
        $bulk = new MongoDB\Driver\BulkWrite;
        $bulk->insert($document);
        $result = $manager->executeBulkWrite("$database.$collection", $bulk);
        return $result;
    } catch (MongoDB\Driver\Exception\Exception $e) {
        die("Error inserting document: " . $e->getMessage());
    }
}


function getAllDocuments() {
    try {
        $manager = connectToMongoDB();
        $database = mongoDbDatabase;
        $collection = mongoDbCollection;

        $query = new MongoDB\Driver\Query([]);
        $cursor = $manager->executeQuery("$database.$collection", $query);

        $documents = [];
        foreach ($cursor as $document) {
            // Convert each document object to an associative array
            $documentArray = json_decode(json_encode($document), true);
            $documents[] = $documentArray;
        }

        return $documents;
    } catch (MongoDB\Driver\Exception\Exception $e) {
        die("Error retrieving documents: " . $e->getMessage());
    }
}



?>
