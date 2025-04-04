import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Routes from './routes/createLandingPageRoutes';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api', Routes);
app.use('/api/pexels_images', express.static(path.join(__dirname, 'pexels_images')));
app.use('/dist', express.static(path.join(__dirname, '../frontend/dist')));
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.post("/api/saveLandingPage", (req: any, res: any) => {
  const { html, userPrimaryColor, userSecondaryColor, userTertiaryColor, userTextColor, userFont } = req.body;
  if (!html) {
    return res.status(400).json({ error: "Missing HTML content" });
  }

  const completeHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Landing Page</title>
    <link rel="stylesheet" href="http://localhost:3000/dist/assets/index-uoALyoE3.css">
    <style>
      :root {
        --primary-color: ${userPrimaryColor};
        --secondary-color: ${userSecondaryColor};
        --tertiary-color: ${userTertiaryColor};
        --text-color: ${userTextColor};
        --font: ${userFont};
      }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>
  `;

  const fileName = `landingPage-${Date.now()}.html`;
  const folderPath = path.join(__dirname, "landingPages");
  const filePath = path.join(folderPath, fileName);

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
      return res.status(500).json({ error: "Server error" });
    }

    fs.writeFile(filePath, completeHTML, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).json({ error: "Server error" });
      }
      res.status(200).json({ message: "Landing page saved", file: fileName });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});

export default app;
