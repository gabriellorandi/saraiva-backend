const express = require('express');
const router = express.Router();
const auth = require('../security/auth');
const drinkController = require('../controllers/drinkController');


router.get('/drink',drinkController.getAll);

router.get('/drink/letter',drinkController.getByLetter);

router.get('/drink/:id',drinkController.getById);

router.post('/drinks',auth.isAuthorized,drinkController.addAll);

module.exports = router;

