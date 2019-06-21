/**
|--------------------------------------------------
| 1) Init the store
| 2) Create generic function to generate UI for each change
| 3) Create action creators and use them
|--------------------------------------------------
*/

// 1)
const initialState = {
  recipes: [{ name: "Omelette" }],
  ingredients: [
    {
      recipe: "Omelette",
      name: "Egg",
      quantity: 2
    },
    {
      recipe: "Omelette",
      name: "Patience",
      quantity: 2000
    }
  ]
};

// 1)

const recipesReducer = (recipes = [], action) => {
  switch (action.type) {
    case "ADD_RECIPE":
      return recipes.concat({ name: action.name });

    default:
      return recipes;
  }
};

const ingredientsReducer = (ingredients = [], action) => {
  switch (action.type) {
    case "ADD_INGREDIENT":
      return ingredients.concat({
        recipe: action.recipe,
        name: action.name,
        quantity: action.quantity
      });

    default:
      return ingredients;
  }
};

const rootReducer = (state, action) => {
  return Object.assign({}, state, {
    recipes: recipesReducer(state.recipes, action),
    ingredients: ingredientsReducer(state.ingredients, action)
  });
};

// 1)
const store = Redux.createStore(rootReducer, initialState);
window.store = store;

function updateSelectUI() {
  // First, fill out the options:
  const recipesEl = document.querySelector("#recipe");
  while (recipesEl.firstChild) {
    recipesEl.removeChild(recipesEl.firstChild);
  }
  const option = document.createElement("option");
  option.value = "";
  option.innerText = "Select an option";
  recipesEl.appendChild(option);
  store.getState().recipes.forEach(recipe => {
    const option = document.createElement("option");
    option.value = recipe.name;
    option.innerText = recipe.name;
    recipesEl.appendChild(option);
  });
}

/**
 * 2)
 * Magic without JQuery, sry.
 */
function updateUI() {
  const bodyEl = document.querySelector("body");

  updateSelectUI();
  // If it's first render, don't do nothing
  if (document.querySelector("#app")) {
    bodyEl.removeChild(document.querySelector("#app"));
  }

  const container = document.createElement("div");
  container.id = "app";
  let currentState = store.getState();
  const recipes = document.createElement("ul");

  currentState.recipes.forEach(recipe => {
    const recipeEl = document.createElement("li");
    recipeEl.innerText = recipe.name;
    recipes.appendChild(recipeEl);

    const ingredients = document.createElement("ul");
    currentState.ingredients
      .filter(entry => entry.recipe === recipe.name)
      .forEach(ingredient => {
        const ingredientEl = document.createElement("li");
        ingredientEl.innerText = `${ingredient.name} - ${ingredient.quantity}`;
        ingredients.appendChild(ingredientEl);
      });
    recipes.appendChild(ingredients);
  });
  container.appendChild(recipes);
  bodyEl.appendChild(container);
}

// 2) first update
updateUI();
store.subscribe(updateUI);

// 3)
const addRecipe = name => ({
  type: "ADD_RECIPE",
  name
});
const addIngredient = (name, quantity, recipe) => ({
  type: "ADD_INGREDIENT",
  recipe,
  name,
  quantity
});

// 3)
document.querySelector("#form_new_recipe").addEventListener("submit", e => {
  e.preventDefault();
  const { value } = e.target[0];
  store.dispatch(addRecipe(value));
});
document.querySelector("#form_new_ingredient").addEventListener("submit", e => {
  e.preventDefault();
  const [{ value: name }, { value: quantity }, { value: recipe }] = e.target;
  store.dispatch(addIngredient(name, quantity, recipe));
});
