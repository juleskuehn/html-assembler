const express = require('express');
const router = express.Router();

// Require controller modules.
const info_controller = require('../controllers/infoController');
const preset_controller = require('../controllers/presetController');

// GET edit (admin) page
router.get('/', info_controller.edit_list);

/* Informative Sections */

// GET request for list of all Infos
router.get('/infos', info_controller.info_list);

// GET request for creating a Info
router.get('/info/create', info_controller.info_create_get);

// POST request for creating a Info
router.post('/info/create', info_controller.info_create_post);

// GET request to edit Info
router.get('/info/:id', info_controller.info_update_get);

// POST request to edit Info
router.post('/info/:id', info_controller.info_update_post);

// GET request to delete Info
router.get('/info/:id/delete', info_controller.info_delete_get);

// POST request to delete Info
router.post('/info/:id/delete', info_controller.info_delete_post);


/* Commodity Presets */

// GET request for list of all Presets
router.get('/presets', preset_controller.preset_list);

// GET request for creating a Preset
router.get('/preset/create', preset_controller.preset_create_get);

// POST request for creating a Preset
router.post('/preset/create', preset_controller.preset_create_post);

// GET request to edit Preset
router.get('/preset/:id', preset_controller.preset_update_get);

// POST request to edit Preset
router.post('/preset/:id', preset_controller.preset_update_post);

// GET request to delete Preset
router.get('/preset/:id/delete', preset_controller.preset_delete_get);

// POST request to delete Preset
router.post('/preset/:id/delete', preset_controller.preset_delete_post);


module.exports = router;