const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// Configure multer storage for product images
const productStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // Save directly to frontend's public/images/Products folder
    const uploadDir = path.resolve(__dirname, '../../../limona/public/images/Products');
    
    // Create directory if it doesn't exist
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const ext = path.extname(file.originalname);
    const uniqueName = `product-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload middleware for products
const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Saves an image buffer into /uploads and returns its relative path.
async function saveImage(buffer, originalName = 'image') {
  if (!buffer) throw new Error('No file buffer provided');

  const uploadsDir = path.resolve(__dirname, '../../uploads');
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(originalName) || '.bin';
  const fileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.promises.writeFile(filePath, buffer);

  // Relative path is useful for constructing public URLs later.
  const relativePath = path.join('uploads', fileName);
  return { filePath, relativePath };
}

module.exports = {
  saveImage,
  uploadProductImage
};
