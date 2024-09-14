const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { OpenAIApi } = require('openai'); // Import OpenAIApi directly
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize OpenAI API
const openai = new OpenAIApi({
  apiKey: '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' /*process.env.OPENAI_API_KEY,*/ // Use API key from .env
});

app.use(express.static('public'));

// Route to handle file upload and PDF processing
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const pdfData = await pdfParse(req.file); // Parse the uploaded PDF
    const text = pdfData.text;

    // Generate HTML resume using OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Convert the following text into an HTML resume:\n\n${text}`,
      max_tokens: 2000,
    });

    const htmlResume = response.data.choices[0].text;
    res.send(htmlResume); // Send the generated HTML resume back to the client
  } catch (error) {
    res.status(500).send('Error processing the PDF.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
