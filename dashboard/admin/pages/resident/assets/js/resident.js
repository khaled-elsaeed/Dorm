// global variables
var residents = [];

// Function to populate the table with resident data
async function populateCards(residents) {
    const container = document.getElementById('resident-container');
    residents.forEach(resident => {
        const card = document.createElement('div');
        card.classList.add('card');
        const residentName = resident.firstName + " " + resident.middleName + " " + resident.lastName;
        const residenLocation = "B" + resident.buildingNumber + ", " + "A" + resident.apartmentNumber + ", " + "R" + resident.roomNumber;
        card.innerHTML = `
            <div class="card-content">
                <h6>${residentName}</h6>
                <div class="details">
                    <div><i class="fas fa-map-marker-alt"></i> Location: <span>${residenLocation}</span></div>
                    <div><i class="fas fa-user-graduate"></i> Faculty: <span>${resident.faculty}</span></div>
                    <div><i class="fas fa-graduation-cap"></i> Level: <span>${resident.level}</span></div>
                    <div><i class="fas fa-id-badge"></i> Student ID: <span>${resident.studentId}</span></div>
                    <button class="info-button" onclick="showMoreInfo('${resident.id}')">More Info</button>
                    </div>
            </div>
        `;
        container.appendChild(card);
    });
    animateCards();
}


// Function to show more information about a resident
async function showMoreInfo(residentId) {
    try {
        const residentDetails = await getResidentDetails(residentId);
        await setResidentDetails(residentDetails.data);
        $('#residentDetailsModal').modal('show');
    } catch (error) {
        console.error("Error showing more info:", error);
        throw new Error("Failed to show more info");
    }
}


async function setResidentDetails(resident) {
    try {
        console.log(resident);
        
        // Populate member information
        document.getElementById('memberId').textContent = resident.memberId;
        document.getElementById('score').textContent = resident.score;
        document.getElementById('fullName').textContent = `${resident.firstName} ${resident.middleName} ${resident.lastName}`;
        document.getElementById('birthdate').textContent = resident.birthdate;
        document.getElementById('gender').textContent = resident.gender;
        document.getElementById('nationality').textContent = resident.nationality;
        document.getElementById('governmentId').textContent = resident.governmentId;

        // Populate contact information
        document.getElementById('email').textContent = resident.email;
        document.getElementById('phoneNumber').textContent = resident.phoneNumber;

        // Populate parental information
        document.getElementById('parentName').textContent = resident.parentName;
        document.getElementById('parentPhoneNumber').textContent = resident.parentPhoneNumber;
        document.getElementById('parentLocation').textContent = resident.parentLocation;

        // Populate faculty information
        document.getElementById('faculty').textContent = resident.faculty;
        document.getElementById('department').textContent = resident.department;
        document.getElementById('level').textContent = resident.level;
        document.getElementById('facultyEmail').textContent = resident.facultyEmail;
        document.getElementById('cgpa').textContent = resident.cgpa;
        document.getElementById('certificateType').textContent = resident.certificateType;
        document.getElementById('certificateScore').textContent = resident.certificateScore;

        // Populate insurance information
        document.getElementById('insuranceAmount').textContent = resident.insuranceAmount;

        // Populate login information
        document.getElementById('loginEmail').textContent = resident.loginEmail;
        document.getElementById('passwordHash').textContent = resident.passwordHash;

        // Populate payment information
        document.getElementById('paymentAmount').textContent = resident.paymentAmount;
        document.getElementById('paymentStatus').textContent = resident.paymentStatus;

        // Populate room information
        document.getElementById('roomNumber').textContent = resident.roomNumber;
        document.getElementById('apartmentNumber').textContent = resident.apartmentNumber;
        document.getElementById('buildingNumber').textContent = resident.buildingNumber;

        // Populate maintenance requests if available
        const maintenanceList = document.getElementById('maintenanceList');
        maintenanceList.innerHTML = ""; // Clear existing list
        if (resident.data && resident.data.length > 0) {
            resident.data.forEach(request => {
                const listItem = document.createElement('li');
                listItem.textContent = `${request.description} - ${request.requestDate}`;
                maintenanceList.appendChild(listItem);
            });
        } else {
            maintenanceList.textContent = "No maintenance requests";
        }
        
    } catch (error) {
        console.error("Error in setResidentDetails:", error);
        throw new Error("Failed to set resident details in the modal");
    }
}








// search
function handleSearchInput() {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredResidents = filterResidents(searchQuery);
    populateCards(filteredResidents);
}

function filterResidents(searchQuery) {
    return residents.filter(resident => {
        const residentText = resident.residentText.trim().toLowerCase();
        const fullName = resident.resident.trim().toLowerCase();
        return residentText.includes(searchQuery) || fullName.includes(searchQuery);
    });
}

document.getElementById('search-orders').addEventListener('input', handleSearchInput);




// get residents
async function getResidentsInfo() {
    try {
        const data = await fetchResidentsInfoDB();
        await updateResidentDS(data);
    } catch (error) {
        console.error("Error in fetchResident:", error);
        throw new Error("Failed to fetch resident data");
    }
}


// Function to fetch resident details from the server
async function fetchResidentDetails(residentId) {
    const url = "../../../../handlers/index.php?action=fetchResidentDetails";
    const requestData = { residentId };
    console.log(requestData);
    try {
        const response = await postData(url, requestData);
        return response;
    } catch (error) {
        console.error("Error fetching resident details:", error);
        throw new Error("Failed to fetch resident details from the database");
    }
}

// Function to get resident details
async function getResidentDetails(residentId) {
    try {
        const response = await fetchResidentDetails(residentId);
        return response.data;
    } catch (error) {
        console.error("Error getting resident details:", error);
        throw new Error("Failed to fetch resident details");
    }
}



//fetch residents from the database
async function fetchResidentsInfoDB() {
    const url = "../../../../handlers/index.php?action=fetchResidentInfo";
    try {
        const data = await getData(url);
        const responeData = data.data;
        return responeData;
    } catch (error) {
        console.error("Error in fetchResidentsInfoDB:", error);
        throw new Error("Failed to fetch resident data from database");
    }
}



// populate table with resident data from ds (residents var)
async function updateResidentDS(data) {
    try {
        residents = data;
        await populateCards(residents);
    } catch (error) {
        console.error("Error in updateResidentDS:", error);
        throw new Error("Failed to populate table");
    }
}

//  Add new resident
function collectModalData(modalId) {
    const modalData = {};
    const modal = document.getElementById(modalId);
    const inputs = modal.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        modalData[input.id] = input.value;
    });

    return modalData;
}

function handleModalSubmit() {
    const modalId = "addResidentModal";
    const residentData = collectModalData(modalId);
    console.log(residentData);
    addResident(residentData);
    closeModal();
}

// document.getElementById("addResidentBtn").addEventListener("click", handleModalSubmit);




function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, index * 100);
    });
}




async function addResident(residentData) {
    try {
        const dbResponse = await addResidentDB(residentData);
        if (dbResponse.success) {
            await addResidentDS(residentData); 
            getResidentsInfo();
        } else {
            console.error("Error: Adding resident unsuccessful");
        }
    } catch (error) {
        console.error("Error in addResident:", error);
        throw new Error("Failed to add resident");
    }
}

async function addResidentDB(residentData) {
    const url = "../../../../handlers/?action=addResident";
    const data = {
        residentText: residentData.residentText,
        sender: 1,
        recieverID: residentData.specificResident,
        allResident: 0
    };
    try {
        const responseData = await postData(url, data); // Use 'data' instead of 'residentData'
        return responseData;
    } catch (error) {
        console.error("Error in addResidentDB:", error);
        throw new Error("Failed to add resident in the database");
    }
}


async function addResidentDS(residentData) {
    try {
        residents.push(residentData);
    } catch (error) {
        console.error("Error in addResidentDS:", error);
        throw new Error("Failed to add resident to front-end data structure");
    }
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

// Call fetchResident when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    getResidentsInfo();
    // getResidents();
    // fetchResidents();
});



