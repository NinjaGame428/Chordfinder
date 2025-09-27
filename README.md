# Chords Finder 🎵

A comprehensive gospel music application for finding chords, lyrics, and resources for worship ministry.

## 🌟 Features

- **🎵 Song Library**: Browse and search through gospel songs with chord charts
- **👥 Artist Profiles**: Discover gospel artists and their popular songs
- **📚 Resources**: Download music resources, guides, and educational materials
- **🔐 User Authentication**: Create accounts, save favorites, and manage profiles
- **⭐ Rating System**: Rate songs and resources, read reviews
- **🌐 Multilingual Support**: Available in English and French
- **📱 Responsive Design**: Works perfectly on all devices
- **🛠️ Admin Panel**: Full content management system for administrators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chords-finder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.7
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: Vercel

## 📁 Project Structure

```
chords-finder/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── artists/           # Artist pages
│   ├── songs/             # Song pages
│   ├── resources/         # Resource pages
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Shadcn/UI components
│   ├── navbar/           # Navigation components
│   └── ...
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🎯 Key Pages

- **Homepage** (`/`): Welcome page with search and featured content
- **Songs** (`/songs`): Browse and search gospel songs
- **Artists** (`/artists`): Discover gospel artists
- **Resources** (`/resources`): Download music resources
- **Dashboard** (`/dashboard`): User profile and favorites
- **Admin** (`/admin`): Content management (admin only)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file for environment variables:

```env
# Add your environment variables here
```

## 🚀 Deployment

The application is deployed on Vercel:

**Live URL**: [https://chords-finder.vercel.app](https://chords-finder.vercel.app)

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- **Powered by**: [Heavenkeys Ltd](https://heavenkeys.ca)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com)
- **Icons**: [Lucide](https://lucide.dev)

## 📞 Support

For support, email support@heavenkeys.ca or visit our [contact page](https://chords-finder.vercel.app/contact).

---

Made with ❤️ for the gospel music community