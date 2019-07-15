// NOTE: "info" == "fps" (functional performance statement)

const async = require('async');
const mongoose = require('mongoose');

const Info = require('../models/infoSchema');
const Preset = require('../models/presetSchema');

const strings = {
  allInfosTitle: 'All sections',
  generatorTitle: 'Assemble document',
  createTitle: 'Select sections to include',
  generatedDocumentTitle: 'Generated document'
};

const breadcrumbs = [
  { url: '/', text: 'Home' }
];

exports.menu = (req, res, next) => {
  res.render('generator', {
    title: strings.generatorTitle,
    breadcrumbs: [
      { url: '/', text: 'Home' }
    ]
  });
};

// Display the content of all informative sections
exports.all_infos = (req, res, next) => {
  Info.find()
    .sort([['order', 'ascending']])
    .exec((err, list_infos) => {
      if (err) { return next(err); }
      res.render('all_infos', {
        title: strings.allInfosTitle,
        item_list: list_infos,
        breadcrumbs: breadcrumbs
      });
    });
};

// Select functional performance statements or preset
exports.create_get = (req, res, next) => {
  async.parallel({
    infos: (callback) => Info.find().sort([['order', 'ascending']]).exec(callback),
    presets: (callback) => Preset.find().sort([['order', 'ascending']]).exec(callback)
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('select_fps', {
      title: strings.createTitle,
      item_list: results.infos,
      preset_list: results.presets,
      breadcrumbs: breadcrumbs
    });
  });
};

// Renders output based on FPS selections to browser, along with download links
exports.create_post = (req, res, next) => {
  display_infos(req, res, next, 'all_infos');
};

exports.output_en = (req, res, next) => {
  display_infos(req, res, next, 'output_en');
};

exports.output_fr = (req, res, next) => {
  display_infos(req, res, next, 'output_fr');
};

const display_infos = (req, res, next, view) => {
  // Edge case: < 2 infos selected
  if (!(req.body.infos instanceof Array)) {
    if (typeof req.body.infos === 'undefined') {
      req.body.infos = [];
    } else {
      req.body.infos = new Array(req.body.infos);
    }
  }

  let info_ids = [];
  for (id of req.body.infos) {
    info_ids.push(mongoose.Types.ObjectId(id));
  }

  async.parallel({
    infos: (callback) => Info.find({ '_id': { $in: info_ids } }).sort([['order', 'ascending']]).exec(callback),
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.infos == null) { // No infos selected
      res.redirect('/view/create');
    }
    // res.attachment('ICT Accessibility Requirements.html');
    res.render(view, {
      title: strings.generatedDocumentTitle,
      item_list: results.infos,
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/view/create', text: strings.createTitle}
      ]
    });
  });
}