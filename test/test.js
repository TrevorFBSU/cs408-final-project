QUnit.module("utils.js", (hooks) => {
  let originalFetch;

  hooks.beforeEach(() => {
    // Save the real fetch so we can restore it after each test
    originalFetch = window.fetch;
  });

  hooks.afterEach(() => {
    window.fetch = originalFetch;
  });

  QUnit.test("sanitizeText escapes &, <, > and trims", (assert) => {
    const input = "  a&b <tag>  ";
    const out = window.sanitizeText(input);
    assert.equal(out, "a&amp;b &lt;tag&gt;");
  });

  QUnit.test("sanitizeText handles null/undefined safely", (assert) => {
    assert.equal(window.sanitizeText(null), "");
    assert.equal(window.sanitizeText(undefined), "");
  });

  QUnit.test("apiRequest uses GET by default", async (assert) => {
    assert.expect(3);

    window.fetch = async (url, options) => {
      assert.ok(url.includes("/recipes"), "URL includes path");
      assert.equal(options.method, "GET", "Default method is GET");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    const data = await window.apiRequest("/recipes");
    assert.deepEqual(data, { ok: true }, "Returns parsed JSON");
  });

  QUnit.test("apiRequest sets Content-Type only when body is provided", async (assert) => {
    assert.expect(2);

    window.fetch = async (_url, options) => {
      assert.notOk(options.headers["Content-Type"], "No Content-Type on GET without body");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    await window.apiRequest("/recipes", { method: "GET" });

    window.fetch = async (_url, options) => {
      assert.equal(options.headers["Content-Type"], "application/json", "Content-Type set when body exists");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    await window.apiRequest("/recipes", { method: "POST", body: { a: 1 } });
  });

  QUnit.test("apiRequest throws on non-2xx with message field", async (assert) => {
    assert.expect(1);

    window.fetch = async () => {
      return new Response(JSON.stringify({ message: "Nope" }), { status: 400 });
    };

    try {
      await window.apiRequest("/recipes");
      assert.ok(false, "Should not reach here");
    } catch (e) {
      assert.equal(e.message, "Nope", "Throws error message from backend");
    }
  });

  QUnit.module("view.js createRecipeCard", function (hooks) {
    hooks.beforeEach(() => {
        // reset fixture
        document.getElementById("qunit-fixture").innerHTML = "";
    });

    QUnit.test("createRecipeCard uses placeholder when imageUrl is missing", function (assert) {
        const recipe = {
        recipeId: "abc123",
        name: "No Image Recipe",
        category: "dinner",
        likes: 5,
        imageUrl: ""
        };

        const card = window.createRecipeCard(recipe);

        const img = card.querySelector("img.recipe-thumb");
        assert.ok(img, "image element exists");
        assert.ok(img.src.includes("img/placeholder.png"), "uses placeholder image");
    });

    QUnit.test("createRecipeCard renders title + meta text", function (assert) {
        const recipe = {
        recipeId: "xyz789",
        name: "Tacos",
        category: "lunch",
        likes: 2,
        imageUrl: "img/placeholder.png"
        };

        const card = window.createRecipeCard(recipe);

        const title = card.querySelector(".recipe-title");
        const meta = card.querySelector(".recipe-meta");

        assert.equal(title.textContent, "Tacos", "title renders");
        assert.ok(meta.textContent.includes("Category: lunch"), "category renders");
        assert.ok(meta.textContent.includes("Likes: 2"), "likes render");
    });

    QUnit.test("createRecipeCard link includes recipe id", function (assert) {
        const recipe = { recipeId: "id555", name: "Cake", category: "dessert", likes: 0 };

        const card = window.createRecipeCard(recipe);

        assert.ok(card.href.includes("recipe.html?id=id555"), "href contains encoded id");
    });
    });


    QUnit.module("recipe.js helpers", function () {
        QUnit.test("getRecipeImageSrc returns placeholder when empty/missing", function (assert) {
            assert.equal(window.getRecipeImageSrc(""), "img/placeholder.png");
            assert.equal(window.getRecipeImageSrc("   "), "img/placeholder.png");
            assert.equal(window.getRecipeImageSrc(null), "img/placeholder.png");
            assert.equal(window.getRecipeImageSrc(undefined), "img/placeholder.png");
        });

        QUnit.test("getRecipeImageSrc returns trimmed url when present", function (assert) {
            assert.equal(window.getRecipeImageSrc("  https://example.com/a.jpg  "), "https://example.com/a.jpg");
            assert.equal(window.getRecipeImageSrc("data:image/png;base64,abc"), "data:image/png;base64,abc");
            assert.equal(window.getRecipeImageSrc("uploads/pic.png"), "uploads/pic.png");
        });

        QUnit.test("formatLikes pluralization is correct", function (assert) {
            assert.equal(window.formatLikes(0), "0 likes");
            assert.equal(window.formatLikes(1), "1 like");
            assert.equal(window.formatLikes(2), "2 likes");
            assert.equal(window.formatLikes("5"), "5 likes");
        });
    });


});
