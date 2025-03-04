// Select elements
const allPhotosGallery = document.getElementById("all-photos-gallery");
const favoritesGallery = document.getElementById("favorites-gallery");
const snapchatGallery = document.getElementById("snapchat-gallery");
const binGallery = document.getElementById("bin-gallery");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-image");
const caption = document.querySelector(".caption");
const lightboxHeart = document.querySelector(".lightbox-heart");
const lightboxDelete = document.querySelector(".lightbox-delete");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let galleryImages = [];
let currentIndex = 0;

// Debounce function to limit frequent calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Ensure DOM is loaded before running initial setup
document.addEventListener("DOMContentLoaded", () => {
    updateGalleryImages();
    initializeHeartIcons();
});

// Update lightbox content
function updateLightbox() {
    if (!galleryImages.length) {
        console.error("No images found in galleryImages");
        closeLightbox();
        return;
    }
    currentIndex = Math.max(0, Math.min(currentIndex, galleryImages.length - 1));
    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    caption.textContent = img.alt;
    const originalHeart = getOriginalHeart(img);
    const isFavorited = originalHeart ? originalHeart.getAttribute("data-favorited") === "true" : false;
    lightboxHeart.setAttribute("data-favorited", isFavorited);
    lightboxHeart.classList.toggle("favorited", isFavorited);
    lightboxHeart.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
        lightboxImg.style.opacity = "1";
    }, 150);
}

// Show lightbox
function showLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Close lightbox
function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

// Navigate through images
function navigate(step) {
    currentIndex = (currentIndex + step + galleryImages.length) % galleryImages.length;
    updateLightbox();
}

// Update gallery images and reattach listeners (debounced)
const debouncedUpdateGalleryImages = debounce(() => {
    galleryImages = document.querySelectorAll("#all-photos-gallery img, #favorites-gallery img, #snapchat-gallery img, #bin-gallery img");
    reattachImageListeners();
}, 250);

function updateGalleryImages() {
    debouncedUpdateGalleryImages();
}

// Reattach image click listeners
function reattachImageListeners() {
    galleryImages.forEach((img) => {
        img.removeEventListener("click", handleImageClick);
        img.addEventListener("click", handleImageClick, { passive: true }); // Passive for better scroll performance
    });
}

function handleImageClick(event) {
    const index = Array.from(galleryImages).indexOf(event.target);
    if (index !== -1) {
        showLightbox(index);
    }
}

// Get original heart icon (for All Photos and Snapchat)
function getOriginalHeart(img) {
    const allPhotosContainers = allPhotosGallery.querySelectorAll(".photo-container");
    const snapchatContainers = snapchatGallery.querySelectorAll(".photo-container");
    
    for (let container of allPhotosContainers) {
        const containerImg = container.querySelector("img");
        if (containerImg && containerImg.src === img.src && containerImg.alt === img.alt) {
            return container.querySelector(".heart-icon");
        }
    }
    
    for (let container of snapchatContainers) {
        const containerImg = container.querySelector("img");
        if (containerImg && containerImg.src === img.src && containerImg.alt === img.alt) {
            return container.querySelector(".heart-icon");
        }
    }
    
    return null;
}

// Toggle favorite state
function toggleFavorite(heart) {
    const photoContainer = heart.parentElement;
    const img = photoContainer.querySelector("img");
    const isFavorited = heart.getAttribute("data-favorited") === "true";

    if (!isFavorited) {
        heart.setAttribute("data-favorited", "true");
        heart.classList.add("favorited");
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        const newPhotoContainer = photoContainer.cloneNode(true);
        newPhotoContainer.querySelector(".heart-icon").remove();
        favoritesGallery.appendChild(newPhotoContainer);
    } else {
        heart.setAttribute("data-favorited", "false");
        heart.classList.remove("favorited");
        heart.innerHTML = '<i class="far fa-heart"></i>';
        const favoritesImages = favoritesGallery.querySelectorAll("img");
        favoritesImages.forEach((favImg) => {
            if (favImg.src === img.src && favImg.alt === img.alt) {
                favImg.parentElement.remove();
            }
        });
    }
    updateGalleryImages();
    if (lightbox.style.display === "flex") updateLightbox();
}

// Delete image and move to bin
function deleteImage(container) {
    const img = container.querySelector("img");
    const newPhotoContainer = document.createElement("div");
    newPhotoContainer.className = "photo-container";
    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.alt = img.alt;
    newImg.loading = "lazy";
    newPhotoContainer.appendChild(newImg);
    binGallery.appendChild(newPhotoContainer);
    
    const favoritesImages = favoritesGallery.querySelectorAll("img");
    favoritesImages.forEach((favImg) => {
        if (favImg.src === img.src && favImg.alt === img.alt) {
            favImg.parentElement.remove();
        }
    });
    
    container.remove();
    updateGalleryImages();
    if (lightbox.style.display === "flex") {
        if (galleryImages.length === 0) {
            closeLightbox();
        } else {
            updateLightbox();
        }
    }
}

// Initialize heart icons
function initializeHeartIcons() {
    const heartIcons = document.querySelectorAll("#all-photos-gallery .heart-icon, #snapchat-gallery .heart-icon");
    heartIcons.forEach((heart) => {
        heart.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(heart);
        }, { passive: true });
    });
}

// Lightbox heart functionality
lightboxHeart.addEventListener("click", (e) => {
    e.stopPropagation();
    const originalHeart = getOriginalHeart(galleryImages[currentIndex]);
    if (originalHeart) {
        toggleFavorite(originalHeart);
    }
}, { passive: true });

// Lightbox delete functionality
lightboxDelete.addEventListener("click", (e) => {
    e.stopPropagation();
    const allPhotosContainers = allPhotosGallery.querySelectorAll(".photo-container");
    const snapchatContainers = snapchatGallery.querySelectorAll(".photo-container");
    let originalContainer;

    Array.from(allPhotosContainers).concat(Array.from(snapchatContainers)).forEach((container) => {
        const img = container.querySelector("img");
        if (img && img.src === galleryImages[currentIndex].src && img.alt === galleryImages[currentIndex].alt) {
            originalContainer = container;
        }
    });

    if (originalContainer) {
        deleteImage(originalContainer);
    }
}, { passive: true });

// Close button listener
closeBtn.addEventListener("click", closeLightbox, { passive: true });
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
}, { passive: true });

// Navigation listeners
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
}, { passive: true });

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
}, { passive: true });

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            navigate(-1);
        } else if (e.key === "ArrowRight") {
            navigate(1);
        }
    }
}, { passive: true });

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            navigate(1);
        } else {
            navigate(-1);
        }
    }
}