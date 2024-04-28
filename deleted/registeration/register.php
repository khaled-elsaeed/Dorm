
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registeration</title>
      <link rel="stylesheet" href="assets/css/register.css">
   </head>
   <body>
      <!-- Logo container -->
      <div class="logo-container">
         <!-- Logo -->
         <img src="assets/images/logo.png" alt="Logo" class="logo">
      </div>
      <div class="mx-auto container">
         <!-- Progress Form -->
         <form id="progress-form" class="p-4 progress-form" method="post" enctype="multipart/form-data" action="../../handlers/index.php?action=createmember" lang="en" novalidate>
            <!-- Step Navigation -->
            <div class="d-flex align-items-start mb-3 sm:mb-5 progress-form__tabs" role="tablist">
               <button id="progress-form__tab-1" class="flex-1 px-0 pt-2 progress-form__tabs-item " type="button" role="tab" aria-controls="progress-form__panel-1" aria-selected="true">
                  <span class="d-block step" aria-hidden="true">Step 1 <span class="sm:d-none">of 6</span></span>
                  Personal Details
               </button>
               <button id="progress-form__tab-2" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-2" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 2 <span class="sm:d-none">of 6</span></span>
                  Contact <br> Details
               </button>
               <button id="progress-form__tab-3" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-3" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 3 <span class="sm:d-none">of 6</span></span>
                  Address <br> Details
               </button>
               <button id="progress-form__tab-4" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-4" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 4 <span class="sm:d-none">of 6</span></span>
                  Faculty <br> Details
               </button>
               <button id="progress-form__tab-5" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-5" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 5 <span class="sm:d-none">of 6</span></span>
                  Parental <br> Details
               </button>
               <button id="progress-form__tab-6" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-6" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 6 <span class="sm:d-none">of 6</span></span>
                  Additional <br> Details
               </button>
               <button id="progress-form__tab-7" class="flex-1 px-0 pt-2 progress-form__tabs-item" type="button" role="tab" aria-controls="progress-form__panel-7" aria-selected="false" tabindex="-1" aria-disabled="true">
                  <span class="d-block step" aria-hidden="true">Step 7 <span class="sm:d-none">of 7</span></span>
                  Invoice <br> Details
               </button>
            </div>

            <!-- / End Step Navigation -->
            <!-- Step 1 -->
            <section id="progress-form__panel-1" role="tabpanel" aria-labelledby="progress-form__tab-1" tabindex="0">
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="firstName">
                     First name
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input id="firstName" type="text" name="firstName" autocomplete="given-name" placeholder="First Name..." required >
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="middleName">
                     Middle name
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Middle Name..." id="middleName" type="text" name="middleName" autocomplete="given-name" required >
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="lastName">
                     Last name
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Last Name..." id="lastName" type="text" name="lastName" autocomplete="family-name"  required>
                  </div>
               </div>

               <div class="sm:d-grid sm:grid-col-3 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="birthDate">
                     Date of Birth
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input id="birthDate" type="date" name="birthDate" required>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="nationality">
                     Nationality
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="nationality" name="nationality" autocomplete="shipping address-level1" required >
                        <option value="" disabled selected>Please select</option>
                        <option value="ind">Indian</option>
                     </select>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="governmentId">
                     Government-issued ID
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Government-Issued ID..." id="governmentId" type="text" name="governmentId" data-type="governorateid" required>
                  </div>
               </div>
               <fieldset id="genderSelection" class="mt-3 form__field">
                  <legend>
                     Please select your gender:
                  </legend>
                  <label class="form__choice-wrapper">
                  <input type="radio" name="gender" value="male" required>
                  <span>Male</span>
                  </label>
                  <label class="form__choice-wrapper">
                  <input type="radio" name="gender" value="female">
                  <span>Female</span>
                  </label>
               </fieldset>
               <div class="d-flex align-items-center justify-center sm:justify-end ">
                  <button type="button" class="custom-button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <!-- / End Step 1 -->
            <!-- Step 2-->
            <section id="progress-form__panel-2" role="tabpanel" aria-labelledby="progress-form__tab-2" tabindex="0" hidden>
               <div class="mt-3 form__field">
                  <label for="emailAddress">
                  Email address
                  <span data-required="true" aria-hidden="true"></span>
                  </label>
                  <input placeholder="Email Address..." id="emailAddress" type="email" name="emailAddress" autocomplete="email"  required>
               </div>
               <div class="mt-3 form__field">
                  <label for="phoneNumber">
                  Phone number
                  </label>
                  <input placeholder=" Mobile Number..." id="phoneNumber" type="tel" name="phoneNumber" autocomplete="tel" required>
               </div>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end mt-2">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <!-- / End Step 2 -->
            <!-- Step 3 -->
            <section id="progress-form__panel-3" role="tabpanel" aria-labelledby="progress-form__tab-3" tabindex="0" hidden>
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="addressGovernorate">
                     Governorate
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="addressGovernorate" name="addressGovernorate" autocomplete="governorate" required ></select>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="addressCity">
                     City
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="addressCity" name="addressCity" required></select>
                  </div>
               </div>
               <div class="mt-3 form__field">
                  <label for="address">
                  Address
                  <span data-required="true" aria-hidden="true"></span>
                  </label>
                  <input placeholder="Address Details..." id="address" type="text" name="address" autocomplete="shipping address-line1" required>
               </div>
               <div class="mt-3 form__field">
                  <label for="addressAdditional">
                  Apartment or suite (optional)
                  </label>
                  <input placeholder="Additional Address..." id="addressAdditional" type="text" name="addressAdditional" autocomplete="shipping address-line2">
               </div>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end mt-2">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <!-- / End Step 3 -->
            <!-- Step 4 -->
            <section id="progress-form__panel-4" role="tabpanel" aria-labelledby="progress-form__tab-4" tabindex="0" hidden>
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="studentId">
                     Student ID number
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Student Id..." id="studentId" type="text" name="studentId"  required >
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="faculty">
                     Faculty
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="faculty" name="faculty" required>
                     </select>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="program">
                     Program
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="program" name="program" required>
                     </select>
                  </div>
               </div>
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="yearOfStudy">
                     Year of study
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="yearOfStudy" name="yearOfStudy"  required>
                        <option value="" disabled selected>Please select</option>
                        <option value="0">1st Year - Newcomer</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">4th Year</option>
                     </select>
                  </div>
               </div>
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3" id="certificationTypeSection" style="display: none;">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="certificationType">
                     Certification Type
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <select id="certificationType" name="certificationType">
                        <option value="" disabled selected>Please select</option>
                        <option value="A">Egyptian Secondary Education Certificate (Thanaweya Amma)</option>
                        <option value="B">Secondary Education Equivalency Certificate</option>
                     </select>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field mt-2">
                     <label for="certificationScore">
                     Certificate Result
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="certificationScore" id="certificationScore" type="text" name="certificationScore" >
                  </div>
               </div>
               <div class="sm:d-grid sm:grid-col-3 sm:mt-3" id="gpaSection" style="display: none;">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="cgpa">
                     cgpa
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="cgpa" id="cgpa" type="text" name="cgpa">
                  </div>
               </div>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end mt-2">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <!-- / End Step 4 -->
            <!-- Step 5 -->
            <section id="progress-form__panel-5" role="tabpanel" aria-labelledby="progress-form__tab-5" tabindex="0" hidden>
               <div class="sm:d-grid sm:grid-col-2 sm:mt-3">
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="parentFirstName">
                     First name
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Parent First Name..." id="parentFirstName" type="text" name="parentFirstName"  required>
                  </div>
                  <div class="mt-3 sm:mt-0 form__field">
                     <label for="parentLastName">
                     Last name
                     <span data-required="true" aria-hidden="true"></span>
                     </label>
                     <input placeholder="Parent Last Name..." id="parentLastName" type="text" name="parentLastName" required>
                  </div>
               </div>
               <div class="mt-3 form__field">
                  <label for="parentPhoneNumber">
                  Phone number
                  </label>
                  <input placeholder="Parent Phone Number..." id="parentPhoneNumber" type="tel" name="parentPhoneNumber" required>
               </div>
               <fieldset id="parentLocation-selection" class="mt-3 form__field">
                  <legend>
                     Parents Location:
                  </legend>
                  <label class="form__choice-wrapper">
                  <input type="radio" name="parentLocation" value="local" required>
                  <span>Local</span>
                  </label>
                  <label class="form__choice-wrapper">
                  <input type="radio" name="parentLocation" value="abroad">
                  <span>Abroad</span>
                  </label>
               </fieldset>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end ">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <!-- / End Step 5 -->
            <!-- Step 6 -->
            <section id="progress-form__panel-6" role="tabpanel" aria-labelledby="progress-form__tab-6" tabindex="0" hidden>
               <div class="mt-3 form__field">
                  <label for="hasSiblings">
                  Do you have any Siblings (sister or brother) in our dorm?
                  <span data-required="true" aria-hidden="true"></span>
                  </label>
                  <select id="hasSiblings" name="hasSiblings" required>
                     <option value="" disabled selected>Please select</option>
                     <option value="yes">Yes</option>
                     <option value="no">No</option>
                  </select>
               </div>
               <div class="mt-3 form__field">
                  <label for="oldResident">
                  Have you lived in NMU dorms before?
                  <span data-required="true" aria-hidden="true"></span>
                  </label>
                  <select id="oldResident" name="oldResident" required >
                     <option value="" disabled selected>Please select</option>
                     <option value="yes">Yes</option>
                     <option value="no">No</option>
                  </select>
               </div>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end mt-2">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="button" data-action="next">
                  Continue
                  </button>
               </div>
            </section>
            <section id="progress-form__panel-7" role="tabpanel" aria-labelledby="progress-form__tab-7" tabindex="0" hidden>
               <div class="mt-3 form__field">
                  <label for="invoice" class="drop-container" id="dropcontainer">
                  Please upload Invoice
                  <span data-required="true" aria-hidden="true"></span>
                  <span class="drop-title">Drop files here</span>
                  or
                  <input type="file" name="invoice" accept="image/*" required>
                  </label>
               </div>
               <div class="d-flex flex-column-reverse sm:flex-row align-items-center justify-center sm:justify-end ">
                  <button type="button" class="mt-1 sm:mt-0 button--simple" data-action="prev">
                  Back
                  </button>
                  <button type="submit">
                  Submit
                  </button>
               </div>
            </section>
            <!-- / End Step 6 -->
            <!-- Thank You -->
            <section id="progress-form__thank-you" hidden>
            <div class="thank-you-container" style="display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center;">
               <h2 style="margin: 0; font-size: 24px; color: #333333;">Application Received</h2>
               <p style="margin: 10px 0; font-size: 16px; color: #555555; line-height: 1.5;">Thank you for submitting your application for residency in the university dormitory.</p>
               <p style="margin: 10px 0; font-size: 16px; color: #555555; line-height: 1.5;">Our team will review your application shortly. If you have any questions or need further assistance, please feel free to contact us at <span style="color: #95171b;">[contact email/phone number]</span>.</p>
               <a href="../index.html" style="display: inline-block; background-color: #95171b; color: #ffffff; border: 2px solid #95171b; padding: 12px 24px; border-radius: 25px; cursor: pointer; text-decoration: none; font-size: 16px; margin-top: 20px; transition: transform 0.3s;">Return to Site</a>
            </div>

               <div class="reject-container" hidden>
                  <h2>We are Sorry!</h2>
                  <p>Your application for residency in the university dormitory has been reject.</p>
                  <p id="rejectDescrition"></p>
               </div>
            </section>
            <!-- / End Thank You -->
         </form>
         <!-- / End Progress Form -->
      </div>
      <script src="assets/js/register.js"></script>
   </body>
</html>