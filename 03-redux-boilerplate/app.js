/**
|--------------------------------------------------
| First, let's set up:
| - initialState
| - Constants for the Actions
| - Reducers (and combine them)
| - Middlewares
| - Create the store 🏪
|--------------------------------------------------
*/

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

const ADD_RECIPE = "ADD_RECIPE";
const FETCH_RECIPES = "FETCH_RECIPES"; // loading: true
const SET_RECIPES = "SET_RECIPES"; // loading: false
const ADD_INGREDIENT = "ADD_INGREDIENT";
const FETCH_INGREDIENTS = "FETCH_INGREDIENTS"; // loading: true
const SET_INGREDIENTS = "SET_INGREDIENTS"; // loading: false

const recipesReducer = (recipes = [], action) => {
  switch (action.type) {
    case ADD_RECIPE:
      return recipes.concat({ name: action.name });
    case SET_RECIPES:
      return action.recipes;
    default:
      return recipes;
  }
};

const ingredientsReducer = (ingredients = [], action) => {
  switch (action.type) {
    case ADD_INGREDIENT:
      return ingredients.concat({
        recipe: action.recipe,
        name: action.name,
        quantity: action.quantity
      });
    case SET_INGREDIENTS:
      return action.ingredients;
    default:
      return ingredients;
  }
};

const rootReducer = Redux.combineReducers({
  recipes: recipesReducer,
  ingredients: ingredientsReducer
});

const apiMiddleware = ({ dispatch }) => next => action => {
  if (action.type === FETCH_RECIPES) {
    window.fetchData(
      "https://s3.amazonaws.com/500tech-shared/db.json",
      ({ data }) => dispatch(setRecipes(data.recipes))
    );
  }
  if (action.type === FETCH_INGREDIENTS) {
    window.fetchData(
      "https://s3.amazonaws.com/500tech-shared/db.json",
      ({ data }) => dispatch(setIngredients(data.ingredients))
    );
  }
  next(action);
};

const logMiddleware = () => next => action => {
  console.log(`Action: ${action.type}`);
  next(action);
};

const store = Redux.createStore(
  rootReducer,
  initialState,
  Redux.applyMiddleware(logMiddleware, apiMiddleware)
);
window.store = store;

/**
|--------------------------------------------------
| Then, we need to show this wonder to the world:
| - Create two functions to update certain parts
| - subscribe() to the changes in the state
|--------------------------------------------------
*/

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

updateUI();
updateSelectUI();
store.subscribe(updateSelectUI);
store.subscribe(updateUI);

/**
|--------------------------------------------------
| Now, we have to attach UI and the Actions
| - Make Action Creators
| - Attach them to dispatch()
|--------------------------------------------------
*/

const addRecipe = name => ({
  type: ADD_RECIPE,
  name
});
const addIngredient = (name, quantity, recipe) => ({
  type: ADD_INGREDIENT,
  recipe,
  name,
  quantity
});

const fetchRecipes = () => ({
  type: FETCH_RECIPES
});

const setRecipes = recipes => ({
  type: SET_RECIPES,
  recipes
});

const fetchIngredients = () => ({
  type: FETCH_INGREDIENTS
});

const setIngredients = ingredients => ({
  type: SET_INGREDIENTS,
  ingredients
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

// TEST
document.querySelector("#getRecipes").addEventListener("click", () => {
  store.dispatch({ type: FETCH_RECIPES });
});
document.querySelector("#getIngredients").addEventListener("click", () => {
  store.dispatch({ type: FETCH_INGREDIENTS });
});
