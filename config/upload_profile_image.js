const multer = require('multer');

const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, './uploads/')
     
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])

        cb(null, file.fieldname + '-' + req.session.user.username+ '-' + datetimestamp + '.png')
    }
});

exports.upload = multer({storage: storage}).single('croppedImage');