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
let galleryImages = document.querySelectorAll(".gallery img");
let currentIndex = 0;

// Update lightbox content
function updateLightbox() {
    console.log("Updating lightbox for index:", currentIndex);
    if (!galleryImages.length) {
        console.error("No images found in galleryImages");
        closeLightbox();
        return;
    }
    currentIndex = Math.max(0, Math.min(currentIndex, galleryImages.length - 1));
    const img = galleryImages[currentIndex];
    console.log("Setting lightbox image to:", img.src);
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
    console.log("Showing lightbox for index:", index);
    currentIndex = index;
    updateLightbox();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Close lightbox
function closeLightbox() {
    console.log("Closing lightbox");
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
}

// Navigate through images
function navigate(step) {
    console.log("Navigating by step:", step);
    currentIndex = (currentIndex + step + galleryImages.length) % galleryImages.length;
    updateLightbox();
}

// Update gallery images and reattach listeners
function updateGalleryImages() {
    console.log("Updating gallery images");
    galleryImages = document.querySelectorAll("#all-photos-gallery img, #favorites-gallery img, #snapchat-gallery img, #bin-gallery img");
    reattachImageListeners();
}

// Reattach image click listeners
function reattachImageListeners() {
    console.log("Reattaching image listeners, total images:", galleryImages.length);
    galleryImages.forEach((img, index) => {
        img.removeEventListener("click", handleImageClick);
        img.addEventListener("click", handleImageClick);
    });
}

function handleImageClick(event) {
    const index = Array.from(galleryImages).indexOf(event.target);
    console.log("Image clicked, index:", index);
    if (index !== -1) {
        showLightbox(index);
    } else {
        console.error("Clicked image not found in galleryImages");
    }
}

// Get original heart icon (for All Photos and Snapchat)
function getOriginalHeart(img) {
    const allPhotosContainers = allPhotosGallery.querySelectorAll(".photo-container");
    const snapchatContainers = snapchatGallery.querySelectorAll(".photo-container");
    
    // Check All Photos
    for (let container of allPhotosContainers) {
        const containerImg = container.querySelector("img");
        if (containerImg && containerImg.src === img.src && containerImg.alt === img.alt) {
            return container.querySelector(".heart-icon");
        }
    }
    
    // Check Snapchat
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
    console.log("Toggling favorite for heart:", heart);
    const photoContainer = heart.parentElement;
    const img = photoContainer.querySelector("img");
    const isFavorited = heart.getAttribute("data-favorited") === "true";

    if (!isFavorited) {
        console.log("Favoriting image:", img.src);
        heart.setAttribute("data-favorited", "true");
        heart.classList.add("favorited");
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        const newPhotoContainer = photoContainer.cloneNode(true);
        newPhotoContainer.querySelector(".heart-icon").remove();
        favoritesGallery.appendChild(newPhotoContainer);
    } else {
        console.log("Unfavoriting image:", img.src);
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

// Delete image and move to bin (used only by lightbox)
function deleteImage(container) {
    console.log("Deleting image from container:", container);
    const img = container.querySelector("img");
    const newPhotoContainer = document.createElement("div");
    newPhotoContainer.className = "photo-container";
    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.alt = img.alt;
    newImg.loading = "lazy";
    newPhotoContainer.appendChild(newImg);
    binGallery.appendChild(newPhotoContainer);
    
    // Remove from Favorites if present
    const favoritesImages = favoritesGallery.querySelectorAll("img");
    favoritesImages.forEach((favImg) => {
        if (favImg.src === img.src && favImg.alt === img.alt) {
            favImg.parentElement.remove();
        }
    });
    
    // Remove from original album (All Photos or Snapchat)
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

// Initial setup
updateGalleryImages();

// Heart icon functionality (All Photos and Snapchat)
const heartIcons = document.querySelectorAll("#all-photos-gallery .heart-icon, #snapchat-gallery .heart-icon");
heartIcons.forEach((heart) => {
    heart.addEventListener("click", (e) => {
        console.log("Heart icon clicked in gallery");
        e.stopPropagation();
        toggleFavorite(heart);
    });
});

// Lightbox heart functionality
lightboxHeart.addEventListener("click", (e) => {
    console.log("Lightbox heart clicked");
    e.stopPropagation();
    const originalHeart = getOriginalHeart(galleryImages[currentIndex]);
    if (originalHeart) {
        toggleFavorite(originalHeart);
    }
});

// Lightbox delete functionality (for All Photos and Snapchat)
lightboxDelete.addEventListener("click", (e) => {
    console.log("Lightbox delete clicked");
    e.stopPropagation();
    const allPhotosContainers = allPhotosGallery.querySelectorAll(".photo-container");
    const snapchatContainers = snapchatGallery.querySelectorAll(".photo-container");
    let originalContainer;

    // Find the original container in All Photos or Snapchat
    Array.from(allPhotosContainers).concat(Array.from(snapchatContainers)).forEach((container) => {
        const img = container.querySelector("img");
        if (img && img.src === galleryImages[currentIndex].src && img.alt === galleryImages[currentIndex].alt) {
            originalContainer = container;
        }
    });

    if (originalContainer) {
        deleteImage(originalContainer);
    }
});

// Close button listener
closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Navigation listeners
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
});

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
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    console.log("Touch start at X:", touchStartX);
});

lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    console.log("Touch end at X:", touchEndX);
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX - touchEndX;
    console.log("Swipe distance:", swipeDistance);
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            console.log("Swiping left, navigating to next");
            navigate(1); // Swipe left, go to next
        } else {
            console.log("Swiping right, navigating to previous");
            navigate(-1); // Swipe right, go to previous
        }
    }
}