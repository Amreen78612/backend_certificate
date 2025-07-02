const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-certificate', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }

    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
    });

    const fileName = `${name}-certificate.pdf`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // 1. Add Background Image
    const bgPath = path.join(__dirname, 'certificate-template.png');
    doc.image(bgPath, 0, 0, { width: doc.page.width, height: doc.page.height });

    // 2. Overlay Dynamic Name (centered)
    doc
        .font('Times-BoldItalic')
        .fontSize(36)
        .fillColor('#1a237e')
        .text(name, 0, 200, {
            align: 'center'
        });

    // Optional: Add dynamic date or additional fields
    doc
        .fontSize(14)
        .fillColor('black')
        .text(`Date: ${new Date().toLocaleDateString()}`, 0, 450, {
            align: 'center'
        });

    doc.end();
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
