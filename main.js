//main.html hamburger menu
function toggleClass(){
    let menu = document.querySelector(".mainMenu");
    menu.classList.toggle("toggleCls");   
}

let apiKey = "cce8b9ce27b94074941076f355a05bae";
let planUrl = "https://api.spoonacular.com/recipes/mealplans/generate";
let recipeUrl = "https://api.spoonacular.com/recipes/{id}/information";


function displayResults(responseJson){
    console.log(responseJson)
    $("#results-list").empty();

    for( let i=0; i<responseJson.meals.length; i++){
        let recipe = getRecipe(responseJson.meals[i].id);
        $("#results-list").append(`
            '<li><img src='${responseJson.meals[i].img}'>
            <h4>${responseJson.meals[i].title}</h4>
            <
            

        )
    }
}

function getMealPlan(searchTerm, calories, diet, exclude){
    const params ={
        timeFrame: searchTerm,
        targetCalories: calories,
        diet: diet,
        exclude: exclude
    };

    let queryString = $.param(params);
    const url = planUrl + "?" + queryString;
    console.log("url",url);

    fetch(url).then(response =>{
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    }).then(responseJson => displayResults(responseJson))
}

function watchForm() {
    $('form').subnit(event => {
        event.preventDefault();
        let searchTerm = $("#number-meals").val();
        let calories = $("#calories").val();
        let diet = $("#diet").val();
        let exclude = $("#exclude").val();
        console.log("data",searchTerm,calories,diet,exclude);
        if(diet == ""){
            diet=undefined;
        }
        if(exclude == ""){
            exclude=undefined;
        }
        getMealPlan(searchTerm,calories,diet,exclude);
    })
}

$(watchForm);