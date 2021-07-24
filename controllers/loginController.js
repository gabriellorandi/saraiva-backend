const User = require('../models/user');
const ErrorHandler = require('../util/errorHandler');
const bcrypt = require('bcrypt');
const auth = require('../security/auth');

let LoginController = {

    login: async function(req, res){

        let user = await User.findOne({"email": req.body.email }) 
                        
        if(!user || !user.email || !user.password) {
            console.error(`LoginController.login - Email: ${user.email} or invalid password`);
            return ErrorHandler.handle('Email ou senha inválida',null,res,400);         
        } else {

            let valido = await bcrypt.compare(req.body.password, user.password);
            
            if(!valido) {
                console.error(`LoginController.login - Wrong passwrod`);
                return ErrorHandler.handle('Senha incorreta',null,res,400);         
            } 

            let token = auth.token(user.id);

            console.log(`LoginController.login - User valid, email: ${user.email}`);
            res.status(200).json({
                email: user.email,
                tokenType: 'Bearer',                
                accessToken: token                
            });
        }    

    },

    signup: function(req,res){

        let user = new User();
        user = Object.assign(user,req.body);

        User.findOne( {email: user.email}, function (err,userBanco) {

            if(userBanco){
                console.error(`LoginController.signup - Email already exits: ${user,email}`);
                return ErrorHandler.handle('Email já cadastrado',null,res,400);  
            } 
            if(!user || !user.email || !user.password || !user.name) {
                console.error(`LoginController.signup - Error on validate - ${user}`);

                return ErrorHandler.handle('Nome, Email ou senha inválida/faltantes',null,res,400);         
            } else {

                bcrypt.hash(req.body.password, 2, function(err,hash) {

                    if(err) {
                        console.error(`LoginController.signup - Error on cripto - ${err}`);
                        ErrorHandler.handle('Erro na criptografia da definição senha',err,res,500);       
                    }    
        
                    user.password = hash;
        
                    user.save();
        
                    console.log(`LoginController.signup - User registed with success, email: ${user.email}`);
                    return res.status(201).send("Usuário cadastrado com sucesso!");
                });
            }
        })       
    }

}


module.exports = LoginController;