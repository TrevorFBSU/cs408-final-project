// frontend/js/add.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-recipe-form");
  const messageEl = document.getElementById("form-message");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    messageEl.textContent = "";

    // Grab values from the form
    const name = sanitizeText(document.getElementById("recipe-name").value);
    const category = sanitizeText(document.getElementById("recipe-category").value);
    // const imageUrl = sanitizeText(document.getElementById("image-url").value);
    const fileInput = document.getElementById("image-file");
    let imageBase64 = "";

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.size > 2_000_000) { // 2mb limit
        messageEl.textContent = "Image must be under 2 MB.";
        return;
      }

      imageBase64 = await compressImage(file);

    }

    const ingredientsRaw = document.getElementById("ingredients").value;
    const stepsRaw = document.getElementById("steps").value;
    const notes = sanitizeText(document.getElementById("notes").value);

    // Very basic front-end validation
    if (!name || !category || !ingredientsRaw.trim() || !stepsRaw.trim()) {
      messageEl.textContent = "Please fill in all required fields.";
      return;
    }

    // Convert multi-line textareas into arrays
    const ingredients = ingredientsRaw
      .split("\n")
      .map((line) => sanitizeText(line))
      .filter((line) => line.length > 0);

    const steps = stepsRaw
      .split("\n")
      .map((line) => sanitizeText(line))
      .filter((line) => line.length > 0);

    const payload = {
      name,
      category,
      imageBase64,
      ingredients,
      steps,
      notes
    };


    try {
      // POST /recipes (API Gateway -> Lambda -> DynamoDB)
      const created = await apiRequest("/recipes", {
        method: "POST",
        body: payload, // ✅ pass object, not JSON.stringify
      });



      console.log("Recipe created:", created);
      messageEl.textContent = "Recipe added successfully!";

      // Clear form
      form.reset();
    } catch (err) {
      console.error("Error adding recipe:", err);
      messageEl.textContent = "Error adding recipe. Please try again.";
    }
  });



  async function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        img.onload = () => {
          const canvas = document.createElement("canvas");

          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

});
