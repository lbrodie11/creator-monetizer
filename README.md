# Creator Monetizer 💰

> Automatically convert regular product URLs into affiliate links as you paste them - maximize your content monetization effortlessly.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen.svg)](https://chrome.google.com/webstore)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Plasmo](https://img.shields.io/badge/Plasmo-Framework-purple.svg)](https://www.plasmo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Backend-orange.svg)](https://firebase.google.com/)

Creator Monetizer is a powerful Chrome extension built for content creators who want to maximize their affiliate earnings without the hassle of manually converting links. Simply paste any product URL and watch it automatically transform into your personalized affiliate link.

## ✨ Features

### 🔄 **Automatic Link Conversion**
- Paste any supported URL and it's instantly converted to your affiliate link
- Works across Google Docs, WordPress, social media, and any rich text editor
- Real-time conversion with visual feedback notifications

### 🏪 **Multi-Program Support**
- **Amazon Associates** - World's largest affiliate program
- **eBay Partner Network** - Auction and fixed-price items
- **Booking.com Affiliate** - Hotels and travel bookings
- **AliExpress Affiliate** - Global marketplace products
- **Walmart Affiliate** - Major retailer affiliate program
- **Target Affiliate** - Popular US retailer

### ☁️ **Cloud Sync & Security**
- Google Authentication for secure access
- Firebase backend for real-time settings sync
- Works across multiple devices automatically
- Offline functionality with local storage fallback

### 📊 **Analytics Dashboard**
- Track conversion statistics in real-time
- View recent link conversions with timestamps
- Program-specific breakdown and analytics
- Conversion history and trends

### 🛡️ **Smart Validation**
- Real-time affiliate ID validation
- Format checking with helpful suggestions
- Error prevention before saving settings
- Input guidance for each affiliate program

## 🎯 Supported Platforms

Creator Monetizer works seamlessly on:

- **Google Docs** - Documents and presentations
- **WordPress** - Classic and Gutenberg editors
- **Social Media** - Facebook, Twitter, LinkedIn
- **Email Clients** - Gmail, Outlook web
- **Content Management** - Any contenteditable fields
- **Blogging Platforms** - Medium, Ghost, and more

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/creator-monetizer.git
cd creator-monetizer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase configuration

# Build the extension
npm run build
```

### Loading in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-prod` folder

For detailed setup instructions, see our [Setup Guide](SETUP_GUIDE.md).

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or pnpm
- Chrome browser
- Firebase project (for cloud features)

### Development Server

### Development Server
```bash
# Start development server
npm run dev
# or
pnpm dev

# Open Chrome and load build/chrome-mv3-dev
```

### Environment Variables
Create a `.env.local` file with your Firebase configuration:

```env
PLASMO_PUBLIC_FIREBASE_API_KEY=your_api_key
PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
PLASMO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PLASMO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Building for Production
```bash
npm run build
# or
pnpm build
```

## 📁 Project Structure

```
creator-monetizer/
├── src/
│   ├── background/          # Extension background scripts
│   ├── components/          # React UI components
│   ├── config/             # Affiliate program configurations
│   ├── contents/           # Content scripts for page injection
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic and API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions and helpers
├── assets/                 # Static assets and icons
├── popup.tsx              # Extension popup interface
├── options.tsx            # Settings and configuration page
└── package.json           # Dependencies and scripts
```

## 🔧 Technology Stack

- **Framework**: [Plasmo](https://www.plasmo.com/) - Modern browser extension framework
- **Language**: TypeScript for type safety and better DX
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **UI**: React with modern CSS styling
- **Storage**: Chrome Storage API + Firebase Firestore
- **Build**: Webpack with Plasmo's optimized build system

## 🎨 Architecture

### Extension Components
- **Background Script**: Handles settings, URL conversion, and cloud sync
- **Content Scripts**: Detects URLs and performs real-time conversion
- **Popup**: Quick access to toggle and status information
- **Options Page**: Full configuration and analytics dashboard

### Data Flow
1. User pastes URL in supported editor
2. Content script detects and extracts URL
3. Background script converts using affiliate settings
4. Converted URL replaces original in editor
5. Conversion logged for analytics

## 📈 Roadmap

### Version 1.1
- [ ] Click tracking and analytics
- [ ] More affiliate programs (Shopify, Etsy, etc.)
- [ ] Geo-aware link routing
- [ ] Bulk link conversion tool

### Version 1.2
- [ ] Mobile app companion
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] API access for power users

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/creator-monetizer/issues)
- 📖 Documentation: [Setup Guide](SETUP_GUIDE.md)

---

**Creator Monetizer** - Making affiliate marketing effortless for content creators worldwide.

*Built with ❤️ by creators, for creators.*
