const multer = require('multer');
const path = require('path');

// Configure how files are stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Ensure this folder exists in your root directory
    },
    filename: (req, file, cb) => {
        // Create a unique name: timestamp + original name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'));
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;