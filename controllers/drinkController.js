const Drink = require('../models/drink');
const ErrorHandler = require('../util/errorHandler');

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) &&  !isNaN(parseFloat(str)) 
}

const MAX_SIZE_LIST = 12;

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

let DrinkController = {

    getAll: async function(req, res){

        let search = req.query.search;

        if(!search) {
            search = "";
        }

        Drink.find({strDrink: { $regex: ".*"+search+".*", $options: "-i" } }  ,function(err,drinks)  {

            if(err) {            
                console.error(`DrinkController.getAll - Error on getAll - ${err}`);     
                return ErrorHandler.handle('Nenhum drink encontrado',err,res,404); 
            }

        
            console.log(`DrinkController.getAll - Retrived ${drinks.length} drinks`);  
            return res.status(200).send(drinks)

        }).limit(MAX_SIZE_LIST).sort({strDrink: 1});    

    },

    getByLetter: async function(req, res){

        let l = req.query.l;

        if(!l) {
            l = "";
        }

        Drink.find({strDrink: { $regex: "^"+l, $options: "-i" } }  ,function(err,drinks)  {

            if(err) {            
                console.error(`DrinkController.getByLetter - Error on getByLetter - ${err}`);     
                return ErrorHandler.handle('Nenhum drink encontrado',err,res,404); 
            }

        
            console.log(`DrinkController.getByLetter - Retrived ${drinks.length} drinks`);  
            return res.status(200).send(drinks)

        }).limit(MAX_SIZE_LIST).sort({strDrink: 1});  

    },


    getById: async function(req, res){

        let id = req.params.id;

        if(!isNumeric(id)) {
            console.log(`DrinkController.getById - Invalid Id - ${id}`);     
            return ErrorHandler.handle('Id inválido',null,res,400); 
        }

        let drink = await Drink.findOne({idDrink:id });
        if(!drink) {
            console.log(`DrinkController.getById - Drink not found on id - ${id}`);     
            return ErrorHandler.handle('Drink não encontrado',null,res,404);
        } 

        console.log(`DrinkController.getById - Retrived drink by Id - ${id}`);  

        return res.status(200).send(drink);       

    },

    addAll: async function(req, res) {

        let drinks = [];

        for(const d of req.body.drinks) {

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
                console.error(`DrinkController.insertMany - Error on save multiple drinks ${err} `);  
                return ErrorHandler.handle('Erro ao salvar drink',err,res,500);
            } 

            console.log(`DrinkController.insertMany - Save multiple drinks ${drinks.length} `);  
            return res.status(201).send(drinks);
            
        })
               
    }

}


module.exports = DrinkController;