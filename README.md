![image](https://github.com/user-attachments/assets/7a9311b3-86a5-4250-9225-769e6c00ba5a)
# Obsidian Share

A powerful tool designed to seamlessly share your Obsidian notes with colleagues and friends through secure, unique URLs.

## Features

- **Multiple Export Formats**: Download shared notes as PDF, HTML, or MD
- **URL Management**: Generate shortened URLs for easy sharing
- **Security**: Password protection for sensitive documents
- **File Control**: Delete shared URLs when no longer needed
- **Cost-Effective**: 100% free and open source
- **One-Click Sharing**: Streamlined sharing process

## Project Structure
```
obsidian-share/
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   └── styles/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileUpload.ts
│   │   ├── URLGenerator.ts
│   │   ├── PasswordProtect.ts
│   │   └── FileConverter.ts
│   ├── services/
│   │   ├── urlService.ts
│   │   ├── fileService.ts
│   │   └── authService.ts
│   ├── utils/
│   │   ├── fileConverter.ts
│   │   └── urlShortener.ts
│   └── App.ts
├── config/
│   ├── vite.config.ts
│   └── tsconfig.json
├── tests/
│   └── unit/
└── package.json
```

## Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

```bash
git clone https://github.com/yourusername/obsidian-share.git
cd obsidian-share
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## How to Use

### 1. File Upload
- Navigate to the web interface
- Click "Upload File" or drag and drop your Obsidian note
- Supported formats: .md, .markdown, .txt
![image](https://github.com/user-attachments/assets/ceb45a49-75eb-4c56-99c5-ff52e1fc5f9b)


### 2. URL Generation
- After upload, click "Generate URL"
- Choose URL type:
  - Standard URL
  - Short URL (recommended for sharing)
  ![image](https://github.com/user-attachments/assets/36538e24-d891-4e52-a20f-5f9019ce26d6)


### 3. Share URL
- Copy the generated URL using the "Copy" button
- Share via email, messaging apps, or any communication platform
- Recipients can access the note through their web browser
![image](https://github.com/user-attachments/assets/d6e9c423-b877-49bc-a5db-37e9a1a5ef4e)

### 4. Security Options
- Enable password protection:
  1. Click "Protect File"
  2. Set a strong password
  3. Share the password separately with intended recipients
![image](https://github.com/user-attachments/assets/f7d9f37f-5c8e-468b-b99a-2db56611d6ce)


### 5. File Download Options
Recipients can download the shared file in multiple formats:
- PDF: Best for printing and offline reading
- HTML: Web-friendly format
- MD: Edit in VS Code, Obsidian, or other markdown editors
![image](https://github.com/user-attachments/assets/195812f6-2b14-4465-90b7-f39e85272615)

## Security Considerations

- All files are encrypted in transit
- URLs expire after 30 days of inactivity
- No sensitive data is stored on servers


## Technical Stack

- Frontend: Vue.js + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- File Storage: S3-compatible storage
- URL Shortener: Custom implementation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

- GitHub Issues: For bug reports and feature requests
- Email Support: akshath0703@gmail.com


![391246837-07b16e6e-d07c-44d6-8b21-8717e7ff5d04](https://github.com/user-attachments/assets/bf704d04-1861-4995-9dc2-bd5c281b0a83)
