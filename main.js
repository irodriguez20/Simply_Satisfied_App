//main.html hamburger menu
function toggleClass() {
    let menu = document.querySelector(".mainMenu");
    menu.classList.toggle("toggleCls");
}

let apiKey = "cce8b9ce27b94074941076f355a05bae";
let planUrl = "https://api.spoonacular.com/recipes/mealplans/generate";
let recipeUrl = "https://api.spoonacular.com/recipes/";
let stepsUrl = "https://api.spoonacular.com/recipes/";
let ingredientsArray = [];
let recipeArray = [];

function getIngredients(mealsId) {
  
  //console.log("getIngredients");
 // for (let i = 0; i < responseJson.meals.length; i++) {
    //for recipe ingredients
    const params2 = {
      includeNutrition: false,
      apiKey: apiKey
    };
    let queryString2 = $.param(params2);
    //let recipe = getMealPlan(responseJson.meals[i].id);
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
      ingredientsArray.push(ingredientsList);
      console.log("ingredientsArray",ingredientsArray[0])

      $(`#${mealsId}`).append(`
        <h5>Ingredients:</h5>
      `)

      for (let j = 0; j < ingredientsArray[0].length; j++) {
      console.log("ingredients append",ingredientsArray.length);
      $(`#${mealsId}`).append(`
        <ul>
        <li>${ingredientsArray[0][j].original}</li>
        </ul>
      `)
    }
    })
    .catch(err => {
      $("#js-error-message").text(`Something failed: ${err.message}`);
    })
  //}
}
//for recipe steps
function getRecipe(mealsId) {
  
  //console.log("recipeSteps", responseJson, ingredientsData);
  const params3 = {
    stepBreakdown: true,
    apiKey: apiKey
  };
  let queryString3 = $.param(params3);
  //let steps = getSteps(responseJson.meals[i].id);
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
    recipeArray.push(recipeSteps);
    console.log("recipeArray", recipeArray)
    $(`#${mealsId}`).append(`
        <h5>Recipe</h5>
    `)

    for (let k = 0; k < recipeArray[0].length; k++) {
      console.log("recipe append",recipeArray.length);
      $(`#${mealsId}`).append(`
        <ul>
        <li>Step ${recipeArray[0][k].number}:</li>
        <p>${recipeArray[0][k].step}</p>
        </ul>
      `)
    }
  })
  .catch(err => {
   $("#js-error-message").text(`Something failed: ${err.message}`);
  })

}

function displayResults(meals, ingredientsArray, recipeArray, nutrients) {

  /* let meal = meals;
  let recipe = recipeArray;
  let ingredients = ingredientsArray;
  let dayNutrients = nutrients; */

 // console.log("displayResults", meals, ingredientsArray, recipeArray, nutrients);
 $("#results-list").empty();

 console.log("to test append", ingredientsArray);
 for (let i = 0; i < meals.length; i++) {
    $("#results-list").append(`
      <li><img src='${meals[i].image}'>
      <h4>${meals[i].title}</h4>
      <p>Ready in: ${meals[i].readyInMinutes}minutes</p>
      <p>Servings: ${meals[i].servings}</p>
      <ul id="${meals[i].id}"></ul>`) 
  }
    /*for (let j = 0; j < ingredientsArray.length; j++) {
      console.log("ingredients append",ingredientsArray[j].original);
      $("#`${meals[i].id}`").append(`
        <h6>Ingredients:</h6>
        <ul>
        <li>${ingredientsArray[j].original}</li>
        </ul>
      `)
    }*/
    /*for (let k = 0; k < recipeArray.length; k++) {
      console.log("recipe append",recipeArray[k].number, recipeArray[k].step);
      $("#`{meals[i].id}`").append(`
        <h6>Recipe</h6>
        <ul>
        <li>Step ${recipeArray[i].number}</li>
        <li>${recipeArray[i].step}</li>
        </ul>
      `)
    } */
    console.log("nutrients length",nutrients);
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
    //let recipeArray = [];
    //let ingredientsArray = [];
    //let nutrientsArray = [];
    let meals = responseJson.meals;
    for(let i=0; i<responseJson.meals.length; i++){
    //for each meal we need to call get recipe
    console.log("ingredients id",responseJson.meals[i].id);
    getIngredients(responseJson.meals[i].id);
    getRecipe(responseJson.meals[i].id);
    }
    let nutrients = responseJson.nutrients;
   console.log("nutrients var", nutrients);
    displayResults(meals, ingredientsArray, recipeArray, nutrients)
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