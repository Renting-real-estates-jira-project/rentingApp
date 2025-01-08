const jsonServer = require("json-server");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Configure Multer for file uploads
const uploadDir = path.join(__dirname, "/uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Middleware for parsing JSON and serving static files
server.use(middlewares);
server.use("/uploads", jsonServer.static(uploadDir));

// Endpoint for handling image uploads
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// Use JSON Server's default router
server.use(router);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(
    `JSON Server with file upload is running on http://localhost:${PORT}`
  );
});
