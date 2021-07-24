let express = require('express');
let cors = require('cors');
const mongoose = require('mongoose');
const ErrorHandler = require('./util/errorHandler');
const cocktailService = require('./service/cocktailService')
const config = require('./config/config');
const schedule = require('node-schedule');


//Routes
let drinkRouter = require('./routes/drink.route');
let loginRouter = require('./routes/login');

// MongoDB
var mongoDB = 'mongodb://'+config.MONGO_PATH+'/'+config.MONGO_BD;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro ao conectar ao Banco'));

var app = express(); 
app.listen(config.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', loginRouter);
app.use('/', drinkRouter);
app.get('*',function (req, res) {
  res.send("Página não encrontada");
});


app.use(function(req,res) {
  return ErrorHandler.handle('Path: '+req.path+' não encontrado',null,res,404);    
});

//Schedule
const job = schedule.scheduleJob('*/10 * * * *', function(){
  cocktailService.searchByRandom();
});


console.log('Started Mongo database: '+config.MONGO_BD);  
console.log('Running Saraiva Drinks on port: '+config.PORT);  

module.exports = app;