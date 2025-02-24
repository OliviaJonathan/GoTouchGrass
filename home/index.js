document.addEventListener("DOMContentLoaded", function() {
    const isAddPlantsPage = window.location.pathname.includes("add_plants.html");
    
    if (isAddPlantsPage) {
        loadSavedPlants();
    }

    // Setup identify button if it exists
    const identifyButton = document.getElementById("identify-button");
    if (identifyButton) {
        identifyButton.addEventListener("click", function() {
            const fileInput = document.getElementById("upload-image");
            const file = fileInput.files[0];
            if (!file) {
                alert("Please upload an image first!");
                return;
            }
            identifyPlant(file);
        });
    }
});


document.getElementById("identify-button").addEventListener("click", function () {
    const fileInput = document.getElementById("upload-image");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload an image first!");
        return;
    }

    identifyPlant(file);
});

async function identifyPlant(file) {
    console.log("Preparing image for API...");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async function () {
        const base64Image = reader.result.split(',')[1]; // Extract base64 data
        console.log("Base64 Image Data (First 100 chars):", base64Image.substring(0, 100));
    
        const apiKey = "QV0GK7zdEok9dVWzJecF2c3A5XkyYhfsgc3WG9xV7RLJBq06dq";
        const apiUrl = "https://plant.id/api/v3/identification?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,edible_parts,watering,common_uses,cultural_significance&language=en";

        const requestBody = {
            images: [base64Image],  // Send only the Base64 data
            latitude: 71,
            longitude: 42,
            similar_images: true,
        };

        console.log("📤 Sending API Request:", JSON.stringify(requestBody, null, 2));

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Api-Key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log("🌱 API Response:", result);
            console.log("🌱 Full API Response:", JSON.stringify(result, null, 2));

            // Extract the first suggestion (most probable plant match)
            const plantData = result?.result?.classification?.suggestions?.[0];

            if (plantData) {
                console.log("✅ Saving Plant to Local Storage:", plantData);
                localStorage.setItem("selectedPlant", JSON.stringify(plantData));
                window.location.href = "./flashcard.html";
            } else {
                console.error("❌ No plant suggestion found in API response.");
            }
            // No fallback strategy—if no plant is found, nothing happens.

        } catch (error) {
            console.error("❌ Error identifying plant:", error);
        }
    };
}

//dropdown button
const B = document.querySelectorAll('.dropdown-button');
const C = document.querySelectorAll('.dropdown-content');
const I = document.querySelectorAll('.dropdown-images');


// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



function MyFunction() {
    document.querySelector(".dropdown-content").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.dropdown-image');

    images.forEach(image => {
        image.addEventListener('click', function() {
            const targetId = image.dataset.targetId;
            const target = document.getElementById(targetId);

            if (target) {
                const clonedImage = this.cloneNode(true);
                target.innerHTML = ''; // Clear existing content
                target.appendChild(clonedImage);
            }
        });
    });
});