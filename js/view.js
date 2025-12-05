// frontend/js/view.js

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("recipe-grid");
  const sortSelect = document.getElementById("sort-select");
  const categorySelect = document.getElementById("category-select");
  const searchInput = document.getElementById("search-input");
  const applyBtn = document.getElementById("apply-filters-btn");

  async function loadRecipes() {
    grid.innerHTML = "<p>Loading recipes...</p>";

    const sort = sortSelect.value || "newest";
    const category = categorySelect.value || "all";
    const search = searchInput.value.trim();

    const params = new URLSearchParams();
    if (sort) params.append("sort", sort);
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    const path = params.toString()
      ? `/recipes?${params.toString()}`
      : "/recipes";

    try {
      const recipes = await apiRequest(path);

      if (!recipes.length) {
        grid.innerHTML = "<p>No recipes found.</p>";
        return;
      }

      grid.innerHTML = "";
      recipes.forEach((recipe) => {
        const card = createRecipeCard(recipe);
        grid.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading recipes:", err);
      grid.innerHTML = "<p>Failed to load recipes.</p>";
    }
  }

  function createRecipeCard(recipe) {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.className = "recipe-card-image";
    img.src = recipe.imageUrl || "";
    img.alt = recipe.name ? `Image of ${recipe.name}` : "Recipe image";

    const title = document.createElement("h3");
    title.textContent = recipe.name || "Untitled recipe";

    const meta = document.createElement("p");
    const category = recipe.category || "uncategorized";
    const likes = recipe.likes || 0;
    meta.textContent = `Category: ${category} • Likes: ${likes}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);

    // Click card to go to recipe.html?id=...
    card.addEventListener("click", () => {
      if (!recipe.recipeId) return;
      const url = `recipe.html?id=${encodeURIComponent(recipe.recipeId)}`;
      window.location.href = url;
    });

    return card;
  }

  applyBtn.addEventListener("click", () => {
    loadRecipes();
  });

  // Load on initial page load
  loadRecipes();
});
