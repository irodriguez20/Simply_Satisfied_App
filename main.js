//main.html hamburger menu
function toggleClass() {
    let menu = document.querySelector(".mainMenu");
    menu.classList.toggle("toggleCls");
}

let apiKey = "cce8b9ce27b94074941076f355a05bae";
let planUrl = "https://api.spoonacular.com/recipes/mealplans/generate";
let recipeUrl = "https://api.spoonacular.com/recipes/";
let stepsUrl = "https://api.spoonacular.com/recipes/";



function getIngredients(responseJson) {
    let ingredientsData = responseJson;
    console.log("getIngredients", responseJson);
    for (let i = 0; i < responseJson.meals.length; i++) {
        //for recipe ingredients
        const params2 = {
            includeNutrition: false,
            apiKey: apiKey
        };
        let queryString2 = $.param(params2);
        //let recipe = getMealPlan(responseJson.meals[i].id);
        const url2 = recipeUrl + `${responseJson.meals[i].id}/information` + "?" + queryString2;
        console.log("url2", url2);
        fetch(url2).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJson => recipeSteps(responseJson, ingredientsData))
            .catch(err => {
                $("#js-error-message").text(`Something failed: ${err.message}`);
            })
    }
}
//for recipe steps
function recipeSteps(responseJson, ingredientsData) {
    let recipeData = responseJson;
    console.log("recipeSteps", responseJson, ingredientsData);
    for (let i = 0; i < ingredientsData.meals.length; i++) {
        const params3 = {
            stepBreakdown: true,
            apiKey: apiKey
        };
        let queryString3 = $.param(params3);
        //let steps = getSteps(responseJson.meals[i].id);
        const url3 = stepsUrl + `${ingredientsData.meals[i].id}/analyzedInstructions` + "?" + queryString3;
        console.log("url3", url3);

        fetch(url3).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then(responseJson => displayResults(responseJson, recipeData, ingredientsData))
            .catch(err => {
                $("#js-error-message").text(`Something failed: ${err.message}`);
            })
    }
}
function displayResults(responseJson, recipeData, ingredientsData) {
    console.log("displayResults", responseJson, recipeData, ingredientsData);
    $("#results-list").empty();


    for (let i = 0; i < ingredientsData.meals.length; i++) {
        for (let j = 0; j < recipeData.extendedIngredients.length; j++) {
            for (let k = 0; k < responseJson.steps.length; k++) {
                for (let l = 0; l < ingredientsData.nutrients.length; l++) {
                    $("#results-list").append(`
                  '<li><img src='${ingredientsData.meals[i].image}'>
                   <h4>${ingredientsData.meals[i].title}</h4>
                   <p>Ready in: ${ingredientsData.meals[i].readyInMinutes}minutes</p>
                   <p>Servings: ${ingredientsData.meals[i].servings}</p>
                   <h6>Ingredients:</h6>
                   <ul>
                   <li>${recipeData.extendedIngredients[j].original}</li>
                   </ul>
                   <h6>Recipe</h6>
                   <ul>
                   <li>Step ${responseJson.steps[i].number}</li>
                   <li>${responseJson.steps[i].step}</li>
                   </ul>
                   <h6>Daily Nutrients:</h6>
                   <ul>
                   <li>Calories: ${ingredientsData.nutrients[l].calories}</li>
                   <li>Carbs: ${ingredientsData.nutrients[l].carbohydrates}</li>
                   <li>Fat: ${ingredientsData.nutrients[l].fat}</li>
                   <li>Protein: ${ingredientsData.nutrients[l].protein}</li>
                   <ul>`
                    )
                }
            }
        }
    }
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
    }).then(responseJson => getIngredients(responseJson))
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