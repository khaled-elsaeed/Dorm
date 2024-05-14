<?php 
   require_once('../../includes/functions.php');
   
   session_start();
   if (!is_logged_in()) {
       redirect("../../Site/authenication/login.php");
   }
   
   $userId = $_SESSION['userId'];
   ?>
<!DOCTYPE html>
<html lang="en">
   <head>
      <title>Home - Resident</title>
      <!-- Meta -->
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Portal - Bootstrap 5 Admin Dashboard Template For Developers">
      <meta name="author" content="Xiaoying Riley at 3rd Wave Media">
      <link rel="shortcut icon" href="assets/images/icons/nmudorm.ico">
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <!-- FontAwesome JS-->
      <script defer src="assets/plugins/fontawesome/js/all.min.js"></script>
      <!-- App CSS -->
      <link id="theme-style" rel="stylesheet" href="assets/css/portal.css">
   </head>
   <body class="app">
      <header class="app-header fixed-top">
         <div class="app-header-inner">
            <div class="container-fluid py-2">
               <div class="app-header-content">
                  <div class="row justify-content-between align-items-center">
                     <div class="col-auto">
                        <a id="sidepanel-toggler" class="sidepanel-toggler d-inline-block d-xl-none" href="#">
                           <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img">
                              <title>Menu</title>
                              <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"></path>
                           </svg>
                        </a>
                     </div>
                     <!--//col-->
                     
                     <div class="app-utilities col-auto">
                        
                        <!--//app-utility-item-->
                        <!-- <div class="app-utility-item">
                           <a href="pages/settings/settings.php" title="Settings">
                              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fill-rule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z" />
                                 <path fill-rule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z" />
                              </svg>
                           </a>
                        </div> -->
                        <!--//app-utility-item-->
                        <div class="app-utility-item app-user-dropdown dropdown">
                           <a class="dropdown-toggle" id="user-dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false"><img src="assets/images/user.png" alt="user profile"></a>
                           <ul class="dropdown-menu" aria-labelledby="user-dropdown-toggle">
                              <li class="dropdown-item"><?php echo $_SESSION['username']; ?></li>
                              <li><a class="dropdown-item" href="account.html">Account</a></li>
                              <!-- <li><a class="dropdown-item" href="pages/settings/settings.php">Settings</a></li> -->
                              <li>
                                 <hr class="dropdown-divider">
                              </li>
                              <li><a class="dropdown-item" href="../../Site/authenication/login.php">Log Out</a></li>
                           </ul>
                        </div>
                        <!--//app-user-dropdown-->
                     </div>
                     <!--//app-utilities-->
                  </div>
                  <!--//row-->
               </div>
               <!--//app-header-content-->
            </div>
            <!--//container-fluid-->
         </div>
         <!--//app-header-inner-->
         <div id="app-sidepanel" class="app-sidepanel">
            <div id="sidepanel-drop" class="sidepanel-drop"></div>
            <div class="sidepanel-inner d-flex flex-column">
               <a href="#" id="sidepanel-close" class="sidepanel-close d-xl-none">&times;</a>
               <div class="app-branding">
               <div class="app-logo"><img class="logo-icon me-2" src="assets/images/logo.png" alt="logo"><span class="logo-text">Dashboard</span></div>
               </div>
               <!--//app-branding-->
               <nav id="app-nav-main" class="app-nav app-nav-main flex-grow-1">
                  <ul class="app-menu list-unstyled accordion" id="menu-accordion">
                     <li class="nav-item">
                        <!--//Bootstrap Icons: https://icons.getbootstrap.com/ -->
                        <a class="nav-link active" href="index.php">
                           <span class="nav-icon">
                              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-house-door" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                 <path fill-rule="evenodd" d="M7.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 .146.354v7a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-4H7v4a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .146-.354l6-6zM2.5 7.707V14H6v-4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4h3.5V7.707L8 2.207l-5.5 5.5z" />
                                 <path fill-rule="evenodd" d="M13 2.5V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                              </svg>
                           </span>
                           <span class="nav-link-text">Home</span>
                        </a>
                        <!--//nav-link-->
                     </li>
                     <!--//nav-item-->
                     <li class="nav-item">
                        <a class="nav-link" href="pages/maintenance/maintenance.html">
                        <span class="nav-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
  <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
</svg>                        </span>
                        <span class="nav-link-text">Maintenance</span>
                        </a><!--//nav-link-->
                     </li>
                     <!--//nav-item-->
                     
                  </ul>
                  <!--//app-menu-->
               </nav>
            </div>
            <!--//sidepanel-inner-->
         </div>
         <!--//app-sidepanel-->
      </header>
      <!--//app-header-->
      <div class="app-wrapper">
         <div class="app-content pt-3 p-md-3 p-lg-4">

            <div class="row g-4 mb-4">
			        <div class="col-12 col-lg-6">
				        <div class="app-card app-card-chart h-100 shadow-sm">
					        <div class="app-card-header p-3">
						        <div class="row justify-content-between align-items-center">
							        <div class="col-auto">
						                <h4 class="app-card-title">Maintenance Requests</h4>
							        </div><!--//col-->
						        </div><!--//row-->
					        </div><!--//app-card-header-->
					        <div class="app-card-body p-3 p-lg-4">
							    <div class="mb-3 d-flex">   
							        <select class="form-select form-select-sm ms-auto d-inline-flex w-auto">
									    <option value="1" selected>This week</option>
									    <option value="2">Today</option>
									    <option value="3">This Month</option>
									    <option value="3">This Year</option>
									</select>
							    </div>
						        <div class="chart-container">
				                    <canvas id="canvas-linechart" ></canvas>
						        </div>
					        </div><!--//app-card-body-->
				        </div><!--//app-card-->
			        </div><!--//col-->
			        <div class="col-12 col-lg-6">
				        <div class="app-card app-card-chart h-100 shadow-sm">
					        <div class="app-card-header p-3">
						        <div class="row justify-content-between align-items-center">
							        <div class="col-auto">
						                <h4 class="app-card-title">Attendance</h4>
							        </div><!--//col-->
						        </div><!--//row-->
					        </div><!--//app-card-header-->
					        <div class="app-card-body p-3 p-lg-4">
							    <div class="mb-3 d-flex">   
							        <select class="form-select form-select-sm ms-auto d-inline-flex w-auto">
									    <option value="1" selected>This week</option>
									    <option value="2">Today</option>
									    <option value="3">This Month</option>
									    <option value="3">This Year</option>
									</select>
							    </div>
						        <div class="chart-container">
				                    <canvas id="canvas-barchart" ></canvas>
						        </div>
					        </div><!--//app-card-body-->
				        </div><!--//app-card-->
			        </div><!--//col-->
			        
			   </div>
            
         <!--//container-fluid-->
      </div>
      <!--//app-content-->
      <footer class="app-footer">
         <div class="container text-center py-3">
         </div>
      </footer>
      <!--//app-footer-->
      </div><!--//app-wrapper-->
      <!-- Javascript -->
      <script src="assets/plugins/popper.min.js"></script>
      <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>

      <!-- Page Specific JS -->
      <script src="assets/js/app.js"></script>
      <script src="assets/js/index.js"></script>
      <script>
        // Get the filename of the current URL
        var currentPage = window.location.href.split('/').pop();

        // Define a mapping of filenames to corresponding display texts
        var pageTextMap = {
            'index.html': 'Dashboard',
            'maintenance.html': 'Maintenance',
            'building.html': 'Building',
            'apartment.html': 'Apartment',
            'room.html': 'Room',
            'criteria.html': 'Criteria',
            'reservation.html': 'Reservation',
            'notifications.html': 'Notification'
            // Add more mappings as needed
        };

        // Get the text corresponding to the current page from the mapping
        var activePageText = pageTextMap[currentPage];

        // If the text is found, update the text beside the logo
        if (activePageText) {
            document.getElementById('active-page-text').textContent = activePageText;
        }
    // Chart 1 data (Maintenance Requests Per Day)
    var chart1Data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Maintenance Requests',
            data: [12, 15, 10, 18, 14, 20, 16],
            backgroundColor: '#6B1207',
            borderColor: '#6B1207',
            borderWidth: 1
        }]
    };

    var attendanceData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [{
        type: 'bar',
        label: 'Attendance (%)',
        data: [100, 90, 88, 50, 150],
        backgroundColor: '#6B1207',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }, {
        type: 'line',
        label: 'Average Attendance (%)',
        data: [87, 88, 90, 89, 86],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 0
    }]
};



    // Initialize Chart 1 (Maintenance Requests Per Day)
    var ctx1 = document.getElementById('canvas-linechart').getContext('2d');
    var myChart1 = new Chart(ctx1, {
        type: 'line',
        data: chart1Data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Initialize Chart 2 (Example)
    var ctx = document.getElementById('canvas-barchart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: attendanceData,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Attendance (%)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Days of the Week'
                }
            }
        }
    }
});


      </script>
   </body>
</html>