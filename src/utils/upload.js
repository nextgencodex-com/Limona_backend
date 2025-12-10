const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
  saveImage
};
