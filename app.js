// Importing all dependencies
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const {
    createWorker
} = require('tesseract.js');

// Initialize tesseract worker and setup logger to monitor process
const worker = createWorker({
    logger: m => console.log(m)
});

// Setup storage options to upload file inside upload directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

// Initialize upload with storage options
const upload = multer({
    storage
}).single('avatar');

// Setup view engine to use ejs files as HTML template
app.set("view engine", "ejs");
app.use(express.static("public"));

// Rendered index.ejs on main route ('/') by using render method
app.get('/', (req, res) => res.render('index'));

// Defined API for handle all requests comes on /upload route (or from index's submit btn click)
app.post('/upload', (req, res) => {

    // Stored file into upload directory
    upload(req, res, err => {
        console.log(req)
        // Reading uploaded file from upload directory
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {

            // Displaying error if anything goes wrong
            if (err) return console.error("this is error", err);

            // Self execution function to use async await
            (async () => {
                // Tesseract worker loaded with language option
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');

                // Document extraction by recognize method of Tesseract and console result
                const {
                    data: {
                        text
                    }
                } = await worker.recognize(data);
                console.log(text);

                // Used getPDF method to generate pdf and stored it into app directory by using writeFile
                const {
                    data: pdfData
                } = await worker.getPDF('Tesseract OCR Result');
                fs.writeFileSync(`${req.file.originalname}.pdf`, Buffer.from(pdfData));
                console.log(`Generate PDF: ${req.file.originalname}.pdf`);

                // Respond send to view with result text and terminated worker after process complete
                res.send(text);
                await worker.terminate();
            })();
        })
    })
})

// Defining port and start app
const PORT = 5000;
app.listen(PORT, () => console.log("App is running on", PORT));
