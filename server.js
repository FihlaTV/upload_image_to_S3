
// Load dependencies

const express = require('express');
const multer = require('multer');
const imager = require('multer-imager');
const app = express();

// Change bucket property to your Object Storage name

const fileObj = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg'
};
const name = Math.floor(Math.random() * 100);

const upload =
  multer({
    storage: imager({
      dirname: 'upload',
      bucket: 'kamil-aws',
      accessKeyId: 'AKIAIXYCMBSRMZLJL4AA',
      secretAccessKey: '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',
      region: 'us-east-2',
      filename: (req, file, cb) => {
        console.log(file)
        cb(null, `${name}_thumb${fileObj[file.mimetype]}`)
      },
      gm: {
        width: 200,
        height: 200,
        options: '!',
      },
      s3: {
        Metadata: {
          'acl': 'public-read'
        }
      },
    })
  }).array('upload', 2);


const upload_full =
multer({
  storage: imager({
    dirname: 'upload',
    bucket: 'kamil-aws',
    accessKeyId: 'AKIAIXYCMBSRMZLJL4AA',
    secretAccessKey: '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',
    region: 'us-east-2',
    filename: (req, file, cb) => {
      console.log(file)
      cb(null, `${name}_full${fileObj[file.mimetype]}`)
    },
    gm: {
      width: 500,
      height: 500,
      options: '!',
    },
    s3: {
      Metadata: {
        'acl': 'public-read'
      }
    },
  })
}).array('upload', 2);

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
  });
  upload_full(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.redirect('/error/');
    }
    console.log('File uploaded successfully');
    res.redirect('/success');
  })
});

app.listen(3001, () => console.log('Server listening on port 3001'));