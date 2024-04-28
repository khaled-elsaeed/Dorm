async function postData(url = '', data = {}) {
    try {
       const response = await fetch(url, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
       });
 
       if (!response.ok) {
          let errorMessage = await response.text();
          if (errorMessage) {
             throw new Error(errorMessage);
          } else {
             throw new Error('An error occurred. Please try again later.');
          }
       }
 
       return response.json();
    } catch (error) {
       console.error('Error in postData:', error);
       throw new Error('Failed to fetch data');
    }
 }
 
 async function handleFormSubmit(event) {
    event.preventDefault();
 
    const form = event.target;
    const errorMessageBox = document.querySelector('.message-box.error');
 
    try {
       const formData = new FormData(form);
       const selectedRole = document.querySelector('input[name="role"]:checked').value;
       const formDataObject = {};    // Construct JSON object containing form data, CSRF token, and role
       formData.forEach((value, key) => {
          formDataObject[key] = value;
       });
       formDataObject['csrfToken'] = document.querySelector('input[name="csrfToken"]').value;
       formDataObject['role'] = selectedRole;
 
       const response = await postData(form.action, formDataObject);
 
       if (response.success === true) {
          window.location.href = '../../dashboard/admin/';
       } else {
            console.log(response);
          errorMessageBox.textContent = response.error || 'An error occurred. Please try again later.';
          errorMessageBox.style.display = 'block';
       }
    } catch (error) {
       console.error('Error in form submission:', error);
       errorMessageBox.textContent = 'An error occurred. Please try again later.';
       errorMessageBox.style.display = 'block';
    }
 }
 
 // Function to update form action based on selected role member or admin
 function updateFormAction() {
    const selectedRole = document.querySelector('input[name="role"]:checked').value;
    const form = document.querySelector('.login-form');
 
    if (selectedRole === 'member') {
       form.action = '../../handlers/index.php?action=memberAuth';
    } else if (selectedRole === 'admin') {
       form.action = '../../handlers/index.php?action=adminAuth';
    }
 }
 
 // Event listeners to role radio buttons
 function attachRoleRadioListeners() {
    const roleRadios = document.querySelectorAll('input[name="role"]');
    roleRadios.forEach(radio => {
       radio.addEventListener('change', updateFormAction);
    });
 }
 
 function initializeForm() {
    updateFormAction();
    attachRoleRadioListeners();
 }
 
 
 document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
 });