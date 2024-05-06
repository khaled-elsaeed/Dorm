var fieldsData = [];

// UI-related functions

function populateDropdown(criteriaData) {
    var select = document.getElementById("fieldSelection");

    select.innerHTML = '';

    var defaultOption = document.createElement('option');
    defaultOption.text = 'Select Field';
    select.appendChild(defaultOption);

    criteriaData.forEach(function(field) {
        var fieldId = field.id;
        var fieldName = field.name;
        var fieldType = field.type;
        var option = document.createElement('option');
        option.value = fieldId;
        option.text = fieldName;
        option.setAttribute('data-type', fieldType);
        select.appendChild(option);
    });
}


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




function filterTable(tabId) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-orders");
    filter = input.value.toUpperCase();
    table = document.getElementById(tabId);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                break;
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function populateTable(tableId, criteriaData, fieldType) {
    var tableBody = document.querySelector(tableId + ' tbody');
    tableBody.innerHTML = '';

    criteriaData.forEach(function(field) {
        var fieldName = field.name;
        var fieldCriteria = field.criteria;

        if (fieldCriteria) {
            fieldCriteria.forEach(function(criteriaDetails) {
                if (!fieldType || field.type === fieldType) {
                    var rowId = 'criteria-row-' + criteriaDetails.id;
                    var row = document.createElement('tr');
                    row.setAttribute('id', rowId);

                    var fieldCell = document.createElement('td');
                    fieldCell.textContent = fieldName;
                    row.appendChild(fieldCell);

                    var criteriaCell = document.createElement('td');
                    var replacedCriteria = criteriaDetails.criteria.replace(/x/g, fieldName);
                    criteriaCell.textContent = replacedCriteria;
                    row.appendChild(criteriaCell);

                    var weightCell = document.createElement('td');
                    weightCell.textContent = criteriaDetails.weight;
                    row.appendChild(weightCell);

                    var typeCell = document.createElement('td');
                    typeCell.textContent = field.type;
                    row.appendChild(typeCell);

                    var deleteButton = document.createElement('button');
                    deleteButton.setAttribute('class', 'btn btn-sm btn-danger mt-2 me-2');
                    deleteButton.textContent = 'Delete';
                    deleteButton.onclick = function() {
                        deleteCriteria(criteriaDetails.id, criteriaDetails.criteria);
                    };

                    var actionsCell = document.createElement('td');
                    actionsCell.appendChild(deleteButton);
                    row.appendChild(actionsCell);

                    tableBody.appendChild(row);
                }
            });
        }
    });
}




function openModal() {
    var modal = new bootstrap.Modal(document.getElementById('addNewCriteriaModal'));
    modal.show();
}

function openWeightModal() {
    var modal = new bootstrap.Modal(document.getElementById('updateWeightModal'));
    modal.show();
}

function openMessageModal(message) {
    document.getElementById("modal-message").innerHTML = message;
    $('#messageModal').modal('show');
}


function handleFieldSelectionChange() {
    var selection = document.getElementById("fieldSelection");
    var selectedOption = selection.options[selection.selectedIndex];
    var selectedOptionType = selectedOption.getAttribute("data-type");

    if (selectedOptionType === "numerical") {
        document.getElementById("numericalSection").style.display = "block";
        document.getElementById("categoricalSection").style.display = "none";
    } else if (selectedOptionType === "categorical") {
        document.getElementById("numericalSection").style.display = "none";
        document.getElementById("categoricalSection").style.display = "block";
    } else {
        document.getElementById("categoricalSection").style.display = "none";
        document.getElementById("numericalSection").style.display = "none";
    }
}

function handleCriteriaSectionChange() {
    var InequalityType = document.getElementById("InequalityType").value;
    if (InequalityType === "simple") {
        document.getElementById("simpleCriteriaSection").style.display = "block";
        document.getElementById("compoundCriteriaSection").style.display = "none";
    } else if (InequalityType === "compound") {
        document.getElementById("simpleCriteriaSection").style.display = "none";
        document.getElementById("compoundCriteriaSection").style.display = "block";
    }
}



function resetAddCriteriaModal() {
    // Reset the selection dropdown
    $('#fieldSelection').val('default');
    $('#fieldSelection option:first').prop('selected', true);


    $("#numericalSection").css("display", "none");
    $("#categoricalSection").css("display", "none");



    $('#InequalityType').val('simple').trigger('change');

    $('#simpleOperator').val('');
    $('#simpleOperator option:first').prop('selected', true);

    $('#simpleValue').val('');
    $('#simpleCriteriaWeight').val('');

    $('#firstOperator').val('');
    $('#firstOperator option:first').prop('selected', true); // Set the first option as selected

    $('#firstValue').val('');
    $('#secondOperator').val('');
    $('#secondOperator option:first').prop('selected', true); // Set the first option as selected

    $('#secondValue').val('');
    $('#connective').val('');
    $('#compoundCriteriaWeight').val('');

    // Reset categorical inequality form inputs
    $('#CriteriaSelect').val('');
    $('#valueInput').val('');
    $('#categoricalCriteriaWeight').val('');
}

function resetWeigtupdateModal() {
    $('#newWeight').empty();
}

function resetModal(button) {
    var modal = $(button).closest('.modal'); // Find the closest modal element
    var modalId = modal.attr('id'); // Get the ID of the modal
    if (modalId == 'addNewCriteriaModal') {
        resetAddCriteriaModal();
    } else if (modalId == 'CalWeightModal') {
        resetGetWeightModal();
    } else {
        resetWeigtupdateModal();
    }
}

// Event handler to reset modal when it's hidden
$('.modal').on('hidden.bs.modal', function(e) {
    resetModal(e.target); // Pass the modal element as an argument
});

// Event handler for the close button
$('#data-bs-dismiss').on('click', function() {
    resetModal(this); // Pass 'this' as the argument to get the clicked button
});




function criteriaExistsForField(fieldId, newCriteria) {
    var existingField = fieldsData.find(function(field) {
        return field.id === fieldId;
    });

    if (!existingField || !existingField.criteria) {
        return false;
    }

    var existingCriteria = existingField.criteria;
    var isDuplicate = false;

    existingCriteria.forEach(function(criteria) {
        var existingWeight = parseFloat(criteria.weight);
        var newWeight = parseFloat(newCriteria.weight);

        if (
            criteria.type === newCriteria.type &&
            criteria.criteria === newCriteria.criteria &&
            existingWeight === newWeight) {
            isDuplicate = true;
        }
    });

    return isDuplicate;
}




async function saveCriteria() {
    const selection = document.getElementById("fieldSelection");
    const selectedOption = selection.options[selection.selectedIndex];
    const fieldType = selectedOption.getAttribute("data-type");
    const fieldId = selectedOption.value;
    const fieldName = selectedOption.text;

    const InequalityType = document.getElementById("InequalityType").value;

    const criteria = buildCriteria(fieldType, InequalityType);

    if (!criteriaExistsForField(fieldId, criteria)) {
        try {
            const dbResult = await addCriteriaToDB(fieldId, criteria);
            if (dbResult.success) {
                getCriteriaFromDB();

                const message = `New Criteria Created Successfully:<br>
                        Field Name: ${fieldName}<br>
                        Equation: ${criteria.criteria.replace(/x/g, fieldName)}`;
                openMessageModal(message);
            } else {
                const message = `Error while adding criteria to the database: ${dbResult.message}`;
                openMessageModal(message);
            }
        } catch (error) {
            const message = `Error while adding criteria to the database: ${error}`;
            openMessageModal(message);
        }
    } else {
        const message = "Criteria already exists for field. Not saving.";
        openMessageModal(message);
    }

    const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
    if (closeButton) {
        closeButton.click();
    }
}




function buildCriteria(fieldType, InequalityType) {
    let criteria;
    if (fieldType === 'numerical') {
        if (InequalityType === "simple") {
            criteria = buildSimpleCriteria();
        } else if (InequalityType === "compound") {
            criteria = buildCompoundCriteria();
        }
    } else {
        criteria = buildCategoricalCriteria();
    }
    return criteria;
}

function buildSimpleCriteria() {
    var operator = document.getElementById("simpleOperator").value;
    var value = document.getElementById("simpleValue").value;
    var weight = document.getElementById("simpleCriteriaWeight").value;
    return {
        type: "simple",
        criteria: `x ${operator} ${value}`,
        weight: weight
    };
}

function buildCompoundCriteria() {
    var firstOperator = document.getElementById("firstOperator").value;
    var firstValue = document.getElementById("firstValue").value;
    var connective = document.getElementById("connective").value;
    var secondOperator = document.getElementById("secondOperator").value;
    var secondValue = document.getElementById("secondValue").value;
    var weight = document.getElementById("compoundCriteriaWeight").value;
    return {
        type: "compound",
        criteria: `x ${firstOperator} ${firstValue} ${connective} x ${secondOperator} ${secondValue}`,
        weight: weight
    };
}

function buildCategoricalCriteria() {
    var newCriteria = document.getElementById('CriteriaSelect').value;
    var value = document.getElementById('valueInput').value;
    var weight = document.getElementById("categoricalCriteriaWeight").value;
    return {
        type: "categorical",
        criteria: `x ${newCriteria} ${value}`,
        weight: weight
    };
}




async function deleteCriteria(criteriaId,Criteria) {
    try {
        const confirmed = await openConfirmationModal(`Are you sure you want to delete the following Criteria ( ${Criteria} ) ?`);
        if (confirmed) {
            const dbResponse = await deleteCriteriaFromDB(criteriaId);
            if (dbResponse.success) {
                getCriteriaFromDB();
            } else {
                console.error("Error: Deletion from database unsuccessful");
            }
        }
    } catch (error) {
        console.error("Error in removeRoom:", error);
        throw new Error("Failed to remove room");
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

async function getCriteriaFromDB() {
    try {
        const response = await getData('../../../../handlers/?action=fetchCriteria');
        fieldsData = response.data;
        console.log("neww");

        console.log(fieldsData);
        populateDropdown(fieldsData);
        populateTable('#orders-all', fieldsData);
        populateTable('#orders-numerical', fieldsData, 'numerical');
        populateTable('#orders-categorical', fieldsData, 'categorical');
    } catch (error) {
        console.error("Error in getCriteriaFromDB:", error);
    }
}

async function addCriteriaToDB(fieldId, criteria) {
    try {
        const response = await postData('../../../../handlers/?action=newCriteria', {
            fieldId: fieldId,
            type: criteria.type,
            criteria: criteria.criteria,
            weight: criteria.weight
        });
        return response;

    } catch (error) {
        console.error("Error adding criteria:", error);
    }
}



async function deleteCriteriaFromDB(criteriaId) {
    try {

        const response = await postData('../../../../handlers/?action=removeCriteria', {
            criteriaId: criteriaId
        });
        openMessageModal("Criteria deleted successfully.");
        return response;
    } catch (error) {
        console.error("Error deleting criteria:", error);
    }
}




// Event listeners

// Event listener for selection dropdown change
document.getElementById("fieldSelection").addEventListener("change", handleFieldSelectionChange);
$('#addNewCriteriaModal').on('show.bs.modal', handleFieldSelectionChange);

// Event listener for input field addition

// Event listener for keyup event in search input
document.getElementById("search-orders").addEventListener("keyup", function() {
    filterTable("orders-all");
    filterTable("orders-numerical");
    filterTable("orders-categorical");
});


// Event listener for document load
document.addEventListener("DOMContentLoaded", function() {
    getCriteriaFromDB();
});