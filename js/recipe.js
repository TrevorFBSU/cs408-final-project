// frontend/js/recipe.js

document.addEventListener("DOMContentLoaded", () => {

  // --- testable helpers (keep simple) ---
  const PLACEHOLDER_IMG = "img/placeholder.png";

  function getRecipeImageSrc(imageUrl) {
    const raw = String(imageUrl || "").trim();
    return raw.length > 0 ? raw : PLACEHOLDER_IMG;
  }

  function formatLikes(likes) {
    const n = Number(likes || 0);
    return `${n} like${n === 1 ? "" : "s"}`;
  }

  // expose for QUnit (no new files needed)
  window.getRecipeImageSrc = getRecipeImageSrc;
  window.formatLikes = formatLikes;



  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const likedKey = `liked_recipe_${id}`;


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
      likeCountEl.textContent = formatLikes(likes);


      // Image
      const imgSrc = getRecipeImageSrc(recipe.imageUrl);

      imageEl.src = imgSrc;
      imageEl.alt = `Image of ${safeName}`;
      imageCaptionEl.textContent = safeName;
      imageEl.style.display = "block";


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


  const deleteBtn = document.getElementById("delete-button");

  if (deleteBtn && id) {
    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this recipe?");
      if (!confirmDelete) return;

      try {
        deleteBtn.disabled = true;

        // IMPORTANT: method is the 2nd argument
        await apiRequest(`/recipes/${encodeURIComponent(id)}`, { method: "DELETE" });


        alert("Recipe deleted successfully!");
        window.location.href = "view.html";
      } catch (err) {
        console.error("Delete failed:", err);
        alert(`Failed to delete recipe: ${err.message || err}`);
      } finally {
        deleteBtn.disabled = false;
      }
    });
  }



  const likeBtn = document.getElementById("like-button");

if (likeBtn && id) {
  const likedKey = `liked_recipe_${id}`;

  // ✅ If already liked on this browser, lock it
  if (localStorage.getItem(likedKey) === "true") {
    likeBtn.disabled = true;
    likeBtn.textContent = "❤️ Liked";
  }

  let likeInProgress = false;

  likeBtn.addEventListener("click", async () => {
    // ✅ hard stop: can’t like again once liked
    if (localStorage.getItem(likedKey) === "true") return;
    if (likeInProgress) return;

    try {
      likeInProgress = true;
      likeBtn.disabled = true;

      const updated = apiRequest(`/recipes/${encodeURIComponent(id)}/like`, { method: "POST" })


      const likes = updated.likes || 0;
      likeCountEl.textContent = `${likes} like${likes === 1 ? "" : "s"}`;

      // ✅ mark as liked permanently (for this browser)
      localStorage.setItem(likedKey, "true");
      likeBtn.textContent = "❤️ Liked";
    } catch (err) {
      console.error("Like failed:", err);
      alert("Failed to like recipe");
      likeBtn.disabled = false; // re-enable only if it failed
    } finally {
      likeInProgress = false;
    }
  });
}



});
