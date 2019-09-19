//main.html hamburger menu 
function toggleClass() {
  let menu = document.querySelector(".mainMenu");
  menu.classList.toggle("toggleCls");
}

let apiKey = "cce8b9ce27b94074941076f355a05bae";
let planUrl = "https://api.spoonacular.com/recipes/mealplans/generate";
let recipeUrl = "https://api.spoonacular.com/recipes/";
let stepsUrl = "https://api.spoonacular.com/recipes/";


function getIngredients(mealsId) {
  //for recipe ingredients
  const params2 = {
    includeNutrition: false,
    apiKey: apiKey
  };
  let queryString2 = $.param(params2);
  const url2 = recipeUrl + `${mealsId}/information` + "?" + queryString2;
  let ingredients = url2;
  console.log("url2", url2);
  fetch(url2).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }).then(responseJson => {
    let ingredientsList = responseJson.extendedIngredients;
    let ingredientsArray = [];
    ingredientsArray.push(ingredientsList);
    console.log("ingredientsArray", ingredientsArray)

    $(`#${mealsId}`).append(`
        <h5>Ingredients:</h5>
      `)

    for (let j = 0; j < ingredientsArray.length; j++) {
      for (let k = 0; k < ingredientsArray[j].length; k++) {
        console.log("ingredients append", mealsId, ingredientsArray.length);
        $(`#${mealsId}`).append(`
        <ul>
        <li>${ingredientsArray[j][k].original}</li>
        </ul>
       `)
      }
    }
  })
    .catch(err => {
      $("#js-error-message").text(`Something failed: ${err.message}`);
    })
}
//for recipe steps
function getRecipe(mealsId) {

  const params3 = {
    stepBreakdown: true,
    apiKey: apiKey
  };
  let queryString3 = $.param(params3);
  const url3 = stepsUrl + `${mealsId}/analyzedInstructions` + "?" + queryString3;
  let recipes = url3;
  console.log("url3", url3);

  fetch(url3).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }).then(responseJson => {
    let recipeSteps = responseJson[0].steps;
    let recipeArray = [];
    recipeArray.push(recipeSteps);
    console.log("recipeArray", recipeArray)
    $(`#${mealsId}`).append(`
        <h5>Recipe</h5>
    `)
    for (let l = 0; l < recipeArray.length; l++) {
      for (let m = 0; m < recipeArray[l].length; m++) {
        console.log("recipe append", mealsId, recipeArray.length);
        $(`#${mealsId}`).append(`
        
        <li>Step ${recipeArray[l][m].number}:</li>
        <p>${recipeArray[l][m].step}</p>
      
       `)
      }
    }
  })
    .catch(err => {
      $("#js-error-message").text(`Something failed: ${err.message}`);
    })

}

//to display main meal info and meal plan nutrients
function displayResults(meals, nutrients) {

  $("#results-list").empty();

  for (let i = 0; i < meals.length; i++) {
    $("#results-list").append(`
      <h4>${meals[i].title}</h4>
      <p>Ready in: ${meals[i].readyInMinutes}minutes</p>
      <p>Servings: ${meals[i].servings}</p>
      <ul id="${meals[i].id}"></ul>`)
  }

  console.log("nutrients length", nutrients);
  $("#results-list").append(`
        <h5>Daily Nutrients:</h5>
        <ul>
        <li>Calories: ${nutrients.calories}</li>
        <li>Carbs: ${nutrients.carbohydrates}</li>
        <li>Fat: ${nutrients.fat}</li>
        <li>Protein: ${nutrients.protein}</li>
        <ul>
      `)


  $("#results").removeClass("hidden");
}




function getMealPlan(searchTerm, calories, diet, exclude) {
  const params = {
    timeFrame: searchTerm,
    targetCalories: calories,
    diet: diet,
    exclude: exclude,
    apiKey: apiKey
  };

  let queryString = $.param(params);
  const url = planUrl + "?" + queryString;
  console.log("url", url);

  fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  }).then(responseJson => {
    console.log(responseJson);

    let meals = responseJson.meals;
    for (let i = 0; i < responseJson.meals.length; i++) {
      //for each meal we need to call get recipe
      console.log("ingredients id", responseJson.meals[i].id);
      getIngredients(responseJson.meals[i].id);
      getRecipe(responseJson.meals[i].id);
    }
    let nutrients = responseJson.nutrients;
    console.log("nutrients var", nutrients);
    displayResults(meals, nutrients)
  })
    .catch(err => {
      $("#js-error-message").text(`Something failed: ${err.message}`);
    })
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $("#number-meals").val();
    let calories = $("#calories").val();
    let diet = $("#diet").val();
    let exclude = $("#exclude").val();
    console.log("data", searchTerm, calories, diet, exclude);
    if (diet == "") {
      diet = undefined;
    }
    if (exclude == "") {
      exclude = undefined;
    }

    getMealPlan(searchTerm, calories, diet, exclude);
  })
}

$(watchForm);