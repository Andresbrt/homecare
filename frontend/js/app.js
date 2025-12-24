// Global variables
let currentUser = null;
let authToken = null;
const API_BASE_URL = 'http://localhost:8080/api';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize the application
function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateUIForLoggedInUser();
    } else {
        showPage('home');
    }
    
    // Load services on home page
    loadServices();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Auth buttons
    document.getElementById('showLoginBtn').addEventListener('click', () => showPage('login'));
    document.getElementById('showRegisterBtn').addEventListener('click', () => showPage('register'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addServiceForm').addEventListener('submit', handleAddService);
    
    // Auth form switches
    document.getElementById('showRegisterLink').addEventListener('click', () => showPage('register'));
    document.getElementById('showLoginLink').addEventListener('click', () => showPage('login'));
    
    // Role toggle
    document.getElementById('role').addEventListener('change', function() {
        const providerFields = document.getElementById('providerFields');
        if (this.value === 'SERVICE_PROVIDER') {
            providerFields.style.display = 'block';
        } else {
            providerFields.style.display = 'none';
        }
    });
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load page specific content
    if (pageId === 'services' && currentUser) {
        loadUserServices();
    } else if (pageId === 'profile' && currentUser) {
        loadUserProfile();
    }
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    showLoading(true);
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateUIForLoggedInUser();
            showNotification('¡Inicio de sesión exitoso!', 'success');
            showPage('home');
        } else {
            const error = await response.text();
            showNotification('Error al iniciar sesión: ' + error, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error de conexión. Inténtelo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    showLoading(true);
    
    const formData = new FormData(e.target);
    const registerData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        phoneNumber: formData.get('phoneNumber'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        role: formData.get('role')
    };
    
    // Add provider specific fields if role is SERVICE_PROVIDER
    if (registerData.role === 'SERVICE_PROVIDER') {
        registerData.companyName = formData.get('companyName');
        registerData.description = formData.get('description');
        registerData.experience = parseInt(formData.get('experience'));
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        if (response.ok) {
            showNotification('¡Registro exitoso! Por favor, inicia sesión.', 'success');
            showPage('login');
            document.getElementById('registerForm').reset();
        } else {
            const error = await response.text();
            showNotification('Error al registrarse: ' + error, 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Error de conexión. Inténtelo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    updateUIForLoggedOutUser();
    showNotification('Sesión cerrada exitosamente', 'info');
    showPage('home');
}

function checkAuthStatus() {
    const guestElements = document.querySelectorAll('.guest-only');
    const authElements = document.querySelectorAll('.auth-only');
    const providerElements = document.querySelectorAll('.provider-only');
    
    if (currentUser) {
        guestElements.forEach(el => el.style.display = 'none');
        authElements.forEach(el => el.style.display = 'block');
        
        if (currentUser.role === 'SERVICE_PROVIDER') {
            providerElements.forEach(el => el.style.display = 'block');
        } else {
            providerElements.forEach(el => el.style.display = 'none');
        }
    } else {
        guestElements.forEach(el => el.style.display = 'block');
        authElements.forEach(el => el.style.display = 'none');
        providerElements.forEach(el => el.style.display = 'none');
    }
}

function updateUIForLoggedInUser() {
    const userNameElement = document.getElementById('userName');
    const userRoleElement = document.getElementById('userRole');
    
    if (userNameElement && currentUser) {
        userNameElement.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (userRoleElement && currentUser) {
        userRoleElement.textContent = currentUser.role;
        userRoleElement.className = `role-badge ${currentUser.role}`;
    }
    
    checkAuthStatus();
}

function updateUIForLoggedOutUser() {
    checkAuthStatus();
}

// Services functions
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        
        if (response.ok) {
            const services = await response.json();
            displayServices(services);
        } else {
            console.error('Failed to load services');
        }
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function displayServices(services) {
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p>No hay servicios disponibles en este momento.</p>';
        return;
    }
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>${service.name}</h3>
            <div class="service-type">${getServiceTypeDisplay(service.type)}</div>
            <p class="service-description">${service.description}</p>
            <div class="service-details">
                <span class="price">$${service.price}</span>
                <span class="duration">${service.durationHours}h</span>
            </div>
            ${currentUser && currentUser.role === 'CUSTOMER' ? 
                `<button class="btn btn-primary" onclick="bookService(${service.id})">Reservar</button>` : 
                ''
            }
        </div>
    `).join('');
}

async function loadUserServices() {
    if (!currentUser || currentUser.role !== 'SERVICE_PROVIDER') {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/services/provider/${currentUser.id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const services = await response.json();
            displayUserServices(services);
        } else {
            console.error('Failed to load user services');
        }
    } catch (error) {
        console.error('Error loading user services:', error);
    }
}

function displayUserServices(services) {
    const userServicesGrid = document.getElementById('userServicesGrid');
    
    if (services.length === 0) {
        userServicesGrid.innerHTML = '<p>No has creado ningún servicio aún.</p>';
        return;
    }
    
    userServicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>${service.name}</h3>
            <div class="service-type">${getServiceTypeDisplay(service.type)}</div>
            <p class="service-description">${service.description}</p>
            <div class="service-details">
                <span class="price">$${service.price}</span>
                <span class="duration">${service.durationHours}h</span>
            </div>
            <button class="btn btn-danger" onclick="deleteService(${service.id})">Eliminar</button>
        </div>
    `).join('');
}

async function handleAddService(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.role !== 'SERVICE_PROVIDER') {
        showNotification('Solo los proveedores de servicios pueden añadir servicios', 'error');
        return;
    }
    
    showLoading(true);
    
    const formData = new FormData(e.target);
    const serviceData = {
        name: formData.get('serviceName'),
        description: formData.get('serviceDescription'),
        type: formData.get('serviceType'),
        price: parseFloat(formData.get('servicePrice')),
        durationHours: parseInt(formData.get('serviceDuration')),
        availableSlots: parseInt(formData.get('availableSlots'))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(serviceData)
        });
        
        if (response.ok) {
            showNotification('Servicio creado exitosamente', 'success');
            document.getElementById('addServiceForm').reset();
            loadUserServices();
            loadServices(); // Refresh all services
        } else {
            const error = await response.text();
            showNotification('Error al crear servicio: ' + error, 'error');
        }
    } catch (error) {
        console.error('Add service error:', error);
        showNotification('Error de conexión. Inténtelo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteService(serviceId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Servicio eliminado exitosamente', 'success');
            loadUserServices();
            loadServices(); // Refresh all services
        } else {
            const error = await response.text();
            showNotification('Error al eliminar servicio: ' + error, 'error');
        }
    } catch (error) {
        console.error('Delete service error:', error);
        showNotification('Error de conexión. Inténtelo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

async function bookService(serviceId) {
    if (!currentUser || currentUser.role !== 'CUSTOMER') {
        showNotification('Debes estar registrado como cliente para reservar servicios', 'error');
        return;
    }
    
    const bookingDate = prompt('Ingresa la fecha y hora deseada (YYYY-MM-DD HH:MM):');
    if (!bookingDate) {
        return;
    }
    
    showLoading(true);
    
    const bookingData = {
        serviceId: serviceId,
        scheduledDate: bookingDate,
        notes: 'Reserva realizada desde la aplicación web'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            showNotification('Servicio reservado exitosamente', 'success');
        } else {
            const error = await response.text();
            showNotification('Error al reservar servicio: ' + error, 'error');
        }
    } catch (error) {
        console.error('Book service error:', error);
        showNotification('Error de conexión. Inténtelo de nuevo.', 'error');
    } finally {
        showLoading(false);
    }
}

// Profile functions
function loadUserProfile() {
    if (!currentUser) {
        return;
    }
    
    const profileDetails = document.getElementById('profileDetails');
    profileDetails.innerHTML = `
        <div class="profile-detail">
            <strong>Nombre:</strong> ${currentUser.firstName} ${currentUser.lastName}
        </div>
        <div class="profile-detail">
            <strong>Email:</strong> ${currentUser.email}
        </div>
        <div class="profile-detail">
            <strong>Teléfono:</strong> ${currentUser.phoneNumber || 'No especificado'}
        </div>
        <div class="profile-detail">
            <strong>Rol:</strong> ${getRoleDisplay(currentUser.role)}
        </div>
        <div class="profile-detail">
            <strong>Dirección:</strong> ${currentUser.address || 'No especificada'}
        </div>
        <div class="profile-detail">
            <strong>Ciudad:</strong> ${currentUser.city || 'No especificada'}
        </div>
        <div class="profile-detail">
            <strong>Estado:</strong> ${currentUser.state || 'No especificado'}
        </div>
        <div class="profile-detail">
            <strong>Código Postal:</strong> ${currentUser.zipCode || 'No especificado'}
        </div>
        ${currentUser.role === 'SERVICE_PROVIDER' ? `
            <div class="profile-detail">
                <strong>Empresa:</strong> ${currentUser.companyName || 'No especificada'}
            </div>
            <div class="profile-detail">
                <strong>Experiencia:</strong> ${currentUser.experience || 0} años
            </div>
            <div class="profile-detail">
                <strong>Descripción:</strong> ${currentUser.description || 'No especificada'}
            </div>
        ` : ''}
    `;
}

// Utility functions
function getServiceTypeDisplay(type) {
    const types = {
        'BASIC_CLEANING': 'Limpieza Básica',
        'DEEP_CLEANING': 'Limpieza Profunda',
        'CARPET_CLEANING': 'Limpieza de Alfombras',
        'WINDOW_CLEANING': 'Limpieza de Ventanas',
        'OFFICE_CLEANING': 'Limpieza de Oficinas'
    };
    return types[type] || type;
}

function getRoleDisplay(role) {
    const roles = {
        'CUSTOMER': 'Cliente',
        'SERVICE_PROVIDER': 'Proveedor de Servicios',
        'ADMIN': 'Administrador'
    };
    return roles[role] || role;
}

function showNotification(message, type = 'info') {
    const notificationsContainer = document.getElementById('notifications');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notificationsContainer.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (show) {
        loadingSpinner.style.display = 'flex';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

// API utility functions
function makeAuthenticatedRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return fetch(url, {
        ...options,
        headers
    });
}

// Initialize tooltips and other UI enhancements
function initializeUIEnhancements() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e1e5e9';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos', 'error');
            }
        });
    });
}

// Call UI enhancements after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUIEnhancements);