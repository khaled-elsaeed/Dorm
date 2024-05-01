let expelledStudents = [];


document.addEventListener('DOMContentLoaded', function() {
    getExpelledStudents();
});


async function getExpelledStudents() {
    try {
        const data = await fetchExpelledStudentsFromDB();
        expelledStudents = data;
        console.log(expelledStudents);
        updateExpelledStudentsView(expelledStudents);
    } catch (error) {
        console.error("Error in getExpelledStudents:", error);
        throw new Error("Failed to fetch expelled students data");
    }
}




async function addExpelledStudent() {
    const studentName = $('#studentName').val();
    const studentID = $('#studentId').val();
    try {
        const response = await addExpelledStudentInDB(studentID, studentName);
        if (response.success) {
            await addExpelledStudentInView();
            closeModal('#addStudentModal');
        }
    } catch (error) {
        console.error("Error handling alert:", error);

    } finally {
        closeModal('#addStudentModal');
    }
}


$('#addStudentBtn').off('click').on('click', async function() {
    await addExpelledStudent();
});




async function addExpelledStudentInDB(studentId, studentName) {
    const url = "../../../../handlers/?action=addExpelledStudent";
    const data = {
        studentId: studentId,
        studentName: studentName
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleAlertInDB:", error);
        throw new Error("Failed to add alert in the database");
    }
}

async function addExpelledStudentInView() {
    try {

        await getExpelledStudents();
        await updateExpelledStudentsView(expelledStudents);

    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}




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


async function updateExpelledStudentsView(expelledStudents) {
    const allTableBody = document.querySelector('tbody');
    populateTable(allTableBody, expelledStudents);
}


function populateTable(tableBody, expelledStudents) {
    tableBody.innerHTML = '';
    expelledStudents.forEach((expulsion, index) => {
        const studentRow = createStudentRow(expulsion, index);
        tableBody.appendChild(studentRow);
    });
}


function createStudentRow(expulsion, index) {
    const id = expulsion.id;
    const studentId = expulsion.studentId;
    const expulsionStatus = expulsion.expulsionStatus;
    const name = expulsion.name;
    const alerts = expulsion.alerts;
    const expulsionType = expulsion.expulsionType ;

    console.log(expulsion);
    const hasAlerts = alerts && alerts.some(alert => alert.type === 'alert');
    const hasWarnings = alerts && alerts.some(alert => alert.type === 'warning');
    const isExpelled = alerts && alerts.some(alert => alert.type === 'expulsion');


    const studentRow = document.createElement('tr');
    studentRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>${studentId}</td>
        <td>${hasAlerts ? `Yes <a href="#" onclick="showDescription(${alerts.find(alert => alert.type === 'alert').id})"><i class="fas fa-comment"></i></a>` : 'No'}</td>
        <td>${hasWarnings ? `Yes <a href="#" onclick="showDescription(${alerts.find(alert => alert.type === 'warning').id})"><i class="fas fa-comment"></i></a>` : 'No'}</td>
        <td>${isExpelled ? `Yes <a href="#" onclick="showDescription(${alerts.find(alert => alert.type === 'expulsion').id})"><i class="fas fa-comment"></i></a>` : 'No'}</td>
        <td>${createActionButtons(id, hasAlerts, hasWarnings,isExpelled,expulsionType)}</td>
    `;
    return studentRow;
}


function createActionButtons(expelledId, hasAlerts, hasWarnings,isExpelled,expulsionType) {
    let buttonsHTML = '';
    if (!hasAlerts) {
        buttonsHTML += `<button class="btn btn-primary" onclick="handleAction('alert', '${expelledId}')">Add Alert</button>`;
    } else if (!hasWarnings) {
        buttonsHTML += `<button class="btn btn-warning" onclick="handleAction('warning', '${expelledId}')">Add Warning</button>`;
    } else if (isExpelled){
        buttonsHTML += `<button class="btn btn-secondry" disabled>${expulsionType}</button>`;
    }else{
        buttonsHTML += `<button class="btn btn-danger" onclick="handleAction('expulsion', '${expelledId}')">Expulsion</button>`;

    }
    return buttonsHTML;
}


function handleAction(action, expelledId) {
    if (action === 'alert') {
        handleAlert(expelledId);
    } else if (action === 'warning') {
        handleWarning(expelledId);
    } else {
        handleExpulsion(expelledId);
    }
}


async function handleAlert(expelledId) {
    openModal('#showDescriptionModal');
    $('#addDescriptionBtn').off('click').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        try {
            const response = await handleAlertInDB(expelledId, description);
            if (response.success) {
                await handleAlertInView(expelledId, description);
                closeModal('#showDescriptionModal');

            }
        } catch (error) {
            console.error("Error handling alert:", error);

        } finally {
            closeModal('#showDescriptionModal');
        }
    });
}


async function handleAlertInDB(expelledId, description) {
    const url = "../../../../handlers/?action=makeAlert";
    const data = {
        expelledId: expelledId,
        description: description,
        type: 'alert'
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

        await getExpelledStudents();
        await updateExpelledStudentsView(expelledStudents);
    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}




async function handleWarning(expelledId) {
    openModal('#showDescriptionModal');
    $('#addDescriptionBtn').off('click').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        try {
            const response = await handleWarningInDB(expelledId, description);
            if (response.success) {
                await handleWarningInView(expelledId, description);
                closeModal('#showDescriptionModal');
            }
        } catch (error) {
            console.error("Error handling alert:", error);

        } finally {
            closeModal('#showDescriptionModal');
        }
    });
}


async function handleWarningInDB(expelledId, description) {
    const url = "../../../../handlers/?action=makeWarning";
    const data = {
        expelledId: expelledId,
        description: description,
        type: 'Warning'
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleWarningInDB:", error);
        throw new Error("Failed to add alert in the database");
    }
}

async function handleWarningInView(expelledId, StudentName) {
    try {

        await getExpelledStudents();

        await updateExpelledStudentsView(expelledStudents);


    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}




async function handleExpulsion(expelledId) {
    openModal('#showDescriptionModal');

    $('#durationSelect').prop('display', 'block');
    $('#addDescriptionBtn').off('click').on('click', async function submitModalBtnClickHandler() {
        const description = $('#description').val();
        const duration = $('#duration').val();

        try {
            const response = await handleExpulsionInDB(expelledId, description,duration);
            if (response.success) {
                await handleExpulsionInView();
                closeModal('#showDescriptionModal');
            }
        } catch (error) {
            console.error("Error handling alert:", error);

        } finally {
            closeModal('#showDescriptionModal');
        }
    });
}


async function handleExpulsionInDB(expelledId, description,duration) {
    const url = "../../../../handlers/?action=makeExpulsion";
    const data = {
        expelledId: expelledId,
        description: description,
        duration:duration
    };
    try {
        const response = await postData(url, data);
        return response;
    } catch (error) {
        console.error("Error in handleWarningInDB:", error);
        throw new Error("Failed to add alert in the database");
    }
}


async function handleExpulsionInView() {
    try {

        await getExpelledStudents();

        await updateExpelledStudentsView(expelledStudents);

    } catch (error) {
        console.error("Error handling alert in view:", error);
    }
}




function getAlertDescription(alertId) {
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


function showDescription(alertId) {
    const alertDescription = getAlertDescription(alertId);
    $('#description').val(alertDescription).prop('readonly', true);
    $('#showDescriptionModal').on('hidden.bs.modal', function(e) {
        $('#description').val('');
        $('#description').prop('readonly', false);
    }).modal('show');
}




function openModal(modalId) {
    $(modalId).modal('show');
}


function closeModal(modalId) {
    $(modalId).modal('hide');
}



function resetModal(modalName) {

}




const searchInput = document.getElementById('search-orders');
searchInput.addEventListener('input', function() {
    const searchQuery = this.value.trim().toLowerCase();
    const filteredExpelledStudents = filterExpelledStudents(searchQuery);
    updateExpelledStudentsView(filteredExpelledStudents);
});


function filterExpelledStudents(searchQuery) {
    return expelledStudents.filter(expulsion => {
        const fullName = expulsion.name.toLowerCase();
        const studentId = String(expulsion.studentId).toLowerCase();
        return fullName.includes(searchQuery) || studentId.includes(searchQuery);
    });
}



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
        throw new Error("Failed to post data");
    }
}