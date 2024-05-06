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

function openConfirmationModal(message) {
    return new Promise((resolve) => {
        var modalMessage = document.getElementById('confirmationModalMessage');
        modalMessage.textContent = message;
        var modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
        $('#confirmationModalYes').on('click', function() {
            modal.hide();
            resolve(true);
        });
        $('#confirmationModalNo').on('click', function() {
            modal.hide();
            resolve(false);
        });
    });
}


function openMessageModal(message) {
    document.getElementById("modal-message").innerHTML = message;
    $('#messageModal').modal('show'); 
 }



// Function to close modal form
function closeModal() {
    $('#addRoomModal').modal('hide');
}

// Function to reset modal form
function resetModal() {
    document.getElementById('addRoomModal').querySelector('form').reset();
}




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

async function removeRoom(roomId, apartmentId) {
    try {


        const confirmed = await openConfirmationModal("Are you sure you want to delete this room?");
        if (confirmed) {
            const dbResponse = await removeRoomDB(apartmentId, roomId);
            if (dbResponse.success) {
                fetchRoom();
            } else {
                console.error("Error: Deletion from database unsuccessful");
            }
        }
    } catch (error) {
        console.error("Error in removeRoom:", error);
        throw new Error("Failed to remove room");
    }
}




// Function to remove a room from the database
async function removeRoomDB(apartmentId, roomId) {
    const url = "../../../../../handlers/?action=removeRoom";
    const data = {
        apartmentId: apartmentId,
        roomId: roomId
    };
    try {
        const responseData = await postData(url, data);
        return responseData;
    } catch (error) {
        console.error("Error in removeRoomDB:", error);
        throw new Error("Failed to remove room from the database");
    }
}


async function checkRoomDuplicate(roomData) {
    try {
        const isDuplicate = rooms.some(room => {
            // Convert apartment numbers and building numbers to integers for comparison
            const existingroom = parseInt(room.roomNumber);
            const newroom = parseInt(roomData.roomNumber);
            const existingRoomApartment = parseInt(room.apartmentId);
            const newRoomApartment = parseInt(roomData.roomApartment);

            return existingroom == newroom && existingRoomApartment == newRoomApartment;
        });

        return isDuplicate;
    } catch (error) {
        console.error("Error checking room duplicate:", error);
        throw new Error("Failed to check room duplicate");
    }
}

async function addRoom(roomData) {
    try {
        console.log("hereee");
        const isDuplicate = await checkRoomDuplicate(roomData);

        if (isDuplicate) {
            console.error("Error: Apartment with the same apartment number already exists in the same building");
            const message = "An apartment with the same apartment number already exists in the same building. Please choose a different apartment number.";
            openMessageModal(message);
            return;
        }

        const confirmed = await openConfirmationModal("Are you sure you want to add this room?");
        if (confirmed) {
            // Show loading indicator or disable UI here

            const dbResponse = await addRoomDB(roomData); // Add room in the database

            // Hide loading indicator or enable UI here

            if (dbResponse.success) {
                fetchRoom();
            } else {
                console.error("Error: Adding room unsuccessful", dbResponse.error);
                const message = "Failed to add the room. Please try again later.";
                openMessageModal(message);
            }
        }
    } catch (error) {
        console.error("Error in addRoom:", error);
        const message = "An unexpected error occurred while adding the room. Please try again later.";
        openMessageModal(message);
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
    rooms.forEach(function(room) {
        roomList.innerHTML += `
            <tr>
                <td>R${room.roomNumber}</td>
                <td>A${room.apartmentNumber}</td>
                <td>B${room.buildingNumber}</td>
                <td>${room.occupancyStatus}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeRoom(${room.id},${room.apartmentId})">Delete</button>
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
        option.value = building.id;
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


document.getElementById('search-orders').addEventListener('input', function() {
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
        option.value = apartment.id;
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
document.addEventListener('DOMContentLoaded', function() {
    fetchRoom();
    fetchBuilding();
    fetchApartment();
});

apartmentBuildingSelect.addEventListener('change', function() {
    populateApartmentOptions();
});