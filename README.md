# Welcome to the VibeCheck Web Application

This application is meant to serve most usecases that students are likely to have when using the VibeCheck sensor system for vibration measurement and data visualization. It is built using modern web front end frameworks.

<p align="center">
  <img src="./src/public/VibeCheck_Web_example.png" >
</p>


## Connect your VibeCheck hardware:
[Try the site for yourself!](https://harrislab-brown.github.io/VibeCheck_Web/)

## Browser Compatability
The VibeCheck_Web relies on the WebSerial API for communication with hardware devices. It's important to note that the WebSerial API is not supported by all browsers. Here's a detailed compatibility breakdown:

## Compatible Browsers

- Google Chrome: Version 89 or later
- Microsoft Edge: Version 89 or later (Chromium-based Edge)
- Opera: Version 76 or later

## Incompatible Browsers

- Mozilla Firefox: No support (as of October 2024)
- Safari: No support (as of October 2024)
- Internet Explorer: No support

## Mobile Browsers

The WebSerial API is primarily designed for desktop use. As of October 2024:

- No mobile browsers officially support the WebSerial API
- Chrome for Android may have experimental support, but it's not reliable for production use

## Notes on Compatibility

1. **Chrome OS**: Fully supports the WebSerial API.

2. **Linux**: Support can vary depending on the system configuration. Users may need to add themselves to the `dialout` group or adjust udev rules to access serial ports.

3. **Windows**: Requires no additional setup for most users.

4. **macOS**: Users may need to install drivers for certain USB-to-Serial adapters.


## Checking for Browser Support

VibeCheck_Web checks for browser compatibility on startup. If your browser is compatible, the system status message will reflect this and the 'connect' button will be selectable. Clicking it will open a dialog box to select a serial port from the available options. If your VibeCheck hardware is connected, it will appear as a device called 'VibeCheck.' If your browser is not compatible, the system status message will give a compatibility error and the connect button will be grayed out.

To check compatibility without the VibeCheck_Web app, you can use the following JavaScript code to check if the current browser supports the WebSerial API:

```javascript
if ('serial' in navigator) {
  console.log('This browser supports WebSerial');
} else {
  console.log('This browser does not support WebSerial');
}
```


# Developer Guide

This app is based on Vite + React + Redux. The folder heirarchy for this project is meant to be descriptive of the function of each file that makes up the app.

```
UPDATE:: THIS IS NO LONGER CORRECT WITH NEW APP STRUCTURE

vibecheck_web/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Logo.tsx
│   │   ├── SerialConnect.tsx
│   │   └── SystemStatus.tsx
│   ├── features/
│   │   ├── serialSlice.ts
│   │   └── systemStatusSlice.ts
│   ├── middleware/
│   │   └── serialDataMiddleware.ts
│   ├── redux/
│   │   ├── hooks.ts
│   │   ├── rootReducer.ts
│   │   └── store.ts
│   ├── services/
│   │   └── SerialService.ts
│   ├── styles/
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── Layout.css
│   │   └── SerialConnect.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── appInitialization.ts
│   │   └── dataParser.ts
│   ├── assets/
│   │   └── VibeCheck_Logo.png
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── README.md
└── index.html
```


## Installation Guide

This guide will walk you through the process of setting up and running the VibeCheck app on your local development environment.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or Yarn (v1.22.0 or later)
- Git

### Step 1: Clone the Repository

First, clone the VibeCheck repository to your local machine:

```bash
git clone https://github.com/harrislab-brown/VibeCheck.git
cd VibeCheck_Web
```

### Step 2: Install Dependencies

Install the project dependencies using npm or Yarn:

```bash
# If using npm
npm install

# If using Yarn
yarn install
```

### Step 3: Configure the Environment

If there are any environment-specific configurations, create a `.env` file in the root directory of the project and add the necessary variables. For example:

```
VITE_API_URL=http://localhost:3000
```

### Step 4: Run the Development Server

Start the development server:

```bash
# If using npm
npm run dev

# If using Yarn
yarn dev
```

This will start the Vite development server. The console will display the URL where you can access the app, typically `http://localhost:5173`.

### Step 5: Accessing the App

Open your web browser and navigate to `http://localhost:5173` (or the URL provided in the console). You should now see the VibeCheck app running.

### Additional Commands

- To build the app for production:
  ```bash
  npm run build
  # or
  yarn build
  ```

### Troubleshooting

- If you encounter any issues with dependencies, try deleting the `node_modules` folder and the `package-lock.json` (or `yarn.lock`) file, then run the installation step again.
- Ensure you're using a compatible version of Node.js as specified in the `package.json` file.
- For any WebSerial API related issues, make sure you're using a compatible browser (Chrome, Edge, or Opera) and that your system supports WebSerial.

### Development Notes

- This app uses React with TypeScript and Vite as the build tool.
- State management is handled by Redux Toolkit.
- The app communicates with the VibeCheck hardware using the WebSerial API.

If you encounter any issues or have questions, please refer to the project's issue tracker on GitHub or contact the development team.
