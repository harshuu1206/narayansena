const API_BASE_URL = "http://20.197.35.47:8090"; // Updated backend IP

let globalUserDetails = null;

document.addEventListener('DOMContentLoaded', () => {
    const userId = getQueryParam('userId') || sessionStorage.getItem('userId');
    if (!userId) {
        showMessage('User ID is not set. Please log in.', 'error');
        return;
    }
    fetchUserDetails(userId);
});

function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

async function fetchUserDetails(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        globalUserDetails = data;
        displayUserDetails(data);
        showMessage('User details loaded successfully!', 'success');
    } catch (error) {
        showMessage(`Error fetching details: ${error.message}`, 'error');
    }
}

function displayUserDetails(userDetails) {
    const userDetailsDiv = document.getElementById('user-details');
    if (!userDetailsDiv) return;

    userDetailsDiv.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <p><i class="fas fa-user mr-2"></i><strong>Full Name:</strong> ${userDetails.fullName}</p>
                <p><i class="fas fa-envelope mr-2"></i><strong>Email:</strong> ${userDetails.email}</p>
                <p><i class="fas fa-city mr-2"></i><strong>City:</strong> ${userDetails.city}</p>
            </div>
            <div class="col-md-6">
                <p><i class="fas fa-mobile-alt mr-2"></i><strong>Mobile:</strong> ${userDetails.mobileNumber}</p>
                <p><i class="fas fa-user-friends mr-2"></i><strong>Referred by:</strong> ${userDetails.referrer || 'N/A'}</p>
                <p><i class="fas fa-id-card mr-2"></i><strong>Referral ID:</strong> ${userDetails.referralId || 'N/A'}</p>
            </div>
        </div>
        <p class="d-flex align-items-center">
            <i class="fas fa-credit-card mr-2"></i>
            <strong>Payment Status:</strong>
            <span class="payment-status ${userDetails.paymentStatus.includes('Paid') ? 'badge-success' : 'badge-danger'} ml-2">
                ${userDetails.paymentStatus}
            </span>
            ${userDetails.paymentStatus.includes('Pending') ?
        `<a href="payment.html?userId=${userDetails.id}" class="btn btn-success ml-3">
                    <i class="fas fa-wallet mr-2"></i>Make Payment
                </a>` : ''}
        </p>
        <button class="btn btn-primary btn-block mt-4" id="toggle-referrals">
            <i class="fas fa-sitemap mr-2"></i>Show Referral Network
        </button>
    `;

    document.getElementById('toggle-referrals').addEventListener('click', toggleReferralDetails);
}

function toggleReferralDetails() {
    const referralDetails = document.getElementById('referral-details');
    const isHidden = referralDetails.style.display === 'none';

    referralDetails.style.display = isHidden ? 'block' : 'none';
    const btn = document.getElementById('toggle-referrals');
    btn.innerHTML = `<i class="fas fa-sitemap mr-2"></i>${isHidden ? 'Hide' : 'Show'} Referral Network`;

    if (isHidden && globalUserDetails) {
        displayReferralTree(globalUserDetails.referralTree);
    }
}

function displayReferralTree(referralTree) {
    const container = document.querySelector('.referral-tree-container');
    container.innerHTML = '';

    if (referralTree?.length > 0) {
        const tree = document.createElement('div');
        tree.className = 'referral-tree';
        buildTree(tree, referralTree, 1);
        container.appendChild(tree);
    } else {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-users-slash mr-2"></i>
                No referrals found. Start sharing your referral link!
            </div>
        `;
    }
}

function buildTree(container, referrals, level) {
    referrals.forEach(referral => {
        const node = document.createElement('div');
        node.className = `referral-node level-${level}`;
        node.innerHTML = `
            <div class="node-content">
                <div class="user-avatar">${getInitials(referral.fullName)}</div>
                <div class="user-info">
                    <h6>${referral.fullName}</h6>
                    <div class="details">
                        <span class="badge ${referral.paymentStatus.includes('Paid') ? 'badge-success' : 'badge-danger'}">
                            ${referral.paymentStatus}
                        </span>
                        <small class="text-muted">${referral.referrals?.length || 0} sub-referrals</small>
                    </div>
                </div>
            </div>
        `;

        if (referral.referrals?.length > 0) {
            const children = document.createElement('div');
            children.className = 'referral-children';
            buildTree(children, referral.referrals, level + 1);
            node.appendChild(children);
        }
        container.appendChild(node);
    });
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 3).toUpperCase();
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `;
}
