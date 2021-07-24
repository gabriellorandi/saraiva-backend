const mongoose = require('mongoose');

let drinkSchema = new mongoose.Schema({

    idDrink:{ type: Number } ,  
    strDrink:{ type: String },
    strGlass: { type: String },
    strInstructions: { type: String },
    strDrinkThumb: { type:String },
    ingredients: [{ type: String  }],
    measures: [{ type: String }],
    dateModified: {type: Date }
  

}, { __v: false });


module.exports  = mongoose.model('Drink', drinkSchema);
