# Local DOS Emulator

A modern web-based DOS emulator that runs entirely in your browser using js-dos. Upload your own boot images and run classic DOS programs locally.

## Features

- 🖥️ **Local Emulation**: Everything runs in your browser, no server required
- 💾 **Custom Boot Images**: Upload your own DOS boot disk images (.jsdos, .img, .ima, .zip)
- 📁 **File Upload**: Add additional files to access in DOS
- 🎨 **Modern UI**: Clean, responsive interface with dark theme
- 🚀 **Free Hosting**: Designed to work with Firebase's free tier

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000)

### Deployment to Firebase

1. Initialize Firebase in your project:
   \`\`\`bash
   firebase init hosting
   \`\`\`
2. Build and deploy:
   \`\`\`bash
   npm run deploy
   \`\`\`

## How to Use

1. **Upload Boot Image**: Upload a DOS boot disk image file
   - Supported formats: .jsdos, .img, .ima, .zip
   - You can create these from existing DOS installations or download FreeDOS images

2. **Add Files (Optional)**: Upload additional files you want to access in DOS

3. **Start Emulator**: Click the Start button to boot your DOS system

## Where to Get Boot Images

- **FreeDOS**: Free, open-source DOS-compatible operating system
- **MS-DOS**: If you have legal copies, you can create boot images
- **Game Collections**: Many classic DOS games come with pre-configured boot images
- **Archive.org**: Has collections of historical DOS software

## Technical Details

- Built with Next.js and React
- Uses js-dos 6.22 for DOS emulation
- Runs entirely client-side (no backend required)
- Compatible with Firebase's free hosting tier
- Responsive design works on desktop and mobile

## File Format Support

- **.jsdos**: Native js-dos format (recommended)
- **.img/.ima**: Floppy disk images
- **.zip**: Compressed archives containing DOS files

## Browser Compatibility

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

This project is open source. js-dos is licensed under GPL v2.
