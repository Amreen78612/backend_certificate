const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-certificate", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required");
  }

  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  const fileName = `${name}-certificate.pdf`;
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  const imagePath = path.join(
    __dirname,
    "301691a7-7a1b-4439-8431-17a7227f86c9.png"
  );
  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  } else {
    console.error("Template image not found!");
  }


doc
  .font('Times-BoldItalic')
  .fontSize(36)
  .fillColor('#3d3b3a')
  .text(name, 0, 280, {
    align: 'center'
  });


doc
  .font('Times-Italic')
  .fontSize(16)
  .fillColor('#3d3b3a')
  .text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 450, 495);

  doc.end();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
