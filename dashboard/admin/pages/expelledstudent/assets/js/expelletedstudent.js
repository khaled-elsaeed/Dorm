// Global variable to store expelled students data
var expelledStudents = [];

// Initialize the application when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    getExpelledStudents();
});

// Fetch expelled students data from the database
async function getExpelledStudents() {
    try {
        const data = await fetchExpelledStudentsFromDB();
        expelledStudents = data;
        console.log(data);
        updateExpelledStudentsView(expelledStudents);
    } catch (error) {
        console.error("Error in getExpelledStudents:", error);
        throw new Error("Failed to fetch expelled students data");
    }
}

// Fetch expelled students data from the database
async function fetchExpelledStudentsFromDB() {
    const url = "../../../../handlers/?action=fetchExpelledStudents";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchExpelledStudentsFromDB:", error);
        throw new Error("Failed to fetch expelled students data from the database");
    }
}

// Update the view with expelled students data
async function updateExpelledStudentsView(expelledStudents) {
    const allTableBody = document.querySelector('tbody');
    populateTable(allTableBody, expelledStudents);
}

// Populate the table with expelled students data
async function populateTable(tableBody, expelledStudents) {
    tableBody.innerHTML = '';
    expelledStudents.forEach((expulsion, index) => {
        const studentRow = createStudentRow(expulsion, index);
        tableBody.appendChild(studentRow);
    });
}

// Create a row for each expelled student
function createStudentRow(expulsion, index) {
    const {
        id,
        studentId,
        name,
        expulsionStatus,
        alerts
    } = expulsion;
    const hasAlerts = alerts && alerts.some(alert => alert.type === 'alert');
    const hasWarnings = alerts && alerts.some(alert => alert.type === 'warning');

    const studentRow = document.createElement('tr');
    studentRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>${studentId}</td>
        <td>${hasAlerts ? `Yes <a href="#" onclick="showDescription(${alerts.find(alert => alert.type === 'alert').id})"><i class="fas fa-comment"></i></a>` : 'No'}</td>
        <td>${hasWarnings ? `Yes <a href="#" onclick="showDescription(${alerts.find(alert => alert.type === 'warning').id})"><i class="fas fa-comment"></i></a>` : 'No'}</td>
        <td>${expulsionStatus}</td>
        <td>${createActionButtons(id, hasAlerts, hasWarnings)}</td>
    `;
    return studentRow;
}


// Create action buttons based on student's alerts and warnings status
function createActionButtons(expelledId, hasAlerts, hasWarnings) {
    let buttonsHTML = '';
    if (!hasAlerts) {
        buttonsHTML += `<button class="btn btn-primary" onclick="handleAction('alert', '${expelledId}')">Add Alert</button>`;
    } else if (!hasWarnings) {
        buttonsHTML += `<button class="btn btn-warning" onclick="handleAction('warning', '${expelledId}')">Add Warning</button>`;
    } else {
        buttonsHTML += `<button class="btn btn-danger" onclick="handleAction('expulsion', '${expelledId}')">Expulsion</button>`;
    }
    return buttonsHTML;
}

// Handle different actions on expelled students
function handleAction(action, expelledId) {
    if (action === 'alert') {
        handleAlert(expelledId);
    } else if (action === 'warning') {
        handleWarning(expelledId);
    } else {
        handleExpulsion(expelledId);
    }
}

// Handle adding alert for an expelled student
async function handleAlert(expelledId) {
    openModal('descritionModal');
    $('#descriptionSubmitBtn').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        try {
            await handleAlertInDB(expelledId, description);
            await handleAlertInView(expelledId, description);
        } catch (error) {
            console.error("Error handling alert:", error);
            // Handle errors appropriately
        } finally {
            closeModal();
            $('#descriptionSubmitBtn').off('click', submitModalBtnClickHandler);
        }
    });
}

// Handle adding alert in the database
async function handleAlertInDB(expelledId, description) {
    const url = "../../../../handlers/?action=makeAlert";
    const data = {
        expelledId: expelledId,
        description: description
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleAlertInDB:", error);
        throw new Error("Failed to add alert in the database");
    }
}


async function handleAlertInView(expelledId, description) {
    try {
        const index = expelledStudents.findIndex(expulsion => expulsion.id === expelledId);
        if (index !== -1) {
            if (!expelledStudents[index].alerts) {
                expelledStudents[index].alerts = [];
            }
            expelledStudents[index].alerts.push({
                type: 'alert',
                description: description
            });
            updateExpelledStudentsView(expelledStudents);
        }
    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}

// Handle adding warning for an expelled student
async function handleWarning(expelledId) {
    openModal('descritionModal');
    $('#descriptionSubmitBtn').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        try {
            await handleWarningInDB(expelledId, description);
            await handleWarningInView(expelledId, description);
        } catch (error) {
            console.error("Error handling warning:", error);
            // Handle errors appropriately
        } finally {
            closeModal();
            $('#descriptionSubmitBtn').off('click', submitModalBtnClickHandler);
        }
    });
}

// Handle adding warning in the database
async function handleWarningInDB(expelledId, description) {
    const url = "../../../../handlers/?action=makeWarning";
    const data = {
        expelledId: expelledId,
        description: description
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleWarningInDB:", error);
        throw new Error("Failed to add warning in the database");
    }
}


async function handleWarningInView(expelledId, description) {
    try {
        const index = expelledStudents.findIndex(expulsion => expulsion.id === expelledId);
        if (index !== -1) {
            if (!expelledStudents[index].warnings) {
                expelledStudents[index].warnings = [];
            }
            expelledStudents[index].warnings.push({
                type: 'warning',
                description: description
            });
            updateExpelledStudentsView(expelledStudents);
        }
    } catch (error) {
        console.error("Error handling warning in view:", error);
    }
}

// Handle adding expulsion for an expelled student
async function handleExpulsion(expelledId) {
    openModal('descritionModal');
    $('#descriptionSubmitBtn').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        try {
            await handleExpulsionInDB(expelledId, description);
            await handleExpulsionInView(expelledId, description);
        } catch (error) {
            console.error("Error handling expulsion:", error);
            // Handle errors appropriately
        } finally {
            closeModal();
            $('#descriptionSubmitBtn').off('click', submitModalBtnClickHandler);
        }
    });
}

// Handle adding expulsion in the database
async function handleExpulsionInDB(expelledId, description) {
    const url = "../../../../handlers/?action=makeExpulsion";
    const data = {
        expelledId: expelledId,
        description: description
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleExpulsionInDB:", error);
        throw new Error("Failed to add expulsion in the database");
    }
}


async function handleExpulsionInView(expelledId, description) {
    try {
        const index = expelledStudents.findIndex(expulsion => expulsion.id === expelledId);
        if (index !== -1) {

            expelledStudents[index].expulsionStatus = "true";
            expelledStudents[index].expulsions.push({
                type: 'expulsion',
                description: description
            });
            updateExpelledStudentsView(expelledStudents);
        }
    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}

// Function to get the description of an alert for an expelled student
function getAlertDescription(alertId) {
    console.log(alertId);
    for (const expulsion of expelledStudents) {
        if (expulsion.alerts) {
            const alert = expulsion.alerts.find(alert => parseInt(alert.id) === parseInt(alertId));
            if (alert) {
                return alert.description;
            }
        }
    }
    return "Alert description not found";
}

// Function to show the description of an alert
function showDescription(alertId) {
    const alertDescription = getAlertDescription(alertId);
    alert(alertDescription);
}




// Open the modal
function openModal(modalName) {
    $(modalName).modal('show');
}

// Close the modal
function closeModal(modalName) {
    $(modalName).modal('hide');
}

// Reset modal content
function resetModal(modalName) {
    // Reset modal content for the specified modal name if needed
}


// Event listeners
$('#openModalBtn').click(openModal);
$('#closeModalBtn').click(closeModal);
$('#resetModalBtn').click(resetModal);

// Event listener for search input
const searchInput = document.getElementById('search-orders');
searchInput.addEventListener('input', function() {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredExpelledStudents = filterExpelledStudents(searchQuery);
    updateExpelledStudentsView(filteredExpelledStudents);
});

// Filter expelled students based on search query
function filterExpelledStudents(searchQuery) {
    return expelledStudents.filter(expulsion => {
        const fullName = expulsion.name.toLowerCase();
        const studentId = String(expulsion.studentId).toLowerCase(); // Ensure studentId is converted to string
        return fullName.includes(searchQuery) || studentId.includes(searchQuery);
    });
}


// Fetch data from a URL using GET method
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

// Send data to a URL using POST method
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
        throw new Error("Failed to post data");
    }
}