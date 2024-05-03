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
    resetModal();
}

function resetModal() {
    document.getElementById('addApartmentModal').querySelector('form').reset();
}

function openMessageModal(message) {
    document.getElementById("modal-message").innerHTML = message;
    $('#messageModal').modal('show'); 
 }



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
        const confirmed = await openConfirmationModal("Are you sure you want to delete this building?");
        if (confirmed) {
            const dbResponse = await removeApartmentDB(apartmentId, buildingId);
            if (dbResponse.success) {
                await removeApartmentDS(apartmentId, buildingId);
                populateTable(apartments);
            } else {
                console.error("Error: Deletion from database unsuccessful");
            }
        }
    } catch (error) {
        console.error("Error in removeRoom:", error);
        throw new Error("Failed to remove room");
    }
 }




async function removeApartmentDS(apartmentId, buildingId) {
    const index = apartments.findIndex(apartment => {
        return apartment.id === apartmentId && apartment.buildingId === buildingId;
    });

    if (index !== -1) {
        apartments.splice(index, 1);
    } else {
        console.error("Apartment with ID", apartmentId, "and building ID", buildingId, "not found");
    }
}

async function removeApartmentDB(apartmentId, buildingId) {
    console.log(apartmentId);
    const url = "../../../../../handlers/?action=removeApartment";
    const data = {
        apartmentId : apartmentId,
        buildingId :  buildingId
    };
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
        option.value = building.id;
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
            const errorMessage = dbResponse.error || "Error: Adding apartment unsuccessful";
            openMessageModal(errorMessage);
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
                <button class="btn btn-danger" onclick="removeApartment(${apartment.id}, ${apartment.buildingId})">Delete</button>
            </td>
        `;
        apartmentList.appendChild(row);
    });
}




function downloadTableAsCSV() {
    const rows = Array.from(document.querySelectorAll("table tbody tr"));
    const headers = Array.from(document.querySelectorAll("table thead th")).filter(th => th.textContent !== "Actions").map(th => th.textContent);
    const csvContent = [headers.join(",")];
    
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td")).filter(cell => cell.cellIndex !== 2); // Exclude Actions column
        const rowData = cells.map(cell => cell.textContent).join(",");
        csvContent.push(rowData);
    });
 
    const blob = new Blob([csvContent.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "table.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
