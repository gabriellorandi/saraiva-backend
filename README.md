## SARAIVA EDUCACAO

API de armazenamento e busca receitas de coquetéis e drinks.

## Tecnológias utilizadas

- [Node.js](https://nodejs.org/en/). 
- [Mongoose](https://mongoosejs.com/). 

## Instalaçao

### Linux (Ubuntu)
 
 ```shell
 sudo apt update
 sudo apt install nodejs
 sudo apt install npm
 npm install
 node app.js
 ```

## Utilização

|Metodo | URL               | Resposta
|-      |-                  |-     
|GET    |/drink/letter      |Retorna todas as bebidas pela primeira letra.     
|GET    |/drink             |Retorna todas as bebidas.     
|POST   |/drinks            |Salva várias bebidas.
|GET    |/drink/:id         |Retorna a bebida dado o id.
|POST   |/login             |Realiza o login do usuário.
|POST   |/signup            |Salva um usuário novo.

## Exemplo de código

```javascript
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

  }
```

## Licença

[Gabriel Lorandi](https://www.linkedin.com/in/gabriel-lorandi/)
