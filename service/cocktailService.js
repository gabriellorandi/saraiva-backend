const http = require('https');

const HOST = 'www.thecocktaildb.com';
const PATH = '/api/json/v1/1/';
const Drink = require('../models/drink');

function buildIngredients(el) {

  let ingredients = [];   

  (el.strIngredient1)?ingredients.push(el.strIngredient1):null;
  (el.strIngredient2)?ingredients.push(el.strIngredient2):null;
  (el.strIngredient3)?ingredients.push(el.strIngredient3):null;
  (el.strIngredient4)?ingredients.push(el.strIngredient4):null;
  (el.strIngredient5)?ingredients.push(el.strIngredient5):null;
  (el.strIngredient6)?ingredients.push(el.strIngredient6):null;
  (el.strIngredient7)?ingredients.push(el.strIngredient7):null;
  (el.strIngredient8)?ingredients.push(el.strIngredient8):null;
  (el.strIngredient9)?ingredients.push(el.strIngredient9):null;
  (el.strIngredient10)?ingredients.push(el.strIngredient10):null;
  (el.strIngredient11)?ingredients.push(el.strIngredient11):null;
  (el.strIngredient12)?ingredients.push(el.strIngredient12):null;
  (el.strIngredient13)?ingredients.push(el.strIngredient13):null;
  (el.strIngredient14)?ingredients.push(el.strIngredient14):null;
  (el.strIngredient15)?ingredients.push(el.strIngredient15):null;

  return ingredients;

}

function buildMeasures(el) {

  let measures = [];
  (el.strMeasure1)?measures.push(el.strMeasure1):null;
  (el.strMeasure2)?measures.push(el.strMeasure2):null;
  (el.strMeasure3)?measures.push(el.strMeasure3):null;
  (el.strMeasure4)?measures.push(el.strMeasure4):null;
  (el.strMeasure5)?measures.push(el.strMeasure5):null;
  (el.strMeasure6)?measures.push(el.strMeasure6):null;
  (el.strMeasure7)?measures.push(el.strMeasure7):null;
  (el.strMeasure8)?measures.push(el.strMeasure8):null;
  (el.strMeasure9)?measures.push(el.strMeasure9):null;
  (el.strMeasure10)?measures.push(el.strMeasure10):null;
  (el.strMeasure11)?measures.push(el.strMeasure11):null;
  (el.strMeasure12)?measures.push(el.strMeasure12):null;
  (el.strMeasure13)?measures.push(el.strMeasure13):null;
  (el.strMeasure14)?measures.push(el.strMeasure14):null;
  (el.strMeasure15)?measures.push(el.strMeasure15):null;

  return measures;

}


async function addDrink(str) {

  try {
    const resJson = await JSON.parse(str);

    const drinks = [];
    for(const d of resJson.drinks) {


      let drink = new Drink();
      drink =  await Object.assign(drink,d);  
    
      let exists = await Drink.exists({idDrink:drink.idDrink});
    
      if(!exists) {
    
          drink.ingredients = [];
          drink.measures = [];
    
          drink.ingredients.push.apply(drink.ingredients,buildIngredients(d));
          drink.measures.push.apply(drink.measures,buildMeasures(d))
    
          drinks.push(drink);
      }
    
    }
      
    Drink.insertMany(drinks, function (err) {
      if(err) {
          console.error(`CocktaildbService.searchByRandom - Error on save drink - ${err} `);  
      }
      console.log(`CocktaildbService.searchByRandom - Saved drinks - ${drinks.length}`);  
    }) 
  } catch(e) {
    console.error(`CocktaildbService.searchByRandom - Error on save drink - ${e} `);  

  }

}

function randomLetter() {
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  return characters.charAt(Math.floor(Math.random() * characters.length)); 
}


let CocktaildbService = {

    searchByRandom: async function(callback){

        let letter = randomLetter();

        let options = {

            host: HOST,
            path: PATH+'search.php?f='+letter,
            method: 'GET'
        }

        console.log(`Calling http request - ${options.method} - ${options.host}${options.path}`);

        http.request(options, function(response) {

            var str = '';
          
            response.on('data', function (chunk) {
              str += chunk;
            });
          
            response.on('end', function () {
              console.error(`CocktaildbService.searchByRandom - Adding drinks `)
              addDrink(str);
            });

            response.on('error', (e) => {
              console.error(`CocktaildbService.searchByRandom - Error - ${e}`)
            });

        }).end()
    
    }

}

module.exports = CocktaildbService;