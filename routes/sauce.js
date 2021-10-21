const express = require('express');
const router = express.Router();

const auth = require('../middleware/Authorize');
const sauceCtl = require("../controllers/sauce");
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceCtl.createSauce);
router.post('/:id/like', auth, sauceCtl.likeOrNotSauce);
router.put('/:id', auth, multer, sauceCtl.modifySauce);
router.delete('/:id', auth, sauceCtl.deleteSauce);
router.get('/:id', auth, sauceCtl.getOneSauce);
router.get('/', auth, sauceCtl.getAllSauces);

module.exports = router;