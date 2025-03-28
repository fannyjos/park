// Parking Areas Data
const parkingAreas = [
    {
        id: 'area1',
        name: 'City Center Mall',
        location: 'Central Business District',
        rate: 60,
        totalSlots: 50,
        slots: generateSlots('A', 50)
    },
    {
        id: 'area2',
        name: 'Medical Complex',
        location: 'Hospital Zone',
        rate: 40,
        totalSlots: 30,
        slots: generateSlots('B', 30)
    },
    {
        id: 'area3',
        name: 'Food Street',
        location: 'Restaurant District',
        rate: 50,
        totalSlots: 25,
        slots: generateSlots('C', 25)
    },
    {
        id: 'area4',
        name: 'University Campus',
        location: 'Education Zone',
        rate: 30,
        totalSlots: 40,
        slots: generateSlots('D', 40)
    },
    {
        id: 'area5',
        name: 'Market Complex',
        location: 'Shopping District',
        rate: 45,
        totalSlots: 35,
        slots: generateSlots('E', 35)
    }
];

// Generate slots for each area with random availability
function generateSlots(prefix, count) {
    const slots = [];
    for (let i = 1; i <= count; i++) {
        // Randomly determine if slot is available (70% chance of being available)
        const isAvailable = Math.random() < 0.7;
        slots.push({
            id: `${prefix}${i}`,
            number: `${prefix}${i}`,
            isAvailable: isAvailable
        });
    }
    return slots;
}

// Booking data storage
let bookings = JSON.parse(localStorage.getItem('parkingBookings')) || [];
let currentBooking = {};

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Set up event listeners for navigation
    setupNavigation();
    
    // Set up area selection
    setupAreaSelection();
    
    // Set up back buttons
    setupBackButtons();
    
    // Set up time selection
    setupTimeSelection();
    
    // Set up payment methods
    setupPaymentMethods();
    
    // Set up booking completion
    setupBookingCompletion();
    
    // Set up my bookings page
    setupMyBookingsPage();
    
    // Set minimum date for booking to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').min = today;
    document.getElementById('booking-date').value = today;
    
    // Show home page by default
    showPage('home-page');
}

// Navigation Functions
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            if (page === 'home') {
                showPage('home-page');
            } else if (page === 'bookings') {
                showPage('bookings-page');
                loadBookings();
            }
        });
    });
}

function showPage(pageId) {
    pages.forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Area Selection
function setupAreaSelection() {
    const areaCards = document.querySelectorAll('.area-card');
    
    areaCards.forEach(card => {
        card.addEventListener('click', function() {
            const areaId = this.getAttribute('data-area');
            const selectedArea = parkingAreas.find(area => area.id === areaId);
            
            // Store selected area in current booking
            currentBooking.area = selectedArea;
            
            // Update UI with selected area info
            document.getElementById('selected-area-name').textContent = selectedArea.name;
            document.getElementById('selected-area-location').textContent = selectedArea.location;
            document.getElementById('selected-area-rate').textContent = selectedArea.rate;
            
            // Generate slots
            generateSlotsUI(selectedArea);
            
            // Show slots page
            showPage('slots-page');
        });
    });
}

function generateSlotsUI(area) {
    const slotsGrid = document.getElementById('slots-grid');
    slotsGrid.innerHTML = '';
    
    area.slots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = `slot ${slot.isAvailable ? 'available' : 'occupied'}`;
        slotElement.textContent = slot.number;
        slotElement.setAttribute('data-slot-id', slot.id);
        
        if (slot.isAvailable) {
            slotElement.addEventListener('click', function() {
                // Remove selected class from all slots
                document.querySelectorAll('.slot').forEach(s => {
                    s.classList.remove('selected');
                });
                
                // Add selected class to clicked slot
                this.classList.add('selected');
                
                // Store selected slot in current booking
                currentBooking.slot = slot;
                
                // Enable proceed button
                document.getElementById('proceed-to-time').removeAttribute('disabled');
            });
        }
        
        slotsGrid.appendChild(slotElement);
    });
}

// Back Buttons
function setupBackButtons() {
    // Back to areas
    document.getElementById('back-to-areas').addEventListener('click', function() {
        showPage('home-page');
    });
    
    // Back to slots
    document.getElementById('back-to-slots').addEventListener('click', function() {
        showPage('slots-page');
    });
    
    // Back to time
    document.getElementById('back-to-time').addEventListener('click', function() {
        showPage('time-page');
    });
    
    // Proceed to time selection
    document.getElementById('proceed-to-time').addEventListener('click', function() {
        if (currentBooking.slot) {
            // Update time page with booking info
            document.getElementById('time-area-name').textContent = currentBooking.area.name;
            document.getElementById('time-slot-number').textContent = currentBooking.slot.number;
            document.getElementById('time-hourly-rate').textContent = currentBooking.area.rate;
            document.getElementById('base-rate').textContent = currentBooking.area.rate;
            
            // Calculate initial total
            updateTotalAmount();
            
            // Show time page
            showPage('time-page');
        }
    });
    
    // Proceed to payment
    document.getElementById('proceed-to-payment').addEventListener('click', function() {
        // Get selected date and time
        const date = document.getElementById('booking-date').value;
        const startTime = document.getElementById('start-time').value;
        const duration = parseInt(document.getElementById('duration').value);
        
        if (!date || !startTime) {
            alert('Please select date and time');
            return;
        }
        
        // Calculate end time
        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
        const endTime = endDateTime.toTimeString().substring(0, 5);
        
        // Store time details in current booking
        currentBooking.date = date;
        currentBooking.startTime = startTime;
        currentBooking.endTime = endTime;
        currentBooking.duration = duration;
        currentBooking.totalAmount = calculateTotalAmount();
        
        // Format date and time for display
        const formattedDate = formatDate(date);
        const formattedStartTime = formatTime(startTime);
        const formattedEndTime = formatTime(endTime);
        
        // Update payment page with booking info
        document.getElementById('payment-area-name').textContent = currentBooking.area.name;
        document.getElementById('payment-slot-number').textContent = currentBooking.slot.number;
        document.getElementById('payment-date').textContent = formattedDate;
        document.getElementById('payment-time').textContent = `${formattedStartTime} - ${formattedEndTime}`;
        document.getElementById('payment-duration').textContent = `${duration} hour${duration > 1 ? 's' : ''}`;
        document.getElementById('payment-amount').textContent = currentBooking.totalAmount;
        document.getElementById('payment-button-amount').textContent = currentBooking.totalAmount;
        
        // Show payment page
        showPage('payment-page');
    });
}

// Time Selection
function setupTimeSelection() {
    // Duration controls
    document.getElementById('decrease-duration').addEventListener('click', function() {
        const durationInput = document.getElementById('duration');
        let duration = parseInt(durationInput.value);
        if (duration > 1) {
            duration--;
            durationInput.value = duration;
            document.getElementById('duration-display').textContent = duration;
            updateTotalAmount();
        }
    });
    
    document.getElementById('increase-duration').addEventListener('click', function() {
        const durationInput = document.getElementById('duration');
        let duration = parseInt(durationInput.value);
        if (duration < 24) {
            duration++;
            durationInput.value = duration;
            document.getElementById('duration-display').textContent = duration;
            updateTotalAmount();
        }
    });
    
    // Update total when date or time changes
    document.getElementById('booking-date').addEventListener('change', updateTotalAmount);
    document.getElementById('start-time').addEventListener('change', updateTotalAmount);
}

function updateTotalAmount() {
    const totalAmount = calculateTotalAmount();
    document.getElementById('total-amount').textContent = totalAmount;
}

function calculateTotalAmount() {
    const rate = currentBooking.area.rate;
    const duration = parseInt(document.getElementById('duration').value);
    
    // Calculate base amount
    let totalAmount = rate * duration;
    
    // Apply time-based pricing (peak hours cost more)
    const startTime = document.getElementById('start-time').value;
    if (startTime) {
        const hour = parseInt(startTime.split(':')[0]);
        // Peak hours: 9 AM to 6 PM (9-18)
        if (hour >= 9 && hour < 18) {
            totalAmount *= 1.2; // 20% surcharge during peak hours
        }
    }
    
    // Apply weekend pricing
    const date = document.getElementById('booking-date').value;
    if (date) {
        const day = new Date(date).getDay();
        // Weekend: Saturday (6) and Sunday (0)
        if (day === 0 || day === 6) {
            totalAmount *= 1.25; // 25% surcharge on weekends
        }
    }
    
    return Math.round(totalAmount);
}

// Payment Methods
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const selectedMethod = this.value;
            
            // Hide all payment details
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected payment details
            document.getElementById(`${selectedMethod}-details`).style.display = 'block';
        });
    });
    
    // Complete payment
    document.getElementById('complete-payment').addEventListener('click', function() {
        // Generate booking ID
        const bookingId = 'PK' + Math.floor(100000 + Math.random() * 900000);
        
        // Create booking object
        const booking = {
            id: bookingId,
            area: {
                id: currentBooking.area.id,
                name: currentBooking.area.name,
                location: currentBooking.area.location
            },
            slot: currentBooking.slot.number,
            date: currentBooking.date,
            startTime: currentBooking.startTime,
            endTime: currentBooking.endTime,
            duration: currentBooking.duration,
            totalAmount: currentBooking.totalAmount,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Add booking to bookings array
        bookings.push(booking);
        
        // Save bookings to localStorage
        localStorage.setItem('parkingBookings', JSON.stringify(bookings));
        
        // Update confirmation page
        document.getElementById('confirmation-booking-id').textContent = bookingId;
        document.getElementById('confirmation-area').textContent = currentBooking.area.name;
        document.getElementById('confirmation-slot').textContent = currentBooking.slot.number;
        
        const formattedDate = formatDate(currentBooking.date);
        const formattedStartTime = formatTime(currentBooking.startTime);
        const formattedEndTime = formatTime(currentBooking.endTime);
        
        document.getElementById('confirmation-datetime').textContent = 
            `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
        document.getElementById('confirmation-amount').textContent = currentBooking.totalAmount;
        
        // Show confirmation page
        showPage('confirmation-page');
    });
}

// Booking Completion
function setupBookingCompletion() {
    // View bookings
    document.getElementById('view-bookings').addEventListener('click', function() {
        showPage('bookings-page');
        loadBookings();
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        document.querySelector('nav a[data-page="bookings"]').classList.add('active');
    });
    
    // Book another
    document.getElementById('book-another').addEventListener('click', function() {
        // Reset current booking
        currentBooking = {};
        
        // Show home page
        showPage('home-page');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        document.querySelector('nav a[data-page="home"]').classList.add('active');
    });
}

// My Bookings Page
function setupMyBookingsPage() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const bookingsContainers = document.querySelectorAll('.bookings-container');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            bookingsContainers.forEach(container => {
                container.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Book now button
    document.getElementById('book-now-button').addEventListener('click', function() {
        showPage('home-page');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        document.querySelector('nav a[data-page="home"]').classList.add('active');
    });
}

function loadBookings() {
    // Get bookings from localStorage
    bookings = JSON.parse(localStorage.getItem('parkingBookings')) || [];
    
    // Update booking status based on date and time
    updateBookingStatuses();
    
    // Filter active and past bookings
    const activeBookings = bookings.filter(booking => booking.status === 'active');
    const pastBookings = bookings.filter(booking => booking.status === 'expired');
    
    // Render active bookings
    const activeBookingsList = document.getElementById('active-bookings-list');
    const noActiveBookings = document.getElementById('no-active-bookings');
    
    if (activeBookings.length === 0) {
        activeBookingsList.innerHTML = '';
        noActiveBookings.style.display = 'block';
    } else {
        noActiveBookings.style.display = 'none';
        renderBookings(activeBookingsList, activeBookings);
    }
    
    // Render past bookings
    const pastBookingsList = document.getElementById('past-bookings-list');
    const noPastBookings = document.getElementById('no-past-bookings');
    
    if (pastBookings.length === 0) {
        pastBookingsList.innerHTML = '';
        noPastBookings.style.display = 'block';
    } else {
        noPastBookings.style.display = 'none';
        renderBookings(pastBookingsList, pastBookings);
    }
}

function updateBookingStatuses() {
    const now = new Date();
    
    bookings = bookings.map(booking => {
        const bookingEndDateTime = new Date(`${booking.date}T${booking.endTime}`);
        
        if (bookingEndDateTime < now) {
            booking.status = 'expired';
        }
        
        return booking;
    });
    
    // Save updated bookings to localStorage
    localStorage.setItem('parkingBookings', JSON.stringify(bookings));
}

function renderBookings(container, bookingsList) {
    container.innerHTML = '';
    
    bookingsList.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        
        const formattedDate = formatDate(booking.date);
        const formattedStartTime = formatTime(booking.startTime);
        const formattedEndTime = formatTime(booking.endTime);
        
        bookingCard.innerHTML = `
            <div class="booking-header">
                <div class="booking-id">${booking.id}</div>
                <div class="booking-status ${booking.status === 'expired' ? 'expired' : ''}">${booking.status === 'active' ? 'Active' : 'Expired'}</div>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span>Area</span>
                    <span>${booking.area.name}</span>
                </div>
                <div class="booking-detail">
                    <span>Slot</span>
                    <span>${booking.slot}</span>
                </div>
                <div class="booking-detail">
                    <span>Date</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="booking-detail">
                    <span>Time</span>
                    <span>${formattedStartTime} - ${formattedEndTime}</span>
                </div>
                <div class="booking-detail">
                    <span>Duration</span>
                    <span>${booking.duration} hour${booking.duration > 1 ? 's' : ''}</span>
                </div>
                <div class="booking-detail">
                    <span>Amount</span>
                    <span>₹${booking.totalAmount}</span>
                </div>
            </div>
            ${booking.status === 'active' ? `
                <div class="booking-actions">
                    <button class="secondary-button" data-booking-id="${booking.id}">
                        <i class="fas fa-qrcode"></i> Show QR
                    </button>
                </div>
            ` : ''}
        `;
        
        container.appendChild(bookingCard);
    });
    
    // Add event listeners to QR code buttons
    const qrButtons = container.querySelectorAll('.secondary-button');
    qrButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('QR Code displayed. Show this at the parking entrance.');
        });
    });
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

