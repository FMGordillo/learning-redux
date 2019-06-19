import { createStore } from "redux";

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

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_RECIPE":
      break;
    case "REMOVE_RECIPE":
      break;
    default:
      return state;
  }
};

const store = createStore(reducer, initialState);
window.store = store;

/**
 * @author FMGordillo <facundomgordillo@gmail.com>
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

// First update
updateUI();

store.subscribe(updateUI);
