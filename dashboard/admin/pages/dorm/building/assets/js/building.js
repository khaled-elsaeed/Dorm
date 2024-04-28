var buildings = [];

function openModal() {
   $('#addBuildingModal').modal('show');
}

$("#addBuildingModal").submit(function (event) {
   event.preventDefault();
   const buildingData = {
      buildingNumber: $("#buildingNumber").val(),
      buildingGender: $("#buildingGender").val()
   };
   addBuilding(buildingData);
   closeModal();
});

function showConfirmationModal(message, callback) {
   try {
      document.getElementById('confirmationMessage').textContent = message;

      $('#confirmationModal').modal('show');

      document.getElementById('confirmBtn').addEventListener('click', function () {
         $('#confirmationModal').modal('hide'); // Hide the modal
         callback(true); // Call the callback function with true as argument
      });

      document.getElementById('cancelBtn').addEventListener('click', function () {
         $('#confirmationModal').modal('hide'); // Hide the modal
         callback(false); // Call the callback function with false as argument
      });
   } catch (error) {
      console.error("An error occurred:", error);
      callback(false);
   }
}


function closeModal() {
   $('#addBuildingModal').modal('hide');
}

function resetModal() {
   document.getElementById('addBuildingModal').querySelector('form').reset();
}

function openMessageModal(message) {
   document.getElementById("modal-message").innerHTML = message;
   $('#messageModal').modal('show'); // Show the modal
}

document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);


async function fetchBuilding() {
   try {
      const data = await fetchBuildingDB();
      await fetchBuildingDS(data);
   } catch (error) {
      console.error("Error in fetchBuilding:", error);
      const message = ("Failed to fetch building data");
      openMessageModal(message);

   }
}

async function fetchBuildingDB() {
   const url = "../../../../../handlers/?action=fetchBuildings";
   try {
      const data = await getData(url);
      return data;
   } catch (error) {
      console.error("Error in fetchBuildingDB:", error);
      const message = ("Failed to fetch building data from database");
      openMessageModal(message);

   }
}

async function fetchBuildingDS(data) {
   try {
      buildings = data.data;
      populateTable(buildings);
   } catch (error) {
      console.error("Error in fetchBuildingDS:", error);
      const message = ("Failed to populate table");
      openMessageModal(message);
   }
}

async function removeBuilding(buildingId) {
   try {
       const dbResponse = await removeBuildingDB(buildingId)
       if (dbResponse.success) {
         removeBuildingDS(buildingId);
         populateTable(buildings);
       } else {
           console.error("Error: Deletion from database unsuccessful");
       }
   } catch (error) {
       console.error("Error in removeRoom:", error);
       throw new Error("Failed to remove room");
   }
}

async function removeBuildingDS(buildingId) {
   const index = buildings.findIndex(building => building.buildingId === buildingId);
   if (index !== -1) {
      buildings.splice(index, 1);
   } else {
      console.error("Building with ID", buildingId, "not found");
   }
}

async function removeBuildingDB(buildingId) {
   const url = "../../../../../handlers/?action=removeBuilding";
   const data = {
      buildingId
   };
   try {
      const responseData = await postData(url, data);
      return responseData;
   } catch (error) {
      console.error("Error in removeBuildingDB:", error);
      const message = ("Failed to remove building from the database");
      openMessageModal(message);

   }
}

async function addBuilding(buildingData) {
    try {
        const isDuplicate = buildings.some(building => building.buildingNumber === buildingData.buildingNumber);
        if (isDuplicate) {
            console.error("Error: Building with the same building number already exists");
            const message = "A building with the same building number already exists.";
            openMessageModal(message);
            return; 
        }

        const dbResponse = await addBuildingDB(buildingData);
        if (dbResponse.success) {
            await addBuildingDS(buildingData); 
            fetchBuilding();
        } else {
            console.error("Error: Adding building unsuccessful");
        }
    } catch (error) {
        console.error("Error in addBuilding:", error);
        const message = "Failed to add building";
        openMessageModal(message);
    }
}



async function addBuildingDB(buildingData) {
   const url = "../../../../../handlers/?action=addBuilding";
   data = {

   }
   try {
      const responseData = await postData(url, buildingData);
      return responseData;
   } catch (error) {
      console.error("Error in addBuildingDB:", error);
      const message = ("Failed to add building in the database");
      openMessageModal(message);

   }
}

async function addBuildingDS(buildingData) {
   try {

      buildings.push(buildingData);
   } catch (error) {
      console.error("Error in addBuildingDS:", error);
      const message = ("Failed to add building to front-end data structure");
      openMessageModal(message);

   }
}


async function populateTable(buildingsData) {
   var buildingList = document.querySelector("tbody");
   buildingList.innerHTML = ""; 
   buildingsData.forEach(function (building) {
      buildingList.innerHTML += `
            <tr>
                <td>${building.buildingNumber}</td>
                <td>${building.buildingGender}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeBuilding(${building.buildingId})">Delete</button>
                </td>
            </tr>
        `;
   });
}

document.getElementById('search-orders').addEventListener('input', function () {
   const searchQuery = this.value.trim().toLowerCase(); 
   const filterQuery = document.getElementById('genderFilter').value.trim().toLowerCase(); 
   const filteredBuildings = buildings.filter(building => {
      const matchesSearch = building.buildingNumber.toLowerCase().includes(searchQuery);
      const matchesFilter = filterQuery === 'all' || building.buildingGender.toLowerCase() === filterQuery;
      return matchesSearch && matchesFilter;
   });
   populateTable(filteredBuildings);
});


const genderFilter = document.getElementById('genderFilter');
if (genderFilter) {
   genderFilter.addEventListener('change', function () {
      const filterQuery = this.value.trim().toLowerCase(); // Get filter query and convert to lowercase
      const searchQuery = document.getElementById('search-orders').value.trim().toLowerCase(); // Get search query and convert to lowercase
      const filteredBuildings = buildings.filter(building => {
         const matchesSearch = building.buildingNumber.toLowerCase().includes(searchQuery);
         const matchesFilter = filterQuery === 'all' || building.buildingGender.toLowerCase() === filterQuery;
         return matchesSearch && matchesFilter;
      });
      populateTable(filteredBuildings);
   });
} else {
   console.error("Element with ID 'genderFilter' not found.");
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
      const message = ("Failed to fetch data");
      openMessageModal(message);

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
      const message = ("Failed to fetch data");
      openMessageModal(message);

   }
}

document.addEventListener('DOMContentLoaded', function () {
   fetchBuilding();
});