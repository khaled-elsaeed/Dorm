// Array to store apartments
var apartments = [];
var buildings = [];

// Function to open modal form
function openModal() {
    $('#addApartmentModal').modal('show');
}

$("#addApartmentModal").submit(function(event) {
    event.preventDefault();
    const apartmentData = {
        apartmentNumber: $("#ApartmentNumber").val(),
        apartmentBuilding: $("#apartmentBuilding").val(),
    };
    console.log(apartmentData);
    addApartment(apartmentData);
    closeModal();
});



document.getElementById('search-orders').addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredApartments = apartments.filter(apartment => {
        const apartmentNumberString = apartment.apartmentNumber.toString();
        const apartmentBuildingString = apartment.buildingNumber.toString();

        const matchesSearch = apartmentNumberString.includes(searchQuery) || apartmentBuildingString.includes(searchQuery);
        return matchesSearch;
    });
    populateTable(filteredApartments); 
});



function closeModal() {
    $('#addApartmentModal').modal('hide');
}

function resetModal() {
    document.getElementById('addApartmentModal').querySelector('form').reset();
}

function openMessageModal(message) {
    document.getElementById("modal-message").innerHTML = message;
    $('#messageModal').modal('show'); 
 }

document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);


async function fetchApartment() {
    try {
        const data = await fetchApartmentDB();
        await fetchApartmentDS(data);
    } catch (error) {
        console.error("Error in fetchApartment:", error);
        throw new Error("Failed to fetch apartment data");
    }
}

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

async function fetchApartmentDS(data) {
    try {
        apartments = data.data;
        populateTable(apartments);
    } catch (error) {
        console.error("Error in fetchApartmentDS:", error);
        throw new Error("Failed to populate table");
    }
}


async function removeApartment(apartmentId, buildingId) {
    try {
        // Remove room from the database
        const dbResponse = await removeApartmentDB(apartmentId, buildingId);

        // If the deletion from the database is successful, remove from the front-end data
        if (dbResponse.success) {
            await removeApartmentDS(apartmentId, buildingId);
            populateTable(apartments);
        } else {
            console.error("Error: Deletion from database unsuccessful");
        }
    } catch (error) {
        console.error("Error in removeRoom:", error);
        throw new Error("Failed to remove room");
    }
}


async function removeApartmentDS(apartmentId, buildingId) {
    const index = apartments.findIndex(apartment => {
        return apartment.apartmentId === apartmentId && apartment.buildingId === buildingId;
    });

    if (index !== -1) {
        apartments.splice(index, 1);
    } else {
        console.error("Apartment with ID", apartmentId, "and building ID", buildingId, "not found");
    }
}

async function removeApartmentDB(apartmentId, buildingId) {
    const url = "../../../../../handlers/?action=removeApartment";
    const data = { apartmentId, buildingId };
    try {
        const responseData = await postData(url, data);
        return responseData;
    } catch (error) {
        console.error("Error in removeApartmentDB:", error);
        throw new Error("Failed to remove apartment from the database");
    }
}


const apartmentBuildingSelect = document.getElementById('apartmentBuilding');

function populateBuildingOptions() {
    apartmentBuildingSelect.innerHTML = '<option value="">Select Building</option>';
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.buildingId;
        option.textContent = building.buildingNumber;
        apartmentBuildingSelect.appendChild(option);
    });
}

async function addApartment(apartmentData) {
    try {
        console.log("Adding apartment:", apartmentData);

        // Check if an apartment with the same apartment number already exists in the same building
        const isDuplicate = apartments.some(apartment => {
            // Convert apartment numbers and building numbers to integers for comparison
            const existingApartmentNumber = parseInt(apartment.apartmentNumber);
            const newApartmentNumber = parseInt(apartmentData.apartmentNumber);
            const existingApartmentBuilding = parseInt(apartment.buildingId);
            const newApartmentBuilding = parseInt(apartmentData.apartmentBuilding);
            
            console.log("Existing Apartment Number:", existingApartmentNumber);
            console.log("New Apartment Number:", newApartmentNumber);
            console.log("Existing Apartment Building:", existingApartmentBuilding);
            console.log("New Apartment Building:", newApartmentBuilding);

            return existingApartmentNumber == newApartmentNumber && existingApartmentBuilding == newApartmentBuilding;
        });

        console.log("Is duplicate:", isDuplicate);

        if (isDuplicate) {
            console.error("Error: Apartment with the same apartment number already exists in the same building");
            const message = "An apartment with the same apartment number already exists in the same building.";
            openMessageModal(message);
            return;
        }

        // If not a duplicate, proceed to add the apartment to the database and front-end data
        const dbResponse = await addApartmentDB(apartmentData);
        if (dbResponse.success) {
            await addApartmentDS(apartmentData);
            fetchApartment(); // Refresh the list of apartments after adding
        } else {
            console.error("Error: Adding apartment unsuccessful");
        }
    } catch (error) {
        console.error("Error in addApartment:", error);
        const message = "Failed to add apartment";
        openMessageModal(message);
    }
}






async function addApartmentDB(apartmentData) {
    const url = "../../../../../handlers/?action=addApartment";
    data = {

    }
    try {
        const responseData = await postData(url, apartmentData);
        return responseData;
    } catch (error) {
        console.error("Error in addApartmentDB:", error);
        throw new Error("Failed to add apartment in the database");
    }
}

async function addApartmentDS(apartmentData) {
    try {

        apartments.push(apartmentData);
    } catch (error) {
        console.error("Error in addApartmentDS:", error);
        throw new Error("Failed to add apartment to front-end data structure");
    }
}

function populateTable(apartmentsData) {
    const apartmentList = document.querySelector("tbody");
    apartmentList.innerHTML = ""; 
    apartmentsData.forEach(function (apartment) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>A${apartment.apartmentNumber}</td>
            <td>B${apartment.buildingNumber}</td>
            <td>
                <button class="btn btn-danger" onclick="removeApartment(${apartment.apartmentId}, ${apartment.buildingId})">Delete</button>
            </td>
        `;
        apartmentList.appendChild(row);
    });
}


async function getData(url = "") {
    try {
        const response = await fetch(url, {
            method: "GET", 
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

async function fetchBuilding() {
    try {
        const data = await fetchBuildingDB();
        await fetchBuildingDS(data);
    } catch (error) {
        console.error("Error in fetchBuilding:", error);
        throw new Error("Failed to fetch building data");
    }
}

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

async function fetchBuildingDS(data) {
    try {
        buildings = data.data;
        populateBuildingOptions();
    } catch (error) {
        console.error("Error in fetchBuildingDS:", error);
        throw new Error("Failed to populate table");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchApartment();
    fetchBuilding();
});
