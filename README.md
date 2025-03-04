Photos Gallery
A responsive web-based photo gallery application built with HTML, CSS, and JavaScript. It allows users to view, favorite, and delete photos across multiple albums, with a lightbox feature for detailed image viewing and navigation.

Table of Contents
Overview
Features
Requirements
Installation
Usage
File Structure
Customization
Troubleshooting


#Overview
The Photos Gallery organizes and displays images in four albums: "All Photos," "Snapchat," "Favorites," and "Bin." Users can interact with images by favoriting them (adding to "Favorites") or deleting them (moving to "Bin") via a lightbox interface. The application supports multiple navigation methods and is optimized for both desktop and mobile devices.

#Features
Albums:
All Photos: Displays 12 images by default.
Snapchat: Contains 12 images specific to Snapchat content.
Favorites: Dynamically populated with favorited images.
Bin: Stores images deleted via the lightbox.
Lightbox:
Opens when an image is clicked, displaying it in full size.
Includes navigation arrows (prev/next), heart icon for favoriting, and trash icon for deletion.
Supports keyboard navigation (Arrow Left/Right, Escape to close) and touch swipe gestures on mobile.
Favoriting: Click the heart icon on an image to add it to "Favorites" or remove it if already favorited.
Deletion: Available only in the lightbox; moves images to the "Bin" album.
Responsive Design: Adapts to various screen sizes (requires styles.css for full effect).

#Requirements
A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
Local web server (optional, for testing with proper file paths; e.g., live-server via npm or VS Code extension).
Images placed in the img/ directory matching the paths specified in index.html.

#Installation
Clone or Download:
Clone this repository or download the files as a ZIP.

git clone <repository-url>
Directory Structure: Ensure your project folder contains:
index.html
script.js
styles.css (create this if not already present)
img/ (directory with all images referenced in index.html)
Add Images: Place your image files in the img/ directory, matching the names in index.html (e.g., photo1.webp, snap1.jpg, etc.), or update the src attributes in the HTML to match your file names.
Run Locally:
Open index.html directly in a browser (may have CORS issues with local images).
Alternatively, use a local server:
npx live-server
Or use a browser extension/server tool to serve the files.
Usage
Open the Gallery:
Launch index.html in a browser.
View Albums:
Scroll through "All Photos" (12 images) and "Snapchat" (12 images).
"Favorites" starts empty; "Bin" populates with deleted images.
Interact with Images:
Click an Image: Opens it in the lightbox.
Heart Icon: Click to favorite (adds to "Favorites") or unfavorite (removes from "Favorites").
Trash Icon (Lightbox): Deletes the image, moving it to "Bin."
Navigate in Lightbox:
Use prev/next arrows, Arrow Left/Right keys, or swipe left/right on touch devices.
Press Escape or click outside the image to close.
Manage Favorites and Bin:
Favorited images appear in "Favorites" and can be unfavorited from the gallery or lightbox.
Deleted images move to "Bin" and remain there until the page is refreshed.


#File Structure

photos-gallery/
├── img/
│   ├── photo1.webp
│   ├── photo2.jpg
│   ├── photo3.jpg
│   ├── photo4.jpeg
│   ├── photo5.jpg
│   ├── photo6.jpg
│   ├── photo7.jpg
│   ├── photo8.jpg
│   ├── photo9.jpg
│   ├── photo10.jpg
│   ├── snap1.jpg
│   ├── snap2.jpg
│   ├── snap3.jpg
│   ├── snap4.jpg
│   ├── snap5.jpg
│   ├── snap6.jpg
│   ├── snap7.jpg
│   ├── snap8.jpg
│   ├── snap9.jpg
│   ├── snap10.jpg
│   ├── snap11.jpg
│   ├── snap12.jpg
├── index.html       # Main HTML file with gallery structure
├── script.js        # JavaScript for interactivity
├── styles.css       # CSS for styling (not provided; customize as needed)
└── README.md        # This documentation


#Customization

Add More Images:
Edit index.html to add <div class="photo-container"> elements in the desired album’s gallery section.
Example:
<div class="photo-container">
    <img src="img/newphoto.jpg" alt="New Photo" loading="lazy">
    <span class="heart-icon" data-favorited="false"><i class="far fa-heart"></i></span>
</div>
Change Album Order:
Rearrange the <div class="album-section"> blocks in index.html.
  
Styling:
Modify styles.css to adjust layout, image sizes, icon positions, or lightbox appearance.
Example starter CSS:
.gallery-container { max-width: 1200px; margin: 0 auto; }
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.photo-container { position: relative; }
.heart-icon { position: absolute; top: 10px; right: 10px; cursor: pointer; }
.lightbox { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); }
.lightbox-content { max-width: 90%; max-height: 90%; margin: auto; }

Functionality:
Edit script.js to add features like restoring from "Bin," adding delete icons to the gallery, or changing navigation behavior.

#Troubleshooting
Images Not Loading:
Check that image paths in index.html match the files in img/.
Use a local server if opening index.html directly (e.g., file://) causes CORS issues.
Lightbox Not Working:
Ensure script.js is loaded correctly (check console for errors: F12 → Console).
Verify all image elements have unique src and alt attributes for proper matching.
Favoriting/Deletion Issues:
Confirm JavaScript console logs (e.g., "Toggling favorite", "Lightbox delete clicked") appear when interacting.
Refresh the page if dynamic updates (e.g., "Favorites" or "Bin") don’t reflect immediately.# Gallery
