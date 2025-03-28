
// Authentication Logic
function showLogin() {
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}
function showSignup() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('signupSection').classList.remove('hidden');
}
function showMessage(elementId, text, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
}

let users = JSON.parse(localStorage.getItem('users')) || [];
let isLoggedIn = localStorage.getItem('loggedIn') === 'true';

function toggleView() {
    const authContainer = document.getElementById('authContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    if (isLoggedIn) {
        authContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
    } else {
        authContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
}

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (users.some(user => user.email === email)) {
        showMessage('signupMessage', 'Email already registered!', 'error');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    showMessage('signupMessage', 'Account created! Loading dashboard...', 'success');
    isLoggedIn = true;
    setTimeout(toggleView, 1000);
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
        showMessage('loginMessage', 'Login successful! Loading dashboard...', 'success');
        isLoggedIn = true;
        setTimeout(toggleView, 1000);
    } else {
        showMessage('loginMessage', 'Invalid email or password!', 'error');
    }
});

// Logout Functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    alert('Logged out successfully!');
    isLoggedIn = false;
    toggleView();
});

// Initial View
toggleView();

// Dashboard Logic
let startY, currentY;
const sections = document.querySelectorAll('.section');
let currentSection = 0;

document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    currentY = e.touches[0].clientY;
    e.preventDefault();
});

document.addEventListener('touchend', () => {
    const diff = startY - currentY;
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSection < sections.length - 1) {
            currentSection++;
        } else if (diff < 0 && currentSection > 0) {
            currentSection--;
        }
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }
});

const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            currentSection = Array.from(sections).indexOf(targetSection);
        }
    });
});

const OTP_EXPIRY_TIME = 5 * 60 * 1000;
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function startTimer(display, expiry, callback) {
    const interval = setInterval(() => {
        const timeLeft = expiry - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
            callback();
        } else {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            display.textContent = `OTP expires in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

function setupOtpInputs(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.className = 'otp-input';
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && i < 5) {
                container.children[i + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && i > 0 && !e.target.value) {
                container.children[i - 1].focus();
            }
        });
        container.appendChild(input);
    }
}

setupOtpInputs('cleanOtpContainer');

// Room Allocation
const roomForm = document.getElementById('roomForm');
const roomSummary = document.getElementById('roomSummary');

roomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const email = document.getElementById('roomEmail').value;
    const block = document.getElementById('block').value;
    const acType = document.getElementById('acType').value;
    const hostelType = document.getElementById('hostelType').value;
    const roomType = document.getElementById('roomType').value;

    if (!/^[A-Za-z\s]+$/.test(studentName)) {
        alert('Name should contain only letters and spaces');
        return;
    }
    if (!/^\d{10}$/.test(studentPhone)) {
        alert('Mobile number must be 10 digits');
        return;
    }

    roomSummary.innerHTML = `
        <h2>Room Allocation Confirmed!</h2>
        <p><strong>Name:</strong> ${studentName}</p>
        <p><strong>Contact:</strong> ${studentPhone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Block:</strong> ${block}</p>
        <p><strong>AC/Non-AC:</strong> ${acType}</p>
        <p><strong>Hostel Type:</strong> ${hostelType}</p>
        <p><strong>Room Type:</strong> ${roomType}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <button onclick="location.reload()">New Allocation</button>
    `;
    roomForm.classList.add('hidden');
    roomSummary.classList.remove('hidden');
});

// Room Cleaning Request
let cleanOTP = null;
let cleanExpiry = null;
const cleaningForm = document.getElementById('cleaningForm');
const cleaningStatus = document.getElementById('cleaningStatus');
const verifyCleanOtp = document.getElementById('verifyCleanOtp');
const cleanTimer = document.getElementById('cleanTimer');
const cleanMessage = document.getElementById('cleanMessage');
const cleanComplete = document.getElementById('cleanComplete');
const otpSection = document.getElementById('otpSection');
const cleanOtpInputs = document.querySelectorAll('#cleanOtpContainer .otp-input');

function resetCleaning() {
    cleanOTP = null;
    cleanExpiry = null;
    cleanOtpInputs.forEach(input => input.value = '');
    cleaningStatus.classList.add('hidden');
    cleaningForm.classList.remove('hidden');
    cleanTimer.textContent = '';
    cleanComplete.checked = false;
    otpSection.classList.add('hidden');
    verifyCleanOtp.classList.add('hidden');
}

cleaningForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cleanName').value;
    const room = document.getElementById('cleanRoom').value;
    const block = document.getElementById('cleanBlock').value;
    const message = document.getElementById('cleanMessage').value;

    showMessage('cleanMessage', 'Cleaning request sent! Mark when completed.', 'success');
    cleaningForm.classList.add('hidden');
    cleaningStatus.classList.remove('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
});

cleanComplete.addEventListener('change', () => {
    if (cleanComplete.checked) {
        cleanOTP = generateOTP();
        cleanExpiry = Date.now() + OTP_EXPIRY_TIME;
        console.log(`Cleaning OTP: ${cleanOTP} (sent after completion)`);
        showMessage('cleanMessage', 'Cleaning completed! OTP sent, check console.', 'success');
        otpSection.classList.remove('hidden');
        verifyCleanOtp.classList.remove('hidden');
        startTimer(cleanTimer, cleanExpiry, () => {
            resetCleaning();
            showMessage('cleanMessage', 'OTP has expired!', 'error');
        });
    }
});

verifyCleanOtp.addEventListener('click', () => {
    const enteredOTP = Array.from(cleanOtpInputs).map(input => input.value).join('');
    if (!enteredOTP || enteredOTP.length !== 6) {
        showMessage('cleanMessage', 'Enter a valid 6-digit OTP!', 'error');
        return;
    }

    if (Date.now() > cleanExpiry) {
        showMessage('cleanMessage', 'OTP expired!', 'error');
        resetCleaning();
        return;
    }

    if (enteredOTP === cleanOTP) {
        showMessage('cleanMessage', 'OTP verified! Cleaning confirmed.', 'success');
        setTimeout(() => location.reload(), 2000);
    } else {
        showMessage('cleanMessage', 'Invalid OTP!', 'error');
    }
});

// Laundry Services
let laundryRecords = [];
const MAX_LAUNDRY_REQUESTS = 44;
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
const laundryForm = document.getElementById('laundryForm');
const laundryMessage = document.getElementById('laundryMessage');

laundryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('laundryName').value.trim();
    const room = document.getElementById('laundryRoom').value.trim();
    const block = document.getElementById('laundryBlock').value;
    const clothes = parseInt(document.getElementById('laundryClothes').value);

    if (!name || !room || !block || !clothes) {
        showMessage('laundryMessage', 'Please fill all fields!', 'error');
        return;
    }

    if (clothes > 25) {
        showMessage('laundryMessage', 'Maximum 25 clothes allowed per request!', 'error');
        return;
    }

    const now = Date.now();
    const sixMonthsAgo = now - SIX_MONTHS_MS;
    const recentRequests = laundryRecords.filter(record => record.timestamp > sixMonthsAgo);
    if (recentRequests.length >= MAX_LAUNDRY_REQUESTS) {
        showMessage('laundryMessage', 'Maximum 44 laundry requests reached in 6 months!', 'error');
        return;
    }

    const pickupTime = new Date(now + 24 * 60 * 60 * 1000);
    const deliveryTime = new Date(now + 48 * 60 * 60 * 1000);
    laundryRecords.push({
        name,
        room,
        block,
        clothes,
        pickup: pickupTime.toLocaleString(),
        delivery: deliveryTime.toLocaleString(),
        status: 'Pending',
        timestamp: now
    });
    updateLaundryStatus();
    showMessage('laundryMessage', 'Laundry request submitted successfully!', 'black-message');
    document.getElementById('laundryName').value = '';
    document.getElementById('laundryRoom').value = '';
    document.getElementById('laundryBlock').value = '';
    document.getElementById('laundryClothes').value = '';
});

function updateLaundryStatus() {
    const laundryStatus = document.getElementById('laundryStatus');
    if (laundryRecords.length === 0) {
        laundryStatus.innerHTML = '<p style="color: var(--primary-color);">No laundry requests yet.</p>';
        return;
    }
    laundryStatus.innerHTML = laundryRecords.map(record => `
        <div class="service-item-status">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room:</strong> ${record.room}</p>
            <p><strong>Block:</strong> ${record.block}</p>
            <p><strong>Clothes:</strong> ${record.clothes}</p>
            <p><strong>Pickup:</strong> ${record.pickup}</p>
            <p><strong>Delivery:</strong> ${record.delivery}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `).join('');
}

// Electrical Services
let electricalRecords = [];
const electricalForm = document.getElementById('electricalForm');

electricalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('electricalName').value.trim();
    const room = document.getElementById('electricalRoom').value.trim();
    if (!name || !room) {
        alert('Please enter both name and room number!');
        return;
    }
    const requestTime = new Date().toLocaleString();
    const serviceTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();
    electricalRecords.push({ name, room, requestTime, serviceTime, status: 'Pending' });
    updateElectricalStatus();
    document.getElementById('electricalName').value = '';
    document.getElementById('electricalRoom').value = '';
});

function updateElectricalStatus() {
    const electricalStatus = document.getElementById('electricalStatus');
    if (electricalRecords.length === 0) {
        electricalStatus.innerHTML = '<p style="color: var(--primary-color);">No electrical requests yet.</p>';
        return;
    }
    electricalStatus.innerHTML = electricalRecords.map(record => `
        <div class="service-item-status">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room:</strong> ${record.room}</p>
            <p><strong>Request Time:</strong> ${record.requestTime}</p>
            <p><strong>Service Time:</strong> ${record.serviceTime}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `).join('');
}

// Carpenter Services
let carpenterRecords = [];
const carpenterForm = document.getElementById('carpenterForm');

carpenterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('carpenterName').value.trim();
    const room = document.getElementById('carpenterRoom').value.trim();
    if (!name || !room) {
        alert('Please enter both name and room number!');
        return;
    }
    const requestTime = new Date().toLocaleString();
    const serviceTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();
    carpenterRecords.push({ name, room, requestTime, serviceTime, status: 'Pending' });
    updateCarpenterStatus();
    document.getElementById('carpenterName').value = '';
    document.getElementById('carpenterRoom').value = '';
});

function updateCarpenterStatus() {
    const carpenterStatus = document.getElementById('carpenterStatus');
    if (carpenterRecords.length === 0) {
        carpenterStatus.innerHTML = '<p style="color: var(--primary-color);">No carpenter requests yet.</p>';
        return;
    }
    carpenterStatus.innerHTML = carpenterRecords.map(record => `
        <div class="service-item-status">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room:</strong> ${record.room}</p>
            <p><strong>Request Time:</strong> ${record.requestTime}</p>
            <p><strong>Service Time:</strong> ${record.serviceTime}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `).join('');
}

// WiFi Complaints
let wifiRecords = [];
const wifiForm = document.getElementById('wifiForm');

wifiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wifiName').value.trim();
    const room = document.getElementById('wifiRoom').value.trim();
    const complaint = document.getElementById('wifiComplaint').value.trim();
    if (!name || !room || !complaint) {
        alert('Please enter name, room number, and complaint!');
        return;
    }
    const requestTime = new Date().toLocaleString();
    const serviceTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();
    wifiRecords.push({ name, room, requestTime, serviceTime, status: 'Pending', complaint });
    updateWifiStatus();
    document.getElementById('wifiName').value = '';
    document.getElementById('wifiRoom').value = '';
    document.getElementById('wifiComplaint').value = '';
});

function updateWifiStatus() {
    const wifiStatus = document.getElementById('wifiStatus');
    if (wifiRecords.length === 0) {
        wifiStatus.innerHTML = '<p style="color: var(--primary-color);">No WiFi complaints yet.</p>';
        return;
    }
    wifiStatus.innerHTML = wifiRecords.map(record => `
        <div class="service-item-status">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room:</strong> ${record.room}</p>
            <p><strong>Request Time:</strong> ${record.requestTime}</p>
            <p><strong>Service Time:</strong> ${record.serviceTime}</p>
            <p><strong>Complaint:</strong> ${record.complaint}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `).join('');
}

// Mess Complaints
let messRecords = [];
const messForm = document.getElementById('messForm');

messForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('messName').value.trim();
    const room = document.getElementById('messRoom').value.trim();
    const complaint = document.getElementById('messComplaint').value.trim();
    if (!name || !room || !complaint) {
        alert('Please enter name, room number, and complaint!');
        return;
    }
    const requestTime = new Date().toLocaleString();
    const serviceTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString();
    messRecords.push({ name, room, requestTime, serviceTime, status: 'Pending', complaint });
    updateMessStatus();
    document.getElementById('messName').value = '';
    document.getElementById('messRoom').value = '';
    document.getElementById('messComplaint').value = '';
});

function updateMessStatus() {
    const messStatus = document.getElementById('messStatus');
    if (messRecords.length === 0) {
        messStatus.innerHTML = '<p style="color: var(--primary-color);">No mess complaints yet.</p>';
        return;
    }
    messStatus.innerHTML = messRecords.map(record => `
        <div class="service-item-status">
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Room:</strong> ${record.room}</p>
            <p><strong>Request Time:</strong> ${record.requestTime}</p>
            <p><strong>Service Time:</strong> ${record.serviceTime}</p>
            <p><strong>Complaint:</strong> ${record.complaint}</p>
            <p><strong>Status:</strong> ${record.status}</p>
        </div>
    `).join('');
}

// Initial load
updateLaundryStatus();
updateElectricalStatus();
updateCarpenterStatus();
updateWifiStatus();
updateMessStatus();
