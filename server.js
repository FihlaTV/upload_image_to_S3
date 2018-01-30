
// Load dependencies

const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const imager = require('multer-imager');
const app = express();

// Set S3 endpoint to Object Storage

const s3 = new aws.S3();

// Change bucket property to your Object Storage name

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'kamil-aws',
    acl: 'public-read',
    key: (req, file, cb) => {
      console.log(file);
      cb(null, file.originalname);
    }
  })
}).array('upload', 1);

// Views in piblic directory

app.use(express.static('public'));

// Main, error and success views

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/public/success.html');
});

app.get('/error', (req, res) => {
  res.sendFile(__dirname + '/public/error.html');
});

app.post('/upload', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/error/');
    }
    console.log('File uploaded successfully');
    res.redirect('/success');
  });
});

app.listen(3001, () => console.log('Server listening on port 3001'));