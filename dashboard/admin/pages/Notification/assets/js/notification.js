// global variables
var notifications = [];
var residents = [];

// Function to populate the table with notification data
async function populateTable(notifications) {
    var notificationList = document.querySelector("tbody");
    notificationList.innerHTML = ""; // Clear existing content
    notifications.forEach(function (notification,index) {
        notificationList.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${notification.notificationText}</td>
                <td>${notification.sentAt}</td>
                <td>${notification.resident}</td>
            </tr>
        `;
    });
}


// Modal functions
function openModal() {
    $('#addNotificationModal').modal('show');
}

function closeModal() {
    $('#addNotificationModal').modal('hide');
}

document.getElementById('openModalBtn').addEventListener('click', openModal);

document.getElementById('closeModalBtn').addEventListener('click', closeModal);


function resetModal() {
    document.getElementById('addNotificationModal').querySelector('form').reset();
}

// show or hide resident id input 
function allOrSpecificSelect() {
    var destination = document.getElementById('specificOrAll');
    var specificResidentDiv = document.getElementById('specificResidentDiv');
    
    if (destination.value !== 'all') { // Use .value to get the selected value of the dropdown
        specificResidentDiv.style.display = 'block';
    } else {
        specificResidentDiv.style.display = 'none';
    }
}

document.getElementById('specificOrAll').addEventListener('change', allOrSpecificSelect);

// search
function handleSearchInput() {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredNotifications = filterNotifications(searchQuery);
    populateTable(filteredNotifications);
}

function filterNotifications(searchQuery) {
    return notifications.filter(notification => {
        const notificationText = notification.notificationText.trim().toLowerCase();
        const fullName = notification.resident.trim().toLowerCase();
        return notificationText.includes(searchQuery) || fullName.includes(searchQuery);
    });
}

document.getElementById('search-orders').addEventListener('input', handleSearchInput);




// get notifications
async function getNotifications() {
    try {
        const data = await fetchNotificationDB();
        await updateNotificationDS(data);
    } catch (error) {
        console.error("Error in fetchNotification:", error);
        throw new Error("Failed to fetch notification data");
    }
}

//fetch notifications from the database
async function fetchNotificationDB() {
    const url = "../../../../handlers/index.php?action=fetchNotifications";
    try {
        const data = await getData(url);
        const responeData = data.data;
        return responeData;
    } catch (error) {
        console.error("Error in fetchNotificationDB:", error);
        throw new Error("Failed to fetch notification data from database");
    }
}

// populate table with notification data from ds (notifications var)
async function updateNotificationDS(data) {
    try {
        notifications = data;
        await populateTable(notifications);
    } catch (error) {
        console.error("Error in updateNotificationDS:", error);
        throw new Error("Failed to populate table");
    }
}

//  Add new notification
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
    const modalId = "addNotificationModal";
    const notificationData = collectModalData(modalId);
    console.log(notificationData);
    addNotification(notificationData);
    closeModal();
}

document.getElementById("addNotificationBtn").addEventListener("click", handleModalSubmit);


async function addNotification(notificationData) {
    try {
        const dbResponse = await addNotificationDB(notificationData);
        if (dbResponse.success) {
            await addNotificationDS(notificationData); 
            getNotifications();
        } else {
            console.error("Error: Adding notification unsuccessful");
        }
    } catch (error) {
        console.error("Error in addNotification:", error);
        throw new Error("Failed to add notification");
    }
}

async function addNotificationDB(notificationData) {
    const url = "../../../../handlers/?action=addNotification";
    const data = {
        notificationText: notificationData.notificationText,
        sender: 1,
        recieverID: notificationData.specificResident,
        allResident: 0
    };
    try {
        const responseData = await postData(url, data); // Use 'data' instead of 'notificationData'
        return responseData;
    } catch (error) {
        console.error("Error in addNotificationDB:", error);
        throw new Error("Failed to add notification in the database");
    }
}


async function addNotificationDS(notificationData) {
    try {
        notifications.push(notificationData);
    } catch (error) {
        console.error("Error in addNotificationDS:", error);
        throw new Error("Failed to add notification to front-end data structure");
    }
}

// get residents
async function getResidents() {
    try {
        const data = await fetchResidentsDB();
        await updateResidentsSelect(data);
    } catch (error) {
        console.error("Error in getResidents:", error);
        throw new Error("Failed to fetch and populate residents");
    }
}

async function fetchResidentsDB() {
    const url = "../../../../handlers/?action=fetchResidents";
    try {
        const data = await getData(url);
        return data.data;
    } catch (error) {
        console.error("Error in fetchResidentsDB:", error);
        throw new Error("Failed to fetch resident data from the database");
    }
}

async function updateResidentsSelect(data) {
    try {
        console.log(data);
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Data is not in the expected format.");
        }
        
        const residents = data;

        populateResidentSelect(residents);

    } catch (error) {
        console.error("Error in updateResidentsSelect:", error);
        throw new Error("Failed to populate resident select dropdown");
    }
}

function populateResidentSelect(data){
    const selectElement = document.getElementById("specificResident");
        selectElement.innerHTML = "";
        console.log(data)
        data.forEach(resident => {
            const option = document.createElement("option");
            option.value = resident.residentId;
            option.textContent = `${resident.firstName} ${resident.lastName}`;
            selectElement.appendChild(option);
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

// Call fetchNotification when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    getNotifications();
    getResidents();
    // fetchResidents();
});



