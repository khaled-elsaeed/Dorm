var invoices = [];

async function getInvoiceRequests() {
    try {
        const data = await fetchInvoiceRequestsFromDB();
        invoices = data;
        populateImageInCards(invoices);

    } catch (error) {
        console.error("Error in getInvoiceRequests:", error);
        throw new Error("Failed to fetch resident count data");
    }
}

async function fetchInvoiceRequestsFromDB() {
    const url = "../../../../handlers/?action=fetchInvoices";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchInvoiceRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}



function populateImageInCards(invoices) {
    console.log(invoices);
    const cardContainer = document.getElementById('card-container');

    invoices.forEach(invoice => {
        const card = document.createElement('div');
        card.classList.add('col-6', 'col-md-4', 'col-xl-3', 'col-xxl-2', 'mb-4');

        // Check the status of the invoice and set the badge accordingly
        let badgeClass = '';
        let badgeText = '';
        let showActions = true;
        if (invoice.status === 'accept') {
            badgeClass = 'bg-success';
            badgeText = 'Accepted';
            showActions = false; 
        } else if (invoice.status === 'reject') {
            badgeClass = 'bg-danger';
            badgeText = 'Rejected';
            showActions = false; 
        } else {
            badgeClass = 'bg-warning';
            badgeText = 'Pending';
        }

        const cardInnerHtml = `
            <div class="app-card app-card-doc shadow-sm h-100">
                <input type="hidden" class="payment-id" value="${invoice.id}">
                <div class="app-card-thumb-holder p-3">
                    <div class="app-card-thumb">
                        <img class="thumb-image" src="data:image/png;base64,${invoice.invoices[0].image.$binary.replace(/^data:image\/\w+;base64,/, '')}" alt="">
                    </div>
                    <a class="app-card-link-mask" href="#file-link"></a>
                </div>
                <div class="app-card-body p-3 has-card-actions">
                    <h4 class="app-doc-title truncate mb-0">
                    <a href="#file-link"></a>
                    <span class="badge ${badgeClass}">${badgeText}</span>

                    </h4>
                    <!-- Append badge here -->
                    <div class="app-doc-meta">
                        <ul class="list-unstyled mb-0">
                            <li><span class="text-muted">Type:</span> </li>
                            <li><span class="text-muted">Size:</span> </li>
                            <li><span class="text-muted">Edited:</span></li>
                        </ul>
                    </div>
                    <!--//app-doc-meta-->
                    <div class="app-card-actions">
                        <div class="dropdown">
                            <div class="dropdown-toggle no-toggle-arrow" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-three-dots-vertical" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                            </div>
                            <!--//dropdown-toggle-->
                            <ul class="dropdown-menu">
                                ${showActions ? `
                                    <li><a class="dropdown-item view-image" href="#">View</a></li>
                                    <li><a class="dropdown-item accept-payment" href="#">Accept</a></li>
                                    <li><a class="dropdown-item reject-payment" href="#">Reject</a></li>
                                ` : `
                                    <li><a class="dropdown-item view-image" href="#">View</a></li>
                                `}
                            </ul>
                        </div>
                        <!--//dropdown-->
                    </div>
                    <!--//app-card-actions-->
                </div>
                <!--//app-card-body-->
            </div>
            <!--//app-card-->
        `;
        card.innerHTML = cardInnerHtml;
        cardContainer.appendChild(card);

        // Add click event listener to the 'View' option in dropdown
        const viewOption = card.querySelector('.dropdown-menu .view-image');
        viewOption.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            // Open modal and display image
            const modalElement = document.getElementById('imageModal');
            const img = modalElement.querySelector('.modal-body img');
            img.src = `data:image/png;base64,${invoice.invoices[0].image.$binary.replace(/^data:image\/\w+;base64,/, '')}`;
            // Open the modal
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        });

        // Add click event listener to the 'Accept' option in dropdown
        const acceptOption = card.querySelector('.dropdown-menu .accept-payment');
        if (acceptOption) {
            acceptOption.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const paymentId = card.querySelector('.payment-id').value;
                handleAcceptPayment(paymentId);
            });
        }

        // Add click event listener to the 'Reject' option in dropdown
        const rejectOption = card.querySelector('.dropdown-menu .reject-payment');
        if (rejectOption) {
            rejectOption.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const paymentId = card.querySelector('.payment-id').value;
                handleRejectPayment(paymentId);
            });
        }
    });
}




async function handleAcceptPayment(paymentId) {
    console.log('accepting payment with payment ID:', paymentId);
    const result = await updatePaymentStatuesInDB(paymentId, 'accept');
    if (result.success) {
        const card = document.querySelector(`.payment-id[value="${paymentId}"]`).closest('.app-card');
        const badge = document.createElement('span');
        badge.classList.add('badge', 'bg-success', 'me-2'); // Change bg-danger to bg-success
        badge.textContent = 'Accepted';
        const currentBadge = card.querySelector('.badge');
        if (currentBadge) {
            currentBadge.remove(); // Remove existing badge
        }
        card.querySelector('.app-doc-title').appendChild(badge);
        card.querySelector('.accept-payment').remove();
        card.querySelector('.reject-payment').remove();
    }
}

async function handleRejectPayment(paymentId) {
    console.log('Rejecting payment with payment ID:', paymentId);
    const result = await updatePaymentStatuesInDB(paymentId, 'reject');
    if (result.success) {
        const card = document.querySelector(`.payment-id[value="${paymentId}"]`).closest('.app-card');
        const badge = document.createElement('span');
        badge.classList.add('badge', 'bg-danger', 'me-2');
        badge.textContent = 'Rejected';
        const currentBadge = card.querySelector('.badge');
        if (currentBadge) {
            currentBadge.remove(); // Remove existing badge
        }
        card.querySelector('.app-doc-title').appendChild(badge);
        card.querySelector('.accept-payment').remove();
        card.querySelector('.reject-payment').remove();
    }
}


async function updatePaymentStatuesInDB(paymentId,paymentStatues){
    const url = "../../../../handlers/?action=updatePaymentStatues";
    const data = {
        paymentId:paymentId,
        paymentStatues:paymentStatues
    }
    try {
        const response = await postData(url,data);
        return response;
    } catch (error) {
        console.error("Error in fetchInvoiceRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}







// Function to convert base64 to Blob
function b64toBlob(b64Data) {
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' });
}




// Call the function with the data
populateImageInCards(invoices);

document.addEventListener('DOMContentLoaded', function() {
    getInvoiceRequests();
});





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


