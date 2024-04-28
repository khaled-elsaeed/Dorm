var maintenanceRequests = [];

async function getMaintenanceRequests() {
    try {
        const data = await fetchMaintenanceRequestsFromDB();
         maintenanceRequests = data;
        updateMaintenanceRequestsView(maintenanceRequests);
    } catch (error) {
        console.error("Error in getMaintenanceRequests:", error);
        throw new Error("Failed to fetch resident count data");
    }
}

async function fetchMaintenanceRequestsFromDB() {
    const url = "../../../../handlers/?action=fetchMaintenanceRequests";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchMaintenanceRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}

async function updateMaintenanceRequestsView(maintenanceRequests) {
    // Get references to all the tables
    const allTableBody = document.getElementById('orders-all').querySelector('tbody');
    const completeTableBody = document.getElementById('orders-complete').querySelector('tbody');
    const pendingTableBody = document.getElementById('orders-pending').querySelector('tbody');
    const inProgressTableBody = document.getElementById('orders-inProgress').querySelector('tbody');
    const rejectTableBody = document.getElementById('orders-reject').querySelector('tbody');


    // Call populateTable function for each table
    populateTable(allTableBody, maintenanceRequests);
    populateTable(completeTableBody, maintenanceRequests.filter(request => request.status === 'complete'));
    populateTable(pendingTableBody, maintenanceRequests.filter(request => request.status === 'pending'));
    populateTable(inProgressTableBody, maintenanceRequests.filter(request => request.status === 'inProgress'));
    populateTable(rejectTableBody, maintenanceRequests.filter(request => request.status === 'reject'));

}

async function populateTable(tableBody, maintenanceRequests) {
    // Clear previous content in the table
    tableBody.innerHTML = '';
    console.log(maintenanceRequests);

    // Iterate over maintenance requests
    maintenanceRequests.forEach((request, index) => {
        const maintenanceRequestId = request.Id;
        const description = request.description;
        const location = "R" + request.roomNumber + "A" + request.apartmentNumber + "B" + request.buildingNumber;
        const residentName = request.firstName + " " + request.lastName;
        const requestDate = request.requestDate;
        const status = request.status // Convert status to lowercase
        const completeDate = request.completeDate;
        const assignedTo = request.assignedTo;
        const completeDateValue = completeDate === null ? 'Not Complete' : completeDate;
        const assignedToValue = assignedTo === null ? 'Not Assigned' : assignedTo;

        // Map status to Bootstrap badge classes
        let badgeClass = '';
        switch (status) {
            case 'pending':
                badgeClass = 'bg-warning';
                break;
            case 'inProgress':
                badgeClass = 'bg-primary';
                break;
            case 'complete':
                badgeClass = 'bg-success';
                break;
            default:
                badgeClass = 'bg-secondary';
                break;
        }

        // Create badges for status
        const statusBadge = `<span class="badge ${badgeClass}">${status}</span>`;

        // Create buttons based on the status
        let actionButtons = '';
        if (status === 'pending') {
            actionButtons = `
                <button type="button" class="btn btn-success btn-sm actionBtn" data-action="inProgress" data-maintenanceRequestId="${maintenanceRequestId}">Start</button>
                <button type="button" class="btn btn-danger btn-sm actionBtn" data-action="complete" data-maintenanceRequestId="${maintenanceRequestId}">Complete</button>
                <button type="button" class="btn btn-danger btn-sm actionBtn" data-action="reject" data-maintenanceRequestId="${maintenanceRequestId}">Reject</button>
            `;
        }
         else if (status === 'inProgress') {
            actionButtons = `
                <button type="button" class="btn btn-danger btn-sm actionBtn" data-action="complete" data-maintenanceRequestId="${maintenanceRequestId}">Complete</button>
            `;
        }else{
            actionButtons = `
                <button type="button" class="btn btn-danger btn-sm actionBtn" data-action="complete" data-maintenanceRequestId="${maintenanceRequestId}" disabled>Complete</button>
            `;
        }

        // Create a new row for each maintenance request
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${location}</td>
            <td>${residentName}</td>
            <td>${description}</td>
            <td>${requestDate}</td>
            <td>${statusBadge}</td> <!-- Status badge -->
            <td>
                ${actionButtons}
            </td>
            <td>${assignedToValue}</td>
            <td>${completeDateValue}</td>
        `;

        // Append the row to the table
        tableBody.appendChild(row);

        // Add event listener to the action buttons
        const actionBtns = row.querySelectorAll('.actionBtn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const action = btn.dataset.action;
                const maintenanceRequestId = btn.getAttribute('data-maintenanceRequestId');
                handleAction(action, maintenanceRequestId);
            });
        });
    });
}





function handleAction(action, maintenanceRequestId) {
    // Check the action
    if (action === 'inProgress') {
        handleInProgressRequest(maintenanceRequestId);
    } else if (action === 'complete') {
        handleCompleteRequest(maintenanceRequestId);
    }else{
        handleRejectRequest(maintenanceRequestId);

    }
}

// Function to open the modal and get input
async function handleInProgressRequest(maintenanceRequestId) {
    openModal();
    
    // Attach the click event listener
    $('#submitModalBtn').on('click', async function submitModalBtnClickHandler() { // Give the function a name for easier removal
        const assignedToName = $('#assignedToName').val();

        try {
            const response = await handleInProgressRequestInDB(maintenanceRequestId, assignedToName);
            console.log("Response from handleInProgressRequestInDB:", response);
            if (response && response.success) {
                await handleInProgressRequestView(maintenanceRequestId,assignedToName);
            }
        } catch (error) {
            console.error("Error handling in-progress request:", error);
            // Handle errors appropriately
        } finally {
            closeModal();
            
            // Remove the click event listener after execution
            $('#submitModalBtn').off('click', submitModalBtnClickHandler);
        }
    });
}


async function handleInProgressRequestInDB (maintenanceRequestId,assignedToName){
    const url = "../../../../handlers/?action=startMaintenanceProcess";
    const data = {
        maintenanceRequestId : maintenanceRequestId,
        assignedToName :assignedToName
    }
    try {
        const response = await postData(url,data);
        return response;
    } catch (error) {
        console.error("Error in fetchMaintenanceRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}

async function handleInProgressRequestView(maintenanceRequestId, assignedToName) {
    try {
        const index = maintenanceRequests.findIndex(request => {
            return parseInt(request.Id) === parseInt(maintenanceRequestId);
        });
        if (index !== -1) {
            maintenanceRequests[index].status = 'inProgress';
            maintenanceRequests[index].assignedTo = assignedToName;
            console.log(maintenanceRequests)
            updateMaintenanceRequestsView(maintenanceRequests);
        }

    } catch (error) {
        console.error("Error handling in-progress request:", error);
    }
}




async function handleCompleteRequest(maintenanceRequestId) {
    

        try {
            const response = await handleInCompleteRequestInDB(maintenanceRequestId);
            console.log("Response from handleInCompleteRequestInDB:", response);
            if (response && response.success) {
                await handleInCompleteRequestView(maintenanceRequestId);
            }
        } catch (error) {
            console.error("Error handling in-progress request:", error);
        } 
    
}





async function handleInCompleteRequestInDB (maintenanceRequestId){
    const url = "../../../../handlers/?action=endMaintenanceProcess";
    const data = {
        maintenanceRequestId : maintenanceRequestId
    }
    try {
        const response = await postData(url,data);
        return response;
    } catch (error) {
        console.error("Error in fetchMaintenanceRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}

async function handleInCompleteRequestView(maintenanceRequestId) {
    try {
        const index = maintenanceRequests.findIndex(request => {
            return parseInt(request.Id) === parseInt(maintenanceRequestId);
        });
        if (index !== -1) {
            maintenanceRequests[index].status = 'complete';
            maintenanceRequests[index].completeDate = new Date().toLocaleString();
            updateMaintenanceRequestsView(maintenanceRequests);
        }

    } catch (error) {
        console.error("Error handling in-progress request:", error);
    }
}






async function handleRejectRequest(maintenanceRequestId) {
    

    try {
        const response = await handleInRejectRequestInDB(maintenanceRequestId);
        console.log("Response from handleInRejectRequestInDB:", response);
        if (response && response.success) {
            await handleInRejectRequestView(maintenanceRequestId);
        }
    } catch (error) {
        console.error("Error handling in-progress request:", error);
    } 

}





async function handleInRejectRequestInDB (maintenanceRequestId){
const url = "../../../../handlers/?action=rejectMaintenanceProcess";
const data = {
    maintenanceRequestId : maintenanceRequestId
}
try {
    const response = await postData(url,data);
    return response;
} catch (error) {
    console.error("Error in fetchMaintenanceRequestsFromDB:", error);
    throw new Error("Failed to fetch resident count data from database");
}
}

async function handleInRejectRequestView(maintenanceRequestId) {
try {
    const index = maintenanceRequests.findIndex(request => {
        return parseInt(request.Id) === parseInt(maintenanceRequestId);
    });
    if (index !== -1) {
        maintenanceRequests[index].status = 'reject';
        maintenanceRequests[index].completeDate = new Date().toLocaleString();
        updateMaintenanceRequestsView(maintenanceRequests);
    }

} catch (error) {
    console.error("Error handling in-progress request:", error);
}
}







// Function to open the modal
function openModal() {
    $('#assignedToModal').modal('show');
}

// Function to close the modal
function closeModal() {
    $('#assignedToModal').modal('hide');
}

// Function to reset the modal content
function resetModal() {
    // You may reset any form fields or modal content here
}


// Event listener for button to open modal
$('#openModalBtn').click(function() {
    openModal();
});

// Event listener for button to close modal
$('#closeModalBtn').click(function() {
    closeModal();
});

// Event listener for button to reset modal content
$('#resetModalBtn').click(function() {
    resetModal();
});




function filterMaintenanceRequests(searchQuery) {
    return maintenanceRequests.filter(request => {
        const fullName = request.firstName + " " + request.lastName;
        const buildingApartmentRoom = (request.buildingNumber + request.apartmentNumber + request.roomNumber).toLowerCase();
        return (
            request.description.toLowerCase().includes(searchQuery) ||
            fullName.includes(searchQuery) ||
            buildingApartmentRoom.includes(searchQuery) 
        );
    });
}





// Event listener for search input
const searchInput = document.getElementById('search-orders');
searchInput.addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredMaintenanceRequests = filterMaintenanceRequests(searchQuery);
    updateMaintenanceRequestsView(filteredMaintenanceRequests);
});


async function fetchData(url = "") {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.json();
    } catch (error) {
        console.error("Error in fetchData:", error);
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

document.addEventListener('DOMContentLoaded', function () {
    getMaintenanceRequests();

});
