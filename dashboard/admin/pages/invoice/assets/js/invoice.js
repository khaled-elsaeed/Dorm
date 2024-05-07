var docs = [];

async function getdocRequests() {
    try {
        const response = await fetchdocRequestsFromDB();
        console.log(response);
        docs = response;
        populateImageInCards(docs);

    } catch (error) {
        console.error("Error in getdocRequests:", error);
        throw new Error("Failed to fetch resident count data");
    }
}

async function fetchdocRequestsFromDB() {
    const url = "../../../../handlers/?action=fetchDocs";
    try {
        const response = await fetchData(url);
        return response.data;
    } catch (error) {
        console.error("Error in fetchdocRequestsFromDB:", error);
        throw new Error("Failed to fetch resident count data from database");
    }
}



function populateImageInCards(docs) {
    const cardContainer = document.getElementById('card-container');

    docs.forEach(doc => {
        const card = document.createElement('div');
        card.classList.add('col-6', 'col-md-4', 'col-xl-3', 'col-xxl-2', 'mb-4');

        // Check the status of the doc and set the badge accordingly
        let badgeClass = '';
        let badgeText = '';
        let showActions = true;
        if (doc.memberStatus=== 'accepted') {
            badgeClass = 'bg-success';
            badgeText = 'Accepted';
            showActions = false; 
        } else if (doc.memberStatus=== 'rejected') {
            badgeClass = 'bg-danger';
            badgeText = 'Rejected';
            showActions = false; 
        } else {
            badgeClass = 'bg-warning';
            badgeText = 'Pending';
        }

        const cardInnerHtml = `
            <div class="app-card app-card-doc shadow-sm h-100">
                <input type="hidden" class="member-id" value="${doc.memberId}">
                <div class="app-card-thumb-holder p-3">
                    <div class="app-card-thumb">
                        <img class="thumb-image" src="data:image/png;base64,${doc.profilePicture.$binary.replace(/^data:image\/\w+;base64,/, '')}" alt="">
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
                            <li><span class="text-muted">Name : ${doc.memberId}</span> </li>
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
                                    <li><a class="dropdown-item accept-doc" href="#">Accept</a></li>
                                    <li><a class="dropdown-item reject-doc" href="#">Reject</a></li>
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
            
            // Select modalImage and modalImage2 separately
            const img = modalElement.querySelector('#modalImage');
            const img2 = modalElement.querySelector('#modalImage2');
        
            // Assuming doc object is defined elsewhere
            img.src = `data:image/png;base64,${doc.invoice.$binary.replace(/^data:image\/\w+;base64,/, '')}`;
            img2.src = `data:image/png;base64,${doc.profilePicture.$binary.replace(/^data:image\/\w+;base64,/, '')}`;
        
            // Open the modal
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        });
        

        // Add click event listener to the 'Accept' option in dropdown
        const acceptOption = card.querySelector('.dropdown-menu .accept-doc');
        if (acceptOption) {
            acceptOption.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const memberId = card.querySelector('.member-id').value;
                handleAcceptPayment(memberId);
            });
        }

        // Add click event listener to the 'Reject' option in dropdown
        const rejectOption = card.querySelector('.dropdown-menu .reject-doc');
        if (rejectOption) {
            rejectOption.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                const memberId = card.querySelector('.member-id').value;
                handleRejectPayment(memberId);
            });
        }
    });
}










async function handleAcceptPayment(memberId) {
    console.log('accepting docs with member ID:', memberId);
    const result = await updateDocStatuesInDB(memberId, 'accepted');
    if (result.success) {
        const card = document.querySelector(`.member-id[value="${memberId}"]`).closest('.app-card');
        const badge = document.createElement('span');
        badge.classList.add('badge', 'bg-success', 'me-2'); // Change bg-danger to bg-success
        badge.textContent = 'Accepted';
        const currentBadge = card.querySelector('.badge');
        if (currentBadge) {
            currentBadge.remove(); // Remove existing badge
        }
        card.querySelector('.app-doc-title').appendChild(badge);
        card.querySelector('.accept-doc').remove();
        card.querySelector('.reject-doc').remove();
    }
}

async function handleRejectPayment(memberId) {
    console.log('Rejecting doc with member ID:', memberId);
    const result = await updateDocStatuesInDB(memberId, 'rejected');
    if (result.success) {
        const card = document.querySelector(`.member-id[value="${memberId}"]`).closest('.app-card');
        const badge = document.createElement('span');
        badge.classList.add('badge', 'bg-danger', 'me-2');
        badge.textContent = 'Rejected';
        const currentBadge = card.querySelector('.badge');
        if (currentBadge) {
            currentBadge.remove(); // Remove existing badge
        }
        card.querySelector('.app-doc-title').appendChild(badge);
        card.querySelector('.accept-doc').remove();
        card.querySelector('.reject-doc').remove();
    }
}


async function updateDocStatuesInDB(memberId,docStatues){
    const url = "../../../../handlers/?action=updateDocStatues";
    const data = {
        memberId:memberId,
        docStatues:docStatues
    }
    try {
        const response = await postData(url,data);
        return response;
    } catch (error) {
        console.error("Error in fetchdocRequestsFromDB:", error);
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
populateImageInCards(docs);

document.addEventListener('DOMContentLoaded', function() {
    getdocRequests();
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


