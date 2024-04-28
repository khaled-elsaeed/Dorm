<?php
   require_once('../../includes/functions.php'); 
   start_secure_session();
   $csrfToken = generate_csrfToken();
   $_SESSION['csrfToken'] = $csrfToken;
   
   ?>
<!DOCTYPE html>
<html lang="en">
   <head>
      <title>Log In</title>
      <!-- Meta -->
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- FontAwesome JS-->
      <script defer src="assets/plugins/fontawesome/js/all.min.js"></script>
      <!-- App CSS -->  
      <link id="theme-style" rel="stylesheet" href="assets/css/portal.css">
      <link rel="stylesheet" href="assets/css/login.css">
   </head>
   <body class="app app-login p-0">
      <div class="row g-0 app-auth-wrapper">
         <div class="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
            <div class="d-flex flex-column align-content-end">
               <div class="app-auth-body mx-auto">
                  <div class="app-auth-branding mb-4">
                     <img class="logo-icon me-2" src="assets/img/login_page/logo.png" alt="logo">
                  </div>
                  <h2 class="auth-heading text-center mb-5">Log in to Portal</h2>
                  <div class="auth-form-container text-start">
                     <form class="auth-form login-form" action="" method="POST">
                        <input type="hidden" name="csrfToken" value="<?php echo htmlspecialchars($csrfToken); ?>">
                        <div class="email mb-3">
                           <label class="sr-only" for="signin-email">Email</label>
                           <input id="signin-email" name="signin-email" type="email" class="form-control signin-email" placeholder="Email address" required="required">
                        </div>
                        <!--//form-group-->
                        <div class="password mb-3">
                           <label class="sr-only" for="signin-password">Password</label>
                           <input id="signin-password" name="signin-password" type="password" class="form-control signin-password" placeholder="Password" required="required">
                        </div>
                        <!--//form-group-->
                        <div class="radio-buttons">
                           <label class="custom-radio">
                              <input type="radio" name="role" value="member" checked>
                              <span class="radio-btn">
                                 <span class="checkmark">✓</span>
                                 <div class="hobbies-icon">
                                <img src="assets/image/icon/student.svg" alt="student">
                                    <h3 class="">Member</h3>
                                 </div>
                              </span>
                           </label>
                           <label class="custom-radio">
                              <input type="radio" name="role" value="admin" >
                              <span class="radio-btn">
                                 <span class="checkmark">✓</span>
                                 <div class="hobbies-icon">
                                 <img src="assets/image/icon/student.svg" alt="member">
                                    <h3 class="">Admin</h3>
                                 </div>
                              </span>
                           </label>
                        </div>
                        <div class="message-box error">
                        </div>
                        <?php 
                           // Check if a message is present in the URL query parameters
                           if (isset($_GET['message'])) {
                               $message = $_GET['message'];
                               echo "<div class='message'>$message</div>";
                           }
                           ?>
                        <div class="extra mt-3 row justify-content-between">
                           <div class="col-6">
                              <div class="form-check">
                                 <input class="form-check-input" type="checkbox" value="" id="RememberPassword">
                                 <label class="form-check-label" for="RememberPassword">
                                 Remember me
                                 </label>
                              </div>
                           </div>
                           <!--//col-6-->
                           <div class="col-6">
                              <div class="forgot-password text-end">
                                 <a href="reset-password.php">Forgot password?</a>
                              </div>
                           </div>
                           <!--//col-6-->
                        </div>
                        <!--//extra-->
                        <div class="text-center">
                           <button name="Emp_login_submit" type="submit" class="btn app-btn-primary w-100 theme-btn mx-auto">Log In</button>
                        </div>
                     </form>
                  </div>
                  <!--//auth-form-container-->  
               </div>
               <!--//auth-body-->
            </div>
            <!--//flex-column-->   
         </div>
         <!--//auth-main-col-->
         <div class="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
            <div class="auth-background-holder">
            </div>
            <div class="auth-background-mask"></div>
         </div>
         <!--//auth-background-col-->
      </div>
      <!--//row-->
      <script src="assets/js/login.js"></script>
   </body>
</html>