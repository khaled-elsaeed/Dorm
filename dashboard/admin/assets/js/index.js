async function getOccupiedResidentsCount() {
    try {
        const data = await fetchOccupiedResidentsCountFromDB();
        updateOccupiedResidentsCountView(data.residentCount);
    } catch (error) {
        console.error("Error in getOccupiedResidentsCount:", error);
        throw new Error("Failed to fetch resident count data");
    }
}

async function fetchOccupiedResidentsCountFromDB() {
    const url = "../../handlers/?action=fetchOccupiedResidentsCount";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchOccupiedResidentsCountFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}

async function updateOccupiedResidentsCountView(residentsCount){
    const totalResidents = document.getElementById('totalResidents');
    totalResidents.innerText = residentsCount;
}

async function getRoomOccupancyRate() {
    try {
        const data = await fetchRoomOccupancyRateFromDB();
        updateRoomOccupancyRateView(data);
    } catch (error) {
        console.error("Error in getRoomOccupancyRate:", error);
        throw new Error("Failed to fetch room occupancy rate data");
    }
}

async function fetchRoomOccupancyRateFromDB() {
    const url = "../../handlers/?action=fetchRoomOccupancyRate";
    try {
        const response = await fetchData(url);
        const data = response.data
        return data;
    } catch (error) {
        console.error("Error in fetchRoomOccupancyRateFromDB:", error);
        throw new Error("Failed to fetch room occupancy rate data from database");
    }
}

async function updateRoomOccupancyRateView(occupancyRate){
    const roomOccupancyRate = document.getElementById('roomOccupancyRate');
    roomOccupancyRate.innerText = occupancyRate + "%";
}

async function getMaintenanceRequestsCount() {
    try {
        const data = await fetchMaintenanceRequestsCountFromDB();
        updateMaintenanceRequestsCountView(data.PendingMaintenance,data.inProgressMaintenance);
    } catch (error) {
        console.error("Error in getMaintenanceRequestsCount:", error);
        throw new Error("Failed to fetch maintenance requests data");
    }
}

async function fetchMaintenanceRequestsCountFromDB() {
    const url = "../../handlers/?action=fetchMaintenanceRequestsCount";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchMaintenanceRequestsCountFromDB:", error);
        throw new Error("Failed to fetch maintenance requests data from database");
    }
}

async function updateMaintenanceRequestsCountView(totalPendingRequestsCount,totalInProgressRequestsCount){

    const PendingMaintenance = document.getElementById('PendingMaintenance');
    PendingMaintenance.innerText = totalPendingRequestsCount;
    const inProgressMaintenance = document.getElementById('inProgressMaintenance');
    inProgressMaintenance.innerText = totalInProgressRequestsCount;

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
        throw new Error("Failed to fetch data");
    }
}

const xValues = [100,200,300,400,500,600,700,800,900,1000];





document.addEventListener('DOMContentLoaded', function () {
    getOccupiedResidentsCount();
    getRoomOccupancyRate();
    getMaintenanceRequestsCount();
    new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
            borderColor: "red",
            fill: false
          },{
            data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
            borderColor: "green",
            fill: false
          },{
            data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
            borderColor: "blue",
            fill: false
          }]
        },
        options: {
          legend: {display: false}
        }
      });
});
