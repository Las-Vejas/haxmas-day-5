const form = document.getElementById("recipeForm")
const recipesContainer = document.getElementById("recipes");

async function loadRecipes() {
    const response = await fetch('/recipes');
    const recipes = await response.json();
    
    recipesContainer.innerHTML = '';
    recipes.forEach(recipe => {
        const item = document.createElement("p");
        item.innerHTML = `Dessert submitted by ${recipe.name}: <br>${recipe.recipe} from ${recipe.nationality}`;
        item.innerHTML += `<br>Instructions: ${recipe.instructions}`;
        recipesContainer.appendChild(item);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = form.elements.name.value;
    const recipe = form.elements.recipe.value;
    const nationality = form.elements.nationality.value;
    const instructions = form.elements.instructions.value || "None provided lol.";
    const password = form.elements.password.value;

    await fetch('/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, recipe, nationality, instructions, password })
    });

    form.reset();
    await loadRecipes(); 
});

loadRecipes();
