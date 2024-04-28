/* 
  Function to fetch and post data from the specified URL using async/await.
*/
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        
        return null;
    }
}

async function postData(url, payload) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the POST operation:', error);
        return null;
    }
}


/* 
  Function to fetch nationalities from json files and populate them in select
*/

async function fetchNationalites() {
    try {
        const nationalities = await fetchData("assets/data/nationalities.json");
        return nationalities;
    } catch (error) {
        console.error('Error fetching nationalities:', error);
        return [];
    }
}


async function populateNationalites() {
    const nationalitiesSelect = document.getElementById("nationality");
    try {
        const nationalities = await fetchNationalites();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a nationality";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        nationalitiesSelect.appendChild(defaultOption);

        
        nationalities.forEach(nationality => {
            const option = document.createElement("option");
            option.textContent = nationality;
            option.value = nationality;
            nationalitiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating nationalities:', error);
    }
}

populateNationalites();





/* 
  Function to fetch governorates and cities from json files and populate them in select
*/

async function fetchGovernorates() {
    try {
        const governorates = await fetchData("assets/data/governorates.json");
        return governorates[2].data;
    } catch (error) {
        console.error('Error fetching governorates:', error);
        return [];
    }
}


async function populateGovernorates() {
    const governoratesSelect = document.getElementById("governorate");
    try {
        const governorates = await fetchGovernorates();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a governorate";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        governoratesSelect.appendChild(defaultOption);

        
        governorates.forEach(governorate => {
            const option = document.createElement("option");
            option.textContent = governorate.governorate_name_en;
            option.value = governorate.governorate_name_en;
            option.setAttribute("data-governorateid", governorate.id); 
            governoratesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating governorates:', error);
    }
}


let cities = [];
async function fetchCities() {
    try {
        const data = await fetchData("assets/data/cities.json");
        cities =  data[2].data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
}


async function populateCities(governorateId) {
    const filteredCities = cities.filter(city => city.governorate_id === governorateId);

    const citiesSelect = document.getElementById("city");
    
    citiesSelect.innerHTML = "";
    try {
        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a city";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        citiesSelect.appendChild(defaultOption);

        
        filteredCities.forEach(city => {
            const option = document.createElement("option");
            option.textContent = city.city_name_en;
            option.value = city.city_name_en;
            option.setAttribute("data-cityid", city.id); 
            citiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating cities:', error);
    }
}


const governorateSelect = document.getElementById("governorate");
governorateSelect.addEventListener("change", function() {
    const selectedOption = governorateSelect.options[governorateSelect.selectedIndex];
    const governorateId = selectedOption.getAttribute("data-governorateid");
    populateCities(governorateId);
});


populateGovernorates();
fetchCities();

/* 
  Function to fetch faculties and programs from json files and populate them in select
*/


async function fetchFaculties() {
    try {
        const faculties = await fetchData("assets/data/faculties.json");
        return faculties[2].data;
    } catch (error) {
        console.error('Error fetching faculties:', error);
        return [];
    }
}


async function populateFaculties() {
    const facultiesSelect = document.getElementById("faculty");
    try {
        const faculties = await fetchFaculties();

        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a faculty";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        facultiesSelect.appendChild(defaultOption);

        
        faculties.forEach(faculty => {
            const option = document.createElement("option");
            option.textContent = faculty.faculty_name_en;
            option.value = faculty.faculty_name_en;
            option.setAttribute("data-facultyid", faculty.id); 
            facultiesSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating faculties:', error);
    }
}


let programs = [];
async function fetchPrograms() {
    try {
        const data = await fetchData("assets/data/programs.json");
        programs =  data[2].data;
    } catch (error) {
        console.error('Error fetching programs:', error);
        return [];
    }
}


async function populatePrograms(facultyId) {
    const filteredPrograms = programs.filter(program => program.faculty_id == facultyId);

    const programsSelect = document.getElementById("program");
    
    programsSelect.innerHTML = "";
    try {
        
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a program";
        defaultOption.value = ""; 
        defaultOption.disabled = true; 
        defaultOption.selected = true; 
        programsSelect.appendChild(defaultOption);

        
        filteredPrograms.forEach(program => {
            const option = document.createElement("option");
            option.textContent = program.program_name_en;
            option.value = program.program_name_en;
            option.setAttribute("data-programid", program.id); 
            programsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating programs:', error);
    }
}


const facultySelect = document.getElementById("faculty");
facultySelect.addEventListener("change", function() {
    const selectedOption = facultySelect.options[facultySelect.selectedIndex];
    const facultyId = selectedOption.getAttribute("data-facultyid");
    populatePrograms(facultyId);
});


populateFaculties();
fetchPrograms();

/* 
  Function to show and hide input of cgpa or certification  type & score depending on level selection
*/

var levelSelect = document.querySelector('select[name="level"]');
var cgpaContainer = document.getElementById('cgpaContainer');
var certContainer = document.getElementById('certContainer');
var cgpaInput = document.querySelector('input[name="cgpa"]');
var certTypeSelect = document.querySelector('select[name="certificate"]');
var scoreInput = document.querySelector('input[name="certificateScore"]');

function toggleInputs() {
    if (levelSelect.value === "0") {
        cgpaContainer.style.display = "none";
        cgpaInput.value = ""; 
        certContainer.style.display = "block";
    } else {
        cgpaContainer.style.display = "block";
        certContainer.style.display = "none";
        certTypeSelect.value = ""; 
        scoreInput.value = ""; 
    }
}

// Initially hide both inputs
cgpaContainer.style.display = "none";
certContainer.style.display = "none";


levelSelect.addEventListener("change", toggleInputs);

/* 
  Function to handle file upload 
*/

const dropZone = document.getElementById('drop-zone-invoice');
const fileInput = document.getElementById('invoice_file');
const fileList = dropZone.querySelector('.file-list');

fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    fileList.innerHTML = '';
    Array.from(files).forEach(file => {
        const listItem = document.createElement('div');
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    });
});

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    const files = event.dataTransfer.files;
    fileInput.files = files;
    Array.from(files).forEach(file => {
        const listItem = document.createElement('div');
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    });
});

/* 
  Function to ignore regular form submit and submit data use api (postData function)
*/


function resetForm(event) {
    event.preventDefault(); 
    document.querySelector("form").reset(); 
}

async function gatherFormData() {
    const form = document.getElementById('formnew');
    console.log(form.data);
    const formData = new FormData(form);
    
    // Handle file inputs separately
    const fileInput = document.getElementById('invoice_file');
    const files = fileInput.files;
    if (files.length > 0) {
        formData.append('invoice_file', files[0]); // Assuming you only have one file input
    }

    // Log the FormData object to the console
    console.log("Form Data:", formData);
    
    return formData;
}





async function sendFormData(formData) {
    const form = document.querySelector('formnew');
    return await postData(form.action,formData)
}

function displayResponseMessage(responseType, rejectDetails) {
    const error = "Sorry Service unavailable "
    const successMessage = "Thank you for your submission!";
    const rejectMessage = "We are sorry!";
    const rejectMessageWithDetails = `We are sorry! ${rejectDetails}`;

    const responseMessage = document.getElementById("response-message");
    if (responseType === "reject") {
        responseMessage.textContent = rejectDetails ? rejectMessageWithDetails : rejectMessage;
    } else if (responseType == true) {
        responseMessage.textContent = successMessage;
    }else{
        responseMessage.textContent = error;

    }

    const formContainer = document.getElementById('form');
    const responseContainer = document.getElementById("response-container");

    formContainer.style.display = 'none'; 
    responseContainer.style.display = 'block'; 
}


async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Process the retrieved JSON data here
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors gracefully here
        return null;
    }
}


async function submitForm(event) {
    event.preventDefault(); 
    
    const form = document.querySelector('form'); 
    
    try {
        if (form.checkValidity()) {
            const formData = new FormData(form); 
            const response = await fetch(form.action, { 
                method: form.method,
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Form submission failed');
            }
            
            const responseData = await response.json();
            displayResponseMessage(responseData.success);
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.style.display = "block";
        }
    } catch (error) {
        // Handle other errors, such as network issues
        console.error('Error submitting form:', error);
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

