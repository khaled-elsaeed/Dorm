// Array to store rooms
var rooms = [];
var apartments = [];
var buildings = [];

// Function to open modal form
function openModal() {
    $('#addRoomModal').modal('show');
}

$("#addRoomModal").submit(function(event) {
    event.preventDefault();
    const roomData = {
        roomNumber: $("#RoomNumber").val(),
        apartmentBuilding: $("#apartmentBuilding").val(),
        roomApartment: $("#roomApartment").val(),

    };
    console.log(roomData);
    addRoom(roomData);
    closeModal();
});




// Function to close modal form
function closeModal() {
    $('#addRoomModal').modal('hide');
}

// Function to reset modal form
function resetModal() {
    document.getElementById('addRoomModal').querySelector('form').reset();
}

// Example usage:
// Assuming you have a button to open the modal with ID "openModalBtn" and a button to close the modal with ID "closeModalBtn"
document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);


// Function to fetch rooms from the server
async function fetchRoom() {
    try {
        const data = await fetchRoomDB();
        await fetchRoomDS(data);
    } catch (error) {
        console.error("Error in fetchRoom:", error);
        throw new Error("Failed to fetch room data");
    }
}

// Function to fetch rooms from the database
async function fetchRoomDB() {
    const url = "../../../../../handlers/?action=fetchRooms";
    try {
        const data = await getData(url);
        return data;
    } catch (error) {
        console.error("Error in fetchRoomDB:", error);
        throw new Error("Failed to fetch room data from database");
    }
}

// Function to populate table with room data
async function fetchRoomDS(data) {
    try {
        rooms = data.data;
        await populateTable(rooms);
    } catch (error) {
        console.error("Error in fetchRoomDS:", error);
        throw new Error("Failed to populate table");
    }
}

// Function to remove a room from the server and update the UI
async function removeRoom(roomId) {
    try {
        // Remove room from the database
        const dbResponse = await removeRoomDB(roomId);

        // If the deletion from the database is successful, remove from the front-end data
        if (dbResponse.success) {
            await removeRoomDS(roomId);
            populateTable(rooms);
        } else {
            console.error("Error: Deletion from database unsuccessful");
        }
    } catch (error) {
        console.error("Error in removeRoom:", error);
        throw new Error("Failed to remove room");
    }
}

// Function to remove a room from the front-end data
async function removeRoomDS(roomId) {
    const index = rooms.findIndex(room => room.roomId === roomId);
    if (index !== -1) {
        rooms.splice(index, 1);
    } else {
        console.error("Room with ID", roomId, "not found");
    }
}

// Function to remove a room from the database
async function removeRoomDB(roomId) {
    const url = "../../../../../handlers/?action=removeRoom";
    const data = { roomId };
    try {
        const responseData = await postData(url, data);
        return responseData;
    } catch (error) {
        console.error("Error in removeRoomDB:", error);
        throw new Error("Failed to remove room from the database");
    }
}

// Function to add a room
async function addRoom(roomData) {
    try {
        const dbResponse = await addRoomDB(roomData); // Add room in the database
        if (dbResponse.success) {
            await addRoomDS(roomData); // Add room to front-end data structure
            fetchRoom();
        } else {
            console.error("Error: Adding room unsuccessful");
        }
    } catch (error) {
        console.error("Error in addRoom:", error);
        throw new Error("Failed to add room");
    }
}

// Function to add a room in the database
async function addRoomDB(roomData) {
    const url = "../../../../../handlers/?action=addRoom";
    data = {

    }
    try {
        const responseData = await postData(url, roomData);
        return responseData;
    } catch (error) {
        console.error("Error in addRoomDB:", error);
        throw new Error("Failed to add room in the database");
    }
}

// Function to add a room to the front-end data structure
async function addRoomDS(roomData) {
    try {
        // Add room data to the front-end data structure (rooms array)
        rooms.push(roomData);
    } catch (error) {
        console.error("Error in addRoomDS:", error);
        throw new Error("Failed to add room to front-end data structure");
    }
}

// Function to populate the table with room data
async function populateTable(rooms) {
    var roomList = document.querySelector("tbody");
    roomList.innerHTML = ""; // Clear existing content
    rooms.forEach(function (room) {
        roomList.innerHTML += `
            <tr>
                <td>R${room.roomNumber}</td>
                <td>A${room.apartmentNumber}</td>
                <td>B${room.buildingNumber}</td>
                <td>${room.occupancyStatus}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeRoom(${room.roomId})">Delete</button>
                </td>
            </tr>
        `;
    });
}


// Function to fetch apartments from the server
async function fetchApartment() {
    try {
        const data = await fetchApartmentDB();
        await fetchApartmentDS(data);
    } catch (error) {
        console.error("Error in fetchApartment:", error);
        throw new Error("Failed to fetch apartment data");
    }
}

// Function to fetch apartments from the database
async function fetchApartmentDB() {
    const url = "../../../../../handlers/?action=fetchApartments";
    try {
        const data = await getData(url);
        return data;
    } catch (error) {
        console.error("Error in fetchApartmentDB:", error);
        throw new Error("Failed to fetch apartment data from database");
    }
}

// Function to populate table with apartment data
async function fetchApartmentDS(data) {
    try {
        apartments = data.data;
    } catch (error) {
        console.error("Error in fetchApartmentDS:", error);
        throw new Error("Failed to populate table");
    }
}


const apartmentBuildingSelect = document.getElementById('apartmentBuilding');

// Function to populate the select element with options
function populateBuildingOptions() {
    // Clear existing options
    apartmentBuildingSelect.innerHTML = '<option value="">Select Building</option>';

    // Add options for each building
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.buildingId;
        option.textContent = building.buildingNumber;
        apartmentBuildingSelect.appendChild(option);
    });
}

// Function to fetch buildings from the server
async function fetchBuilding() {
    try {
        const data = await fetchBuildingDB();
        await fetchBuildingDS(data);
    } catch (error) {
        console.error("Error in fetchBuilding:", error);
        throw new Error("Failed to fetch building data");
    }
}

// Function to fetch buildings from the database
async function fetchBuildingDB() {
    const url = "../../../../../handlers/?action=fetchBuildings";
    try {
        const data = await getData(url);
        return data;
    } catch (error) {
        console.error("Error in fetchBuildingDB:", error);
        throw new Error("Failed to fetch building data from database");
    }
}

// Function to populate table with building data
async function fetchBuildingDS(data) {
    try {
        buildings = data.data;
        populateBuildingOptions();
    } catch (error) {
        console.error("Error in fetchBuildingDS:", error);
        throw new Error("Failed to populate table");
    }
}


document.getElementById('search-orders').addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredRooms = rooms.filter(room => {
        // Convert rooms number to string for comparison
        const roomNumberString = room.roomNumber.toString();
        const roomBuildingString = room.ApartmentNumber.toString();

        // Filter rooms based on apartment number
        const matchesSearch = roomNumberString.includes(searchQuery) || roomBuildingString.includes(searchQuery);
        return matchesSearch;
    });
    populateTable(filteredRooms); // Update table with filtered rooms
});


const roomApartmentSelect = document.getElementById('roomApartment');



function populateApartmentOptions() {
    // Clear existing options
    roomApartmentSelect.innerHTML = '<option value="">Select Apartment</option>';

    // Add options for each apartment belonging to the selected building
    const selectedBuildingId = apartmentBuildingSelect.value;
    console.log(selectedBuildingId);
    const filteredApartments = apartments.filter(apartment => parseInt(apartment.buildingId) === parseInt(selectedBuildingId));
    console.log(filteredApartments);
    filteredApartments.forEach(apartment => {
        const option = document.createElement('option');
        option.value = apartment.apartmentId;
        option.textContent = apartment.apartmentNumber;
        roomApartmentSelect.appendChild(option);
    });
}

// Function to fetch data from the server
async function getData(url = "") {
    try {
        const response = await fetch(url, {
            method: "GET", // Use GET method for fetching data
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.json();
    } catch (error) {
        console.error("Error in getData:", error);
        throw new Error("Failed to fetch data");
    }
}

// Function to send data to the server
async function postData(url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (error) {
        console.error("Error in postData:", error);
        throw new Error("Failed to fetch data");
    }
}

// Call fetchRoom when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchRoom();
    fetchBuilding();
    fetchApartment();
});

apartmentBuildingSelect.addEventListener('change', function() {
    populateApartmentOptions();
});

