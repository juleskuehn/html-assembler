const express = require('express');
const router = express.Router();

const generator_controller = require('../controllers/generatorController');

router.get('/', generator_controller.menu);

router.get('/infos', generator_controller.all_infos);

router.get('/create', generator_controller.create_get);

router.post('/create', generator_controller.create_post);

router.post('/output-en', generator_controller.output_en);

router.post('/output-fr', generator_controller.output_fr);

module.exports = router;