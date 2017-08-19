const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    'use strict';
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    'use strict';
    cb(null, req.params.id + path.extname(file.originalname))
  }
});

const fileFilter = function (req, file, cb) {
  'use strict';
  const filetypes = /jpeg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: File upload only supports the following filetypes - " + filetypes);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');

module.exports = upload;