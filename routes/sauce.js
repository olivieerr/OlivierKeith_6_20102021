const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')

const sauceCtl = require("../controllers/sauce");

router.post('/', auth, sauceCtl.createSauce);
router.put('/:id', auth, sauceCtl.modifySauce);
router.delete('/:id', auth, sauceCtl.deleteSauce);
router.get('/:id', auth, sauceCtl.getOneSauce);
router.get('/', auth, sauceCtl.getAllSauces);

module.exports = router;