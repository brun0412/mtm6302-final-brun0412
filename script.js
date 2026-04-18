const $menus=document.getElementById('menus');
const $recipes=document.getElementById('recipes');
const $cookbook=document.getElementById('cookbook');
const $expand=document.getElementById('expand');
const $modal=document.getElementById('modal');
const $save=document.getElementById('save');
const $close=document.getElementById('close');
const $recipe=document.getElementById('recipe');
const $category=document.getElementById('category');
const $form=document.getElementById('form');
const $search=document.getElementById('search');

//array to save saved recipes in
let cookbook=[];

//toggles search menu on mobile
$expand.addEventListener('click',function(){$menus.classList.toggle('hidemenu');});

//displays selection of dishes as cards
function displaycards(menu){
    for (let dish of menu){
        $recipes.innerHTML+= `<div class="card">
            <img src="${dish.strMealThumb}" alt="${dish.strMeal}">
            <div class="cardtext">
                <h1>${dish.strMeal}</h1>
                <button class="showmodal" data-name="${dish.strMeal}">
                    View Recipe
                </button>
            </div>
        </div>`;
    }
}

$form.addEventListener('submit',async function(e){
    e.preventDefault();

    //clears recipes section before generating new entries
    $recipes.innerHTML=('');

    const query=$search.value
    const response=await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data=await response.json();
    menu=data.meals;

    //calls displaycards function with selection of dishes from api
    if ($category.value==='all'){
        displaycards(menu);
    }else{
        //filters data from api to only return selected category
        function filtered(dish){return dish.strCategory==$category.value;}
        displaycards(menu.filter(filtered));
    }
})

//global variable to save currently opened dish to
let currentdish={};

//gets dish data when opening recipe modal
$recipes.addEventListener('click',async function(e){
    const dishName=e.target.dataset.name
    const response=await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`);
    const data=await response.json();
    dish=data.meals[0];
    console.log(dish);

    currentdish=dish;

  if(e.target.classList.contains('showmodal')){
    console.log(e.target)

    //places all ingredients and their amounts into their own array
    ingredients=[
        {measure: dish.strMeasure1,name: dish.strIngredient1},
        {measure: dish.strMeasure2,name: dish.strIngredient2},
        {measure: dish.strMeasure3,name: dish.strIngredient3},
        {measure: dish.strMeasure4,name: dish.strIngredient4},
        {measure: dish.strMeasure5,name: dish.strIngredient5},
        {measure: dish.strMeasure6,name: dish.strIngredient6},
        {measure: dish.strMeasure7,name: dish.strIngredient7},
        {measure: dish.strMeasure8,name: dish.strIngredient8},
        {measure: dish.strMeasure9,name: dish.strIngredient9},
        {measure: dish.strMeasure10,name: dish.strIngredient10},
        {measure: dish.strMeasure11,name: dish.strIngredient11},
        {measure: dish.strMeasure12,name: dish.strIngredient12},
        {measure: dish.strMeasure13,name: dish.strIngredient13},
        {measure: dish.strMeasure14,name: dish.strIngredient14},
        {measure: dish.strMeasure15,name: dish.strIngredient15},
        {measure: dish.strMeasure16,name: dish.strIngredient16},
        {measure: dish.strMeasure17,name: dish.strIngredient17},
        {measure: dish.strMeasure18,name: dish.strIngredient18},
        {measure: dish.strMeasure19,name: dish.strIngredient19},
        {measure: dish.strMeasure20,name: dish.strIngredient20}
    ]

    //filters out blank (unused) ingredient sections
    function filteredParts(parts){return parts.name!=="";}
    filteredingredients=ingredients.filter(filteredParts);

    //Turns each ingredient into a list entry to insert into the recipe
    let ingredientlist=filteredingredients.map(part=>`<li>${part.name} (${part.measure})`);

    //HTML for recipe modal
    $recipe.innerHTML=
      `
        <h1>${dish.strMeal}</h1>
        <p>${dish.strCategory}</p>
        <p>Ingredients</p>
        <ul>${ingredientlist}</ul>
        <p>Cooking instructions
        <p>${dish.strInstructions}</p>`;
    $modal.classList.remove('hidemodal');
  }
})

$close.addEventListener('click',function(){
    $modal.classList.add('hidemodal');
})

//saves currently displayed dish to cookbook and stores in local storage
$save.addEventListener('click',function(){
    cookbook.push(currentdish);
    localStorage.setItem('mycookbook',JSON.stringify(cookbook));
})

//displays all saved recipes when clicking cookbook button
$cookbook.addEventListener('click',function(){
    //retrieves any cookbook data stored in localstorage
    cookbook=JSON.parse(localStorage.getItem('mycookbook'));
    $recipes.innerHTML=('');
    displaycards(cookbook);
})

//Gets saved cookbook from localstorage on opening the site
const mycookbook=JSON.parse(localStorage.getItem('mycookbook'));
cookbook=mycookbook;

//https://www.themealdb.com/api/json/v1/1/search.php?s=soup