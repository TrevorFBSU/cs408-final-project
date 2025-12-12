// frontend/js/view.js

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("recipe-grid");
  const sortSelect = document.getElementById("sort-select");
  const categorySelect = document.getElementById("category-select");
  const searchInput = document.getElementById("search-input");
  const applyBtn = document.getElementById("apply-filters-btn");


  window.createRecipeCard = function createRecipeCard(recipe) {
    const recipeId = recipe?.recipeId;
    const safeName = sanitizeText(recipe?.name || "Untitled");
    const safeCategory = sanitizeText(recipe?.category || "uncategorized");
    const likes = Number(recipe?.likes || 0);

    const card = document.createElement("a");
    card.className = "recipe-card";
    card.href = recipeId ? `recipe.html?id=${encodeURIComponent(recipeId)}` : "#";
    card.setAttribute("aria-label", `Open recipe: ${safeName}`);

    const img = document.createElement("img");
    img.className = "recipe-thumb";

    const imgSrc =
      recipe?.imageUrl && String(recipe.imageUrl).trim() !== ""
        ? String(recipe.imageUrl).trim()
        : "img/placeholder.png";   // ✅ same placeholder path as recipe.js

    img.src = imgSrc;
    img.alt = recipe?.name ? `Image of ${recipe.name}` : "Recipe image";

    const title = document.createElement("p");
    title.className = "recipe-title";
    title.textContent = safeName;

    const meta = document.createElement("p");
    meta.className = "recipe-meta";
    meta.textContent = `Category: ${safeCategory} • Likes: ${likes}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);

    return card;
  };

  
  if (!grid) return;

  async function loadRecipes() {
    grid.innerHTML = "<p>Loading recipes...</p>";

    const sort = sortSelect?.value || "newest";
    const category = categorySelect?.value || "all";
    const search = (searchInput?.value || "").trim();

    const params = new URLSearchParams();
    if (sort) params.append("sort", sort);
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    const path = params.toString() ? `/recipes?${params.toString()}` : "/recipes";

    try {
      const recipes = await apiRequest(path);

      if (!Array.isArray(recipes) || recipes.length === 0) {
        grid.innerHTML = "<p>No recipes found.</p>";
        return;
      }

      grid.innerHTML = "";
      recipes.forEach((recipe) => {
        grid.appendChild(createRecipeCard(recipe));
      });
    } catch (err) {
      console.error("Error loading recipes:", err);
      grid.innerHTML = "<p>Failed to load recipes.</p>";
    }
  }

  


  applyBtn?.addEventListener("click", loadRecipes);

  // Optional: press Enter in search box to apply
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loadRecipes();
    }
  });

  loadRecipes();
});
