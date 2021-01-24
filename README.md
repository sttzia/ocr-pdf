# ocr-pdf
From https://www.youtube.com/watch?v=a1I3tcALTlc and https://www.youtube.com/watch?v=LsO1Mvn8M0I&amp;t=211s

1. First of all you have to make a package.json file using <npm init -y>
2. Install necessary dependencies <npm install ejs express multer tesseract.js>
3. Install nodemon using <npm install --save-dev nodemon>
4. Edit "scripts" on package.json using <"start": "nodemon app.js">
5. Start server using <npm start>
6. The folder uploads is used for every photo file you use. For example, eng_bw.png is a test file for OCR
7. Use a browser to redirect to <localhost:5000> and choose the photo file
8. The application will output a PDF file eng_bw.png.pdf and inside the uploads folder a similar enf_bw.png file will be created
9. File testocr.png is another photo file
10. Output PDF files are created on the ocr-pdf directory
