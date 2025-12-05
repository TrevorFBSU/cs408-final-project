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
    const imageUrl = sanitizeText(document.getElementById("image-url").value);
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
      imageUrl,
      ingredients,
      steps,
      notes
    };

    try {
      // POST /recipes (API Gateway -> Lambda -> DynamoDB)
      const created = await apiRequest("/recipes", {
        method: "POST",
        body: JSON.stringify(payload),
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
});
