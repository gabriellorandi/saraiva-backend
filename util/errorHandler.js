function Error(msg,err) {

    this.erro = err,
    this.mensagem = msg
}

let ErrorHandler  = {
    handle: function(msg,err,res,status) {    
        return res.status(status).json({msg: msg, err: err})
    }
}

module.exports = ErrorHandler