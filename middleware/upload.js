const multer = require("multer");

const storage = multer.memoryStorage(); // Multer will store the file in memory as a buffer

const upload = multer({ storage: storage });

module.exports = upload;
