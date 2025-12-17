const form = document.getElementById("recipeForm")
const recipesContainer = document.getElementById("recipes");

async function loadRecipes() {
    const response = await fetch('/recipes');
    const recipes = await response.json();
    
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const item = document.createElement("p");
        item.textContent = `Recipe for ${recipe.name}: ${recipe.recipe} from (${recipe.nationality})`;
        recipesContainer.appendChild(item);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.elements.name.value;
    const recipe = form.elements.recipe.value;
    const nationality = form.elements.nationality.value;

    await fetch('/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, recipe, nationality })
    });

    form.reset();
    await loadRecipes(); 
});

loadRecipes();
