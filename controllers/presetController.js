const async = require('async');

const Preset = require('../models/presetSchema');
const Info = require('../models/infoSchema');

const strings = {
  listTitle: 'Edit presets',
  createTitle: 'Create preset',
  presetNameRequired: 'Preset name required'
}

// Display list of all Presets
exports.preset_list = (req, res, next) => {
  Preset.find()
    .sort([['order', 'ascending']])
    .exec((err, list_presets) => {
      if (err) { return next(err); }
      res.render('item_list', {
        title: strings.listTitle,
        item_list: list_presets,
        type: 'preset',
        breadcrumbs: [
          { url: '/', text: 'Home' },
          { url: '/edit', text: 'Edit content' }
        ]
      });
    });
};

// Display preset create form on GET
exports.preset_create_get = (req, res, next) => {
  Info.find()
    .exec((err, list_infos) => {
      if (err) { return next(err); }
      res.render('preset_form', {
        title: strings.createTitle,
        item_list: list_infos,
        breadcrumbs: [
          { url: '/', text: 'Home' },
          { url: '/edit', text: 'Edit content' },
          { url: '/edit/presets', text: 'Edit presets' },
        ]
      });
    });
};

// Handle Preset create on POST
exports.preset_create_post = (req, res, next) => {

  // Edge case: < 2 infos selected
  if (!(req.body.infos instanceof Array)) {
    if (typeof req.body.infos === 'undefined') {
      req.body.infos = [];
    } else {
      req.body.infos = new Array(req.body.infos);
    }
  }

  let preset = new Preset({
    name: req.body.name,
    frName: req.body.frName,
    description: req.body.description,
    frDescription: req.body.frDescription,
    infos: req.body.infos,
    order: req.body.order
  });

  // Check if Preset with same name already exists.
  Preset.findOne({ 'name': req.body.name })
    .exec((err, found_preset) => {
      if (err) { return next(err); }
      if (found_preset) { res.redirect(found_preset.url); }
      else {
        preset.save((err) => {
          if (err) { return next(err); }
          // Preset saved. Redirect to presets list.
          res.redirect('/edit/presets');
        });
      }
    });
};

// Display preset update form on GET
exports.preset_update_get = (req, res, next) => {

  // Get preset for form
  async.parallel({
    preset: (callback) => Preset.findById(req.params.id).exec(callback),
    infos: (callback) => Info.find().sort([['order', 'ascending']]).exec(callback)
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.preset == null) { // No results.
      let err = new Error('Preset not found');
      err.status = 404;
      return next(err);
    }
    res.render('preset_form', {
      title: 'Edit preset',
      item: results.preset,
      item_list: results.infos,
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/edit', text: 'Edit content' },
        { url: '/edit/presets', text: 'Edit presets' },
      ]
    });
  });

};

// Handle preset update on POST.
exports.preset_update_post = (req, res, next) => {

  // Edge case: < 2 infos selected
  if (!(req.body.infos instanceof Array)) {
    if (typeof req.body.infos === 'undefined') {
      req.body.infos = [];
    } else {
      req.body.infos = new Array(req.body.infos);
    }
  }

  // Create a preset object with escaped/trimmed data and old id.
  let preset = new Preset({
    name: req.body.name,
    frName: req.body.frName,
    description: req.body.description,
    frDescription: req.body.frDescription,
    infos: req.body.infos,
    order: req.body.order,
    _id: req.params.id // This is required, or a new ID will be assigned
  });

  Preset.findByIdAndUpdate(req.params.id, preset, {}, (err, thepreset) => {
    if (err) { return next(err); }
    // Successful - redirect to presets list
    res.redirect('/edit/presets');
  });
};


// Display Preset delete form on GET.
exports.preset_delete_get = (req, res, next) => {
  async.parallel({
    preset: (callback) => Preset.findById(req.params.id).exec(callback)
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.preset == null) { // No results.
      res.redirect('/edit/presets');
    }
    res.render('item_delete', {
      title: 'Delete Preset',
      item: results.preset,
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/edit', text: 'Edit content' },
        { url: '/edit/presets', text: 'Edit presets' },
        { url: results.preset.url, text: results.preset.name }
      ]
    });
  });
};

// Handle Preset delete on POST.
exports.preset_delete_post = (req, res, next) => {
  async.parallel({
    preset: (callback) => Preset.findById(req.body.itemid).exec(callback)
  }, (err, results) => {
    if (err) { return next(err); }
    // Success. Delete object and redirect to the list of presets.
    Preset.findByIdAndRemove(req.body.itemid, (err) => {
      if (err) { return next(err); }
      res.redirect('/edit/presets')
    })
  });
};