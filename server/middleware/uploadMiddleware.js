import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {BindMethods} from "../utility/bindMethods.js"

class FileUploader {
  constructor() {
    this.filetypes = /jpeg|jpg|png|gif|liquid|js|css/;
    this.uploadDir = './uploads';
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => this.setDestination(req, file, cb),
      filename: (req, file, cb) => this.setFilename(req, file, cb),
    });

    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 100000000 },
      fileFilter: (req, file, cb) => this.checkFileType(file, cb),
    });
  }

  setDestination(req, file, cb) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    cb(null, this.uploadDir);
  }

  setFilename(req, file, cb) {
    const originalName = file.originalname.replace(/\s+/g, '_');
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(originalName)}`;
    cb(null, uniqueName);
  }

  checkFileType(file, cb) {
    
    const extname = this.filetypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = this.filetypes.test(file.mimetype);

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }

  singleFileUpload(fieldName) {
    return (req, res, next) => {
      const uploadSingle = this.upload.single(fieldName);
      uploadSingle(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.file) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }
  formData() {
    return (req, res, next) => {
        this.upload.none()(req, res, (err) => {
            if (err) {
              next(err)
            }
            next(); 
        });
    };
  }
  multipleFileUpload(fieldName, maxCount) {
    return (req, res, next) => {
      const uploadMultiple = this.upload.array(fieldName, maxCount);
      uploadMultiple(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.files || req.files.length === 0) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }

  multipleFieldsUpload(fieldsConfig) {
    return (req, res, next) => {
      const uploadMultiple = this.upload.fields(fieldsConfig);
      uploadMultiple(req, res, (err) => {
        if (err) {
          return next(err);
        }
        // if (!req.files || Object.keys(req.files).length === 0) {
        //   return next(new Error('No files selected'));
        // }
        next();
      });
    };
  }
}

const binding = new BindMethods(new FileUploader())
export default binding.bindMethods()
