# Generic Landing Page 🚀

This repository contains a dynamic landing page project that allows users to create a personalized, custom-designed landing page by entering a few details. The project features advanced customization options including color and font adjustments, drag and drop functionality, and full responsiveness across mobile, tablet, and desktop devices.

## Overview

The project was developed as part of a college final assignment. It enables a customer to:
- Input their details via a dynamic form.
- Receive a tailor-made landing page that reflects their personal style and requirements.
- Enjoy a range of customization options including color combinations, font selections, and layout modifications.

Additionally, the project leverages **concurrently** to manage dependencies and run multiple processes simultaneously. This ensures that on executing `npm run dev`, the necessary node modules for both project directories are installed and both servers are launched efficiently.

## Features

- **Dynamic Landing Page Generation:** Users input details and get a personalized landing page.
- **Customization Options:**
  - 🎨 Change colors using a color combo tool.
  - 🔠 Adjust the font style.
  - ➕ Add or remove sections as needed.
  - 🖱️ Utilize drag and drop functionality to rearrange page elements.
  - ✍️ Modify text in consultation with Gemini for optimal marketing tone and messaging.
- **Responsive Design:** The landing page is fully responsive on mobile, tablet, and desktop devices.
- **Concurrently Managed Processes:** Uses `concurrently` to install dependencies and run servers in parallel.

## How It Works

1. **User Input:** The customer enters their personal details and customization preferences.
2. **Dynamic Generation:** Based on the input, a custom landing page is generated.
3. **Customization & Responsiveness:** Users can further refine the design by adjusting colors, fonts, and layout sections through an intuitive UI, including drag and drop features.
4. **Server Management:** The project uses `concurrently` to streamline setup. Running `npm run dev` installs the necessary node modules for both directories and starts the servers concurrently. The frontend is accessible via [http://localhost:5173](http://localhost:5173) while the backend runs on [http://localhost:3000](http://localhost:3000).

## Installation & Setup

To get started with the project, clone the repository and install the required dependencies:

# Clone the repository
git clone https://github.com/matanCohenDev/Generic-Landing-page.git

# Navigate into the project directory
cd Generic-Landing-page

# Install dependencies and run the project concurrently
npm run dev
