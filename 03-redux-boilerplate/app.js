/**
|--------------------------------------------------
| 1) Init the store
| 2) Create generic function to generate UI for each change
| 3) Create action creators and use them
|--------------------------------------------------
*/

import { createStore } from "redux";

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
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_RECIPE":
      return Object.assign({}, state, {
        recipes: state.recipes.concat({ name: action.name })
      });
    case "ADD_INGREDIENT":
      return Object.assign({}, state, {
        ingredients: state.ingredients.concat({
          recipe: action.recipe,
          name: action.name,
          quantity: action.quantity
        })
      });
    case "REMOVE_INGREDIENT":
      return state;
    case "REMOVE_RECIPE":
      return state;
    default:
      return state;
  }
};

// 1)
const store = createStore(reducer, initialState);
window.store = store;

/**
 * 2)
 * Magic without JQuery, sry.
 */
function updateUI() {
  const bodyEl = document.querySelector("body");

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
