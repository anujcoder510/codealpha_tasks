
const searchInput = document.querySelector("#searchInput");
const photoCards = document.querySelectorAll(".photo_card");
const filterButtons = document.querySelectorAll(".filter button");

// Lightbox elements
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const closeLightbox = document.querySelector("#closeLightbox");
const prevImage = document.querySelector("#prevImage");
const nextImage = document.querySelector("#nextImage");

const noResults = document.querySelector("#noResults");

let selectedCategory = "All";
let currentIndex = 0;
let visibleCards = [];

// FILTER PHOTOS
function filterPhotos() {
    const searchText = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    photoCards.forEach(function (card) {
        const photoName =
            card.querySelector("h3").textContent.toLowerCase();

        const category = card.dataset.category;

        const matchesSearch = photoName.includes(searchText);
        const matchesCategory =
            selectedCategory === "All" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.style.display =
        visibleCount === 0 ? "block" : "none";

    updateVisibleCards();
}

// SEARCH PHOTOS
searchInput.addEventListener("input", function () {
    filterPhotos();
});

// CATEGORY FILTER
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterPhotos();
    });
});

// GET VISIBLE PHOTOS
function updateVisibleCards() {
    visibleCards = Array.from(photoCards).filter(function (card) {
        return card.style.display !== "none";
    });
}

// SHOW CURRENT IMAGE
function showImage() {
    if (visibleCards.length === 0) return;

    const card = visibleCards[currentIndex];
    const image = card.querySelector("img");
    const title = card.querySelector("h3");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = title.textContent;
}

// OPEN LIGHTBOX
function openLightbox(index) {
    updateVisibleCards();

    if (visibleCards.length === 0) return;

    currentIndex = index;
    showImage();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeLightbox.focus();
}

// CLICK IMAGE TO OPEN
photoCards.forEach(function (card) {
    card.querySelector("img").addEventListener("click", function () {
        updateVisibleCards();

        const index = visibleCards.indexOf(card);

        if (index !== -1) {
            openLightbox(index);
        }
    });
});

// CLOSE LIGHTBOX
function closePreview() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

closeLightbox.addEventListener("click", closePreview);

// NEXT IMAGE
nextImage.addEventListener("click", function () {
    if (visibleCards.length === 0) return;

    currentIndex = (currentIndex + 1) % visibleCards.length;
    showImage();
});

// PREVIOUS IMAGE
prevImage.addEventListener("click", function () {
    if (visibleCards.length === 0) return;

    currentIndex =
        (currentIndex - 1 + visibleCards.length) % visibleCards.length;

    showImage();
});

// CLICK OUTSIDE IMAGE TO CLOSE
lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closePreview();
    }
});

// KEYBOARD CONTROLS
document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") {
        closePreview();
    } else if (event.key === "ArrowRight") {
        nextImage.click();
    } else if (event.key === "ArrowLeft") {
        prevImage.click();
    }
});

// INITIALIZE
filterPhotos();
