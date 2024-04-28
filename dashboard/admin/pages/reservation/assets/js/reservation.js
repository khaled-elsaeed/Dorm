var Reservations = [];

// Function to fetch Reservations from the server
async function fetchReservation() {
    try {
        const data = await fetchReservationDB();
        await fetchReservationDS(data);
    } catch (error) {
        console.error("Error in fetchReservation:", error);
        throw new Error("Failed to fetch Reservation data");
    }
}

function closeModal(modalId) {
    $('#' + modalId).modal('hide');
}


document.getElementById('closeModalHeaderBtn').addEventListener('click', function() {
    closeModal('messageModal');
});

document.getElementById('closeModalFooterBtn').addEventListener('click', function() {
    closeModal('messageModal');
});

function openMessageModal(message) {
    document.getElementById("modal-message").innerHTML = message;
    $('#messageModal').modal('show'); 
}

// Function to fetch Reservations from the database
async function fetchReservationDB() {
    const url = "../../../../handlers/index.php?action=fetchReservations";
    try {
        const response = await getData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchReservationDB:", error);
        throw new Error("Failed to fetch Reservation data from database");
    }
}

// Function to populate table with Reservation data
async function fetchReservationDS(data) {
    try {
        Reservations = data;
        await populateTable(Reservations);
    } catch (error) {
        console.error("Error in fetchReservationDS:", error);
        throw new Error("Failed to populate table");
    }
}





async function removeReservation(ReservationId) {
    try {
        const dbResponse = await removeReservationDB(ReservationId);
        if (dbResponse.success) {
            await removeReservationDS(ReservationId);
            await populateTable(Reservations); 
            const message = 'The reservation is deleted';
            openMessageModal(message);
        } else {
            console.error("Error: Deletion from database unsuccessful");
        }
    } catch (error) {
        console.error("Error in removeReservation:", error);
        throw new Error("Failed to remove Reservation");
    }
}

async function removeReservationDS(ReservationId) {
    ReservationId = parseInt(ReservationId);
    const index = Reservations.findIndex(Reservation => parseInt(Reservation.reservationId) === ReservationId);
    if (index !== -1) {
        Reservations.splice(index, 1);
        console.log("Reservation removed successfully.");
    } else {
        console.error("Reservation with ID", ReservationId, "not found");
    }
}


async function removeReservationDB(ReservationId) {
    const url = "../../../../handlers/index.php?action=removeReservation";
    const data = { reservationId :ReservationId };
    try {
        const responseData = await postData(url, data);
        return responseData;
    } catch (error) {
        console.error("Error in removeReservationDB:", error);
        throw new Error("Failed to remove Reservation from the database");
    }
}

async function addReservation(ReservationData) {
    try {
        const dbResponse = await addReservationDB(ReservationData);
        if (dbResponse.success) {
            await addReservationDS(ReservationData);
            fetchReservation();
        } else {
            console.error("Error: Adding Reservation unsuccessful");
        }
    } catch (error) {
        console.error("Error in addReservation:", error);
        throw new Error("Failed to add Reservation");
    }
}

// Function to add a Reservation in the database
async function addReservationDB(ReservationData) {
    const url = "../../../../../handlers/index.php?action=addReservation";
    data = {

    }
    try {
        const responseData = await postData(url, ReservationData);
        return responseData;
    } catch (error) {
        console.error("Error in addReservationDB:", error);
        throw new Error("Failed to add Reservation in the database");
    }
}

// Function to add a Reservation to the front-end data structure
async function addReservationDS(ReservationData) {
    try {
        // Add Reservation data to the front-end data structure (Reservations array)
        Reservations.push(ReservationData);
    } catch (error) {
        console.error("Error in addReservationDS:", error);
        throw new Error("Failed to add Reservation to front-end data structure");
    }
}

async function populateTable(Reservations) {
    var ReservationList = document.querySelector("tbody");
    ReservationList.innerHTML = ""; // Clear existing content
    Reservations.forEach(function (Reservation, index) { // Added index as the second parameter
        ReservationList.innerHTML += `
            <tr>
                <td>${index + 1}</td> <!-- Used index to display the reservation number -->
                <td>${Reservation.residentId}</td>
                <td>
                <span class="building">B(${Reservation.buildingNumber})</span>
                <span class="apartment">A(${Reservation.apartmentNumber})</span>
                <span class="room">R(${Reservation.roomNumber})</span>
            </td>
                            <td>${Reservation.reservationDate}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeReservation(${Reservation.reservationId})">Delete</button>
                </td>
            </tr>
        `;
    });
}






async function automaticReservation() {
    try {
        document.getElementById("loadingSpinner").style.display = "inline-block";
        var startProcessBtn = document.getElementById("startProcessBtn");
        startProcessBtn.disabled = true;
        startProcessBtn.style.opacity = "0.5";
        const dbResponse = await automaticReservationDb(); 
        if (dbResponse.success) {
            await fetchReservation(); 
            const message = 'The reservation is done';
            openMessageModal(message);
            startProcessBtn.disabled = false;
            startProcessBtn.style.opacity = "1";
        } else {
            console.error("Error: Adding Reservation unsuccessful");
        }
    } catch (error) {
        console.error("Error in addReservation:", error);
        throw new Error("Failed to add Reservation");
    } finally {
        // Hide loading spinner regardless of success or failure
        document.getElementById("loadingSpinner").style.display = "none";
    }
}


async function automaticReservationDb() {
    try {
        const url = "../../../../handlers/index.php?action=startProcess";
        const response = await postData(url,{});
        return response;
    } catch (error) {
        console.error("Error in addReservation:", error);
        throw new Error("Failed to add Reservation");
    }
}

const automaticReservationBtn = document.getElementById('startProcessBtn');
automaticReservationBtn.addEventListener('click', function() {
    automaticReservation();
});





document.getElementById('search-orders').addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredReservations = Reservations.filter(Reservation => {
        const ReservationNumberString = Reservation.ReservationNumber.toString();
        const ReservationBuildingString = Reservation.ApartmentNumber.toString();
        const matchesSearch = ReservationNumberString.includes(searchQuery) || ReservationBuildingString.includes(searchQuery);
        return matchesSearch;
    });
    populateTable(filteredReservations); // Update table with filtered Reservations
});


const ReservationApartmentSelect = document.getElementById('ReservationApartment');




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

document.addEventListener('DOMContentLoaded', function () {
    fetchReservation();
});



