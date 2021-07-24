const User = require('../models/user');
const ErrorHandler = require('../util/errorHandler');
const config = require('../config/config');
const jwt = require("jsonwebtoken");

let authorization = {

    token: function (userId) {
        return jwt.sign({_id:userId}, config.JWT_KEY, { expiresIn:  config.JWT_TIMEOUT_SECONDS} );
    },

    isAuthorized: function (req, res, next) {
        if (typeof req.headers.authorization !== "undefined") {
       
            let token = req.headers.authorization.split(" ")[1];
            
            jwt.verify(token, config.JWT_KEY, { algorithm: "HS256" }, (err, userId) => {                      
                if (err) {                                    
                    console.error(`Authorization.isAuthorized - Invalid token - ${err}`);
                    res.status(401).json({ error: "Não autorizado - Token inválido" });
                } else {
                    User.findOne({_id:userId}, function(err,user) {
                        if(err) {
                            console.error(`Authorization.isAuthorized - Error on retrive user - ${err}`);
                             return ErrorHandler.handle('Erro ao recuperar Usuário',err,res,400);   
                        }
                           
                        if(!user) {
                            
                            console.error(`Authorization.isAuthorized - User not found with token - ${token}`);
                            return ErrorHandler.handle('Não autorizado - Token inválido ',null,res,403);

                        } else {
                            console.log(`Authorization.isAuthorized - User valid - ${user.email}`);
                            req.user = user; 
                            next();
                        }                                                                             
                    });    
                }                                                                     
            });           
        } else {
            console.error(`Authorization.isAuthorized - Missing token`);
            ErrorHandler.handle('Não autorizado, token ausente ',null,res,403);   
        }
    }
}

module.exports = authorization;