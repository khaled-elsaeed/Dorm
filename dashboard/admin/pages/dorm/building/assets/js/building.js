var buildings = [];

function openModal() {
   $('#addBuildingModal').modal('show');
}

$("#addBuildingModal").submit(function (event) {
   event.preventDefault();
   const buildingData = {
      buildingNumber: $("#buildingNumber").val(),
      buildingCategory: $("#buildingCategory").val()
   };
   addBuilding(buildingData);
   closeModal();
});


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
       const confirmed = await openConfirmationModal("Are you sure you want to delete this building?");
       if (confirmed) {
           const dbResponse = await removeBuildingDB(buildingId);
           if (dbResponse.success) {
               removeBuildingDS(buildingId);
               populateTable(buildings);
           } else {
               console.error("Error: Deletion from database unsuccessful");
           }
       }
   } catch (error) {
       console.error("Error in removeRoom:", error);
       throw new Error("Failed to remove room");
   }
}

async function removeBuildingDS(buildingId) {
   const index = buildings.findIndex(building => building.id === buildingId);
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

       const confirmed = await openConfirmationModal("Are you sure you want to add this building?");
       if (confirmed) {
           const dbResponse = await addBuildingDB(buildingData);
           if (dbResponse.success) {
               await addBuildingDS(buildingData); 
               fetchBuilding();
           } else {
               console.error("Error: Adding building unsuccessful");
           }
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
                <td>${building.buildingCategory}</td>
                <td>
                    <button class="btn btn-danger" onclick="removeBuilding(${building.id})">Delete</button>
                </td>
            </tr>
        `;
   });
}

document.getElementById('search-orders').addEventListener('input', function () {
   const searchQuery = this.value.trim().toLowerCase(); 
   const filterQuery = document.getElementById('CategoryFilter').value.trim().toLowerCase(); 
   const filteredBuildings = buildings.filter(building => {
      const matchesSearch = building.buildingNumber.toLowerCase().includes(searchQuery);
      const matchesFilter = filterQuery === 'all' || building.buildingCategory.toLowerCase() === filterQuery;
      return matchesSearch && matchesFilter;
   });
   populateTable(filteredBuildings);
});


const CategoryFilter = document.getElementById('CategoryFilter');
if (CategoryFilter) {
   CategoryFilter.addEventListener('change', function () {
      const filterQuery = this.value.trim().toLowerCase(); // Get filter query and convert to lowercase
      const searchQuery = document.getElementById('search-orders').value.trim().toLowerCase(); // Get search query and convert to lowercase
      const filteredBuildings = buildings.filter(building => {
         const matchesSearch = building.buildingNumber.toLowerCase().includes(searchQuery);
         const matchesFilter = filterQuery === 'all' || building.buildingCategory.toLowerCase() === filterQuery;
         return matchesSearch && matchesFilter;
      });
      populateTable(filteredBuildings);
   });
} else {
   console.error("Element with ID 'CategoryFilter' not found.");
}

// Function to download table as CSV
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

// Function to print the table
function printTable() {
   window.print();
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