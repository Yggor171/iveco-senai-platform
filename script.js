// Global state
let currentUser = null;
let currentPage = 'home';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeLucide();
    initializeEventListeners();
    updateAuthState();
    checkUrlHash();
});

function initializeLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Login buttons
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');

    if (loginBtn) loginBtn.addEventListener('click', () => showAuthModal());
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => showAuthModal());
    if (closeAuthModal) closeAuthModal.addEventListener('click', () => hideAuthModal());
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) hideAuthModal();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                showPage(page);
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });

    // Auth forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Password toggle
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            initializeLucide();
        });
    });

    // Hash change listener for browser navigation
    window.addEventListener('hashchange', checkUrlHash);
}

function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentPage) {
        showPage(hash);
    }
}

function showPage(pageId) {
    // Check if page requires authentication
    const page = document.getElementById(pageId);
    if (!page) return;

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    // Show selected page
    page.classList.add('active');
    currentPage = pageId;

    // Update URL hash
    window.location.hash = pageId;

    // Update navigation active state
    updateNavigation(pageId);

    // Check if user is authenticated for protected pages
    if (page.classList.contains('protected') && !currentUser) {
        showAuthModal();
        return;
    }

    // Initialize page-specific functionality
    initializePageContent(pageId);
}

function updateNavigation(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === activePageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Simulate API call - replace with actual API call in production
        if (username && password) {
            // Mock successful login
            currentUser = {
                id: '1',
                username: username,
                name: 'Usuário Teste',
                email: 'usuario@teste.com'
            };
            
            updateAuthState();
            hideAuthModal();
            showNotification('Login realizado com sucesso!', 'success');
            
            // Clear form
            document.getElementById('loginForm').reset();
        } else {
            throw new Error('Por favor, preencha todos os campos');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        username: document.getElementById('registerUsername').value,
        company: document.getElementById('registerCompany').value,
        cnpj: document.getElementById('registerCnpj').value,
        password: document.getElementById('registerPassword').value
    };

    try {
        // Simulate API call - replace with actual API call in production
        if (formData.name && formData.email && formData.username && formData.password) {
            // Mock successful registration
            currentUser = {
                id: '1',
                username: formData.username,
                name: formData.name,
                email: formData.email
            };
            
            updateAuthState();
            hideAuthModal();
            showNotification('Conta criada com sucesso!', 'success');
            
            // Clear form
            document.getElementById('registerForm').reset();
        } else {
            throw new Error('Por favor, preencha todos os campos obrigatórios');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function handleLogout() {
    currentUser = null;
    updateAuthState();
    showNotification('Logout realizado com sucesso!', 'success');
    showPage('home');
}

function updateAuthState() {
    const loginBtn = document.getElementById('loginBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const searchBox = document.getElementById('searchBox');
    const notificationBtn = document.getElementById('notificationBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');

    if (currentUser) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
        if (searchBox) searchBox.style.display = 'flex';
        if (notificationBtn) notificationBtn.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = currentUser.name;

        // Show protected navigation items
        const protectedLinks = document.querySelectorAll('.protected');
        protectedLinks.forEach(link => link.style.display = 'block');
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'block';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
        if (searchBox) searchBox.style.display = 'none';
        if (notificationBtn) notificationBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'none';

        // Hide protected navigation items
        const protectedLinks = document.querySelectorAll('.protected');
        protectedLinks.forEach(link => link.style.display = 'none');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 3000;
                min-width: 300px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #dc2626;
                color: white;
            }
            
            .notification-info {
                background: #2563eb;
                color: white;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.25rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

function initializePageContent(pageId) {
    switch(pageId) {
        case 'tracking':
            initializeTrackingPage();
            break;
        case 'suppliers':
            initializeSuppliersPage();
            break;
        case 'reports':
            initializeReportsPage();
            break;
        case 'ranking':
            initializeRankingPage();
            break;
        case 'contact':
            initializeContactPage();
            break;
    }
}

function initializeTrackingPage() {
    // Initialize map if Leaflet is available
    if (typeof L !== 'undefined') {
        const mapContainer = document.getElementById('truckMap');
        if (mapContainer && !mapContainer._leaflet_id) {
            const map = L.map('truckMap').setView([-23.5505, -46.6333], 10); // São Paulo coordinates
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add sample truck markers
            const trucks = [
                { lat: -23.5505, lng: -46.6333, name: 'Caminhão SP-001', status: 'online' },
                { lat: -23.5825, lng: -46.6825, name: 'Caminhão SP-002', status: 'stopped' },
                { lat: -23.5205, lng: -46.6133, name: 'Caminhão SP-003', status: 'online' }
            ];
            
            trucks.forEach(truck => {
                const icon = L.divIcon({
                    className: `truck-marker truck-${truck.status}`,
                    html: '🚛',
                    iconSize: [30, 30]
                });
                
                L.marker([truck.lat, truck.lng], { icon })
                    .bindPopup(`<strong>${truck.name}</strong><br>Status: ${truck.status}`)
                    .addTo(map);
            });
        }
    }
}

function initializeSuppliersPage() {
    // Initialize supplier form if it exists
    const supplierForm = document.getElementById('supplierForm');
    if (supplierForm) {
        supplierForm.addEventListener('submit', handleSupplierSubmit);
    }
}

function initializeReportsPage() {
    // Initialize file upload functionality
    const fileInput = document.getElementById('fileUpload');
    const uploadBtn = document.getElementById('uploadReportBtn');
    
    if (fileInput && uploadBtn) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function initializeRankingPage() {
    // Load and display supplier rankings
    loadSupplierRankings();
}

function initializeContactPage() {
    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleSupplierSubmit(e) {
    e.preventDefault();
    // Handle supplier form submission
    showNotification('Fornecedor cadastrado com sucesso!', 'success');
    e.target.reset();
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        showNotification(`Arquivo ${file.name} selecionado para upload!`, 'info');
        // Handle file upload logic here
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    showNotification('Mensagem enviada com sucesso!', 'success');
    e.target.reset();
}

function loadSupplierRankings() {
    // Mock supplier data
    const suppliers = [
        { id: 1, name: 'EcoTransport Ltda', co2: 120.5, score: 95, badge: 'Ouro' },
        { id: 2, name: 'GreenLogistics SA', co2: 145.2, score: 92, badge: 'Ouro' },
        { id: 3, name: 'SustainableCargo', co2: 178.8, score: 87, badge: 'Prata' }
    ];
    
    const rankingContainer = document.getElementById('supplierRankings');
    if (rankingContainer) {
        rankingContainer.innerHTML = suppliers.map((supplier, index) => `
            <tr>
                <td>${index + 1}º</td>
                <td>${supplier.name}</td>
                <td>${supplier.co2} kg</td>
                <td><span class="badge badge-${supplier.badge.toLowerCase()}">${supplier.badge}</span></td>
                <td>${supplier.score}/100</td>
            </tr>
        `).join('');
    }
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}