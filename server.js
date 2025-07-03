const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎉 Certificate Generator API is running!");
});

app.post(`/generate-certificate`, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name is required");
  }

  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  const fileName = `${name}-certificate.pdf`;
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  const imagePath = path.join(__dirname, "public", "certificate-template.png");

  if (fs.existsSync(imagePath)) {
   
    doc.image(imagePath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    doc
      .font("Times-BoldItalic")
      .fontSize(36)
      .fillColor("#000000")
      .text(name, 0, 263, {
        align: "center",
      });

  
    doc
      .font("Times-Italic")
      .fontSize(18)
      .fillColor("#000000")
      .text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 0, 412, {
        align: "center",
      });

  } else {
  
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(4)
      .stroke("#a68b00");


    doc
      .fontSize(40)
      .fillColor("#1a1a1a")
      .font("Times-Bold")
      .text("Certificate of Achievement", 0, 100, { align: "center" });

   
    doc
      .fontSize(20)
      .fillColor("#333")
      .font("Times-Italic")
      .text("This is proudly presented to", 0, 160, { align: "center" });

  
    doc
      .fontSize(36)
      .fillColor("#000")
      .font("Times-BoldItalic")
      .text(name, 0, 220, { align: "center" });

  
    doc
      .fontSize(16)
      .fillColor("#333")
      .font("Times-Roman")
      .text(
        `For outstanding performance and dedication.`,
        0,
        280,
        { align: "center" }
      );

    
    doc
      .fontSize(14)
      .fillColor("#333")
      .text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 100, 400, {
        align: "left",
      });

   
    doc
      .fontSize(14)
      .fillColor("#333")
      .text("Signature: ______________", -100, 400, {
        align: "right",
      });
  }

  doc.end();
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
