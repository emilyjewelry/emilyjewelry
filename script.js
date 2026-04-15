// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Helper to close mobile menu (reused by back handler)
function _closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            // Push history state so back button closes menu
            if (window.HistoryManager) HistoryManager.push('mobile-menu', { open: true });
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            _closeMobileMenu();
        }
    });

    // Back button closes mobile menu
    if (window.HistoryManager) {
        HistoryManager.onBack('mobile-menu', function () {
            _closeMobileMenu();
        });
    }
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in, .slide-up');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
});

// Product Search and Filter (for produk.html)
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const productsGrid = document.getElementById('productsGrid');

if (searchInput && categoryFilter && productsGrid) {
    const productCards = Array.from(productsGrid.getElementsByClassName('product-card'));

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productCategory = card.getAttribute('data-category');
            
            const matchesSearch = productName.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Track previous filter values for history
    var _prevCategory = categoryFilter.value;
    var _searchDebounceTimer = null;

    searchInput.addEventListener('input', function () {
        filterProducts();
        // Debounced history push for search
        clearTimeout(_searchDebounceTimer);
        _searchDebounceTimer = setTimeout(function () {
            if (window.HistoryManager && searchInput.value) {
                HistoryManager.push('product-search', { search: '', category: categoryFilter.value });
            }
        }, 500);
    });

    categoryFilter.addEventListener('change', function () {
        var oldCategory = _prevCategory;
        _prevCategory = categoryFilter.value;
        filterProducts();
        // Push history so back restores previous category
        if (window.HistoryManager) {
            HistoryManager.push('product-filter', { category: oldCategory, search: searchInput.value });
        }
    });

    // Back button restores previous product filter/search state
    if (window.HistoryManager) {
        HistoryManager.onBack('product-filter', function (data) {
            categoryFilter.value = data.category || 'all';
            searchInput.value = data.search || '';
            _prevCategory = categoryFilter.value;
            filterProducts();
        });
        HistoryManager.onBack('product-search', function (data) {
            searchInput.value = data.search || '';
            categoryFilter.value = data.category || 'all';
            _prevCategory = categoryFilter.value;
            filterProducts();
        });
    }
}

// Product Image Gallery (for detail-produk.html)
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');

if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image with fade effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.src.replace('150', '600');
                mainImage.style.opacity = '1';
            }, 200);
        });
    });
}

// Buy Now Button (for detail-produk.html)
function beliSekarang() {
    const productName = document.querySelector('.product-details-info h1').textContent;
    const productPrice = document.querySelector('.product-price').textContent;
    const message = `Halo, saya tertarik dengan ${productName} (${productPrice})`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Contact Form Handler (for kontak.html)
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value || '-';
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Simulate form submission (in real app, send to server)
        setTimeout(() => {
            // Show success message
            formMessage.textContent = 'Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.';
            formMessage.className = 'form-message success';
            
            // Reset form
            contactForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);

            // Optional: Send to WhatsApp
            const waMessage = `Pesan dari Website:%0A%0ANama: ${name}%0AEmail: ${email}%0APhone: ${phone}%0ASubjek: ${subject}%0APesan: ${message}`;
            console.log('WhatsApp URL:', `https://wa.me/6281234567890?text=${waMessage}`);
        }, 1000);
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add to cart animation (optional - for future enhancement)
function addToCart(productId) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = '✓ Produk ditambahkan ke keranjang';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Log page views (for analytics - optional)
console.log('Page loaded:', window.location.pathname);
console.log('TokoKu Website - Ready!');