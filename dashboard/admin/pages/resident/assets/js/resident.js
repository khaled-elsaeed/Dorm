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
                    <div><i class="fas fa-graduation-cap"></i> Level: <span>${resident.yearOfStudy}</span></div>
                    <div><i class="fas fa-id-badge"></i> Student ID: <span>${resident.studentId}</span></div>
                    <button class="info-button" onclick="showMoreInfo('${resident.residentId}')">More Info</button>
                    </div>
            </div>
        `;
        container.appendChild(card);
    });
    animateCards();
}


function showMoreInfo(residentId){
    console.log("clicked");
    console.log(residentId);

    const resident = residents.find(res => parseInt(res.residentId) == parseInt(residentId)); // Find the resident object
    if (resident) {
        console.log("found");
        setDataInModal(resident); // Populate modal with resident data
        $('#studentModal').modal('show'); // Show the modal
    }
}


// Function to set data inside the modal
function setDataInModal(resident) {
    console.log(resident);
    const residenLocation = "B" + resident.buildingNumber + ", " + "A" + resident.apartmentNumber + ", " + "R" + resident.roomNumber;
    document.getElementById('modal-location').textContent = residenLocation;
    document.getElementById('modal-faculty').textContent = resident.faculty;
    document.getElementById('modal-level').textContent = resident.yearOfStudy;
    document.getElementById('modal-studentId').textContent = resident.studentId;
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

// get residents
// async function getResidentsInfo() {
//     try {
//         const data = await fetchResidentsDB();
//         await updateResidentsSelect(data);
//     } catch (error) {
//         console.error("Error in getResidentsInfo:", error);
//         throw new Error("Failed to fetch and populate residents");
//     }
// }

// async function fetchResidentsDB() {
//     const url = "../../../../handlers/?action=fetchResidents";
//     try {
//         const data = await getData(url);
//         return data.data;
//     } catch (error) {
//         console.error("Error in fetchResidentsDB:", error);
//         throw new Error("Failed to fetch resident data from the database");
//     }
// }

// async function updateResidentsSelect(data) {
//     try {
//         console.log(data);
//         if (!Array.isArray(data) || data.length === 0) {
//             throw new Error("Data is not in the expected format.");
//         }
        
//         const residents = data;

//         populateResidentSelect(residents);

//     } catch (error) {
//         console.error("Error in updateResidentsSelect:", error);
//         throw new Error("Failed to populate resident select dropdown");
//     }
// }

// function populateResidentSelect(data){
//     const selectElement = document.getElementById("specificResident");
//         selectElement.innerHTML = "";
//         console.log(data)
//         data.forEach(resident => {
//             const option = document.createElement("option");
//             option.value = resident.residentId;
//             option.textContent = `${resident.firstName} ${resident.lastName}`;
//             selectElement.appendChild(option);
//         });
// }







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



