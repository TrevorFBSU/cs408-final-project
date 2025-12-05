// frontend/js/recipe.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const titleEl = document.getElementById("recipe-title");
  const categoryValueEl = document.getElementById("recipe-category-value");
  const imageEl = document.getElementById("recipe-image");
  const imageCaptionEl = document.getElementById("recipe-image-caption");
  const ingredientsList = document.getElementById("ingredients-list");
  const stepsList = document.getElementById("steps-list");
  const notesText = document.getElementById("notes-text");
  const likeCountEl = document.getElementById("like-count");

  if (!id) {
    titleEl.textContent = "Recipe not found";
    return;
  }

  async function loadRecipe() {
    try {
      const recipe = await apiRequest(`/recipes/${encodeURIComponent(id)}`);

      const safeName = sanitizeText(recipe.name || "Untitled recipe");
      const safeCategory = sanitizeText(recipe.category || "uncategorized");
      const safeNotes = sanitizeText(recipe.notes || "No notes.");

      titleEl.textContent = safeName;
      categoryValueEl.textContent = safeCategory;

      const likes = recipe.likes || 0;
      likeCountEl.textContent = `${likes} like${likes === 1 ? "" : "s"}`;

      // Image
      if (recipe.imageUrl) {
        imageEl.src = recipe.imageUrl;
        imageEl.alt = `Image of ${safeName}`;
        imageCaptionEl.textContent = safeName;
        imageEl.style.display = "block";
      } else {
        imageEl.style.display = "none";
        imageCaptionEl.textContent = "No image available";
      }

      // Ingredients
      ingredientsList.innerHTML = "";
      (recipe.ingredients || []).forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = ing;
        ingredientsList.appendChild(li);
      });

      // Steps
      stepsList.innerHTML = "";
      (recipe.steps || []).forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
      });

      // Notes
      notesText.textContent = safeNotes;
    } catch (err) {
      console.error("Error loading recipe:", err);
      titleEl.textContent = "Failed to load recipe.";
    }
  }

  loadRecipe();
});
