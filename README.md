# Sysmon Threat Analyzer

A web-based threat detection and analysis platform that maps Windows Sysmon logs to MITRE ATT&CK techniques.

## Features

- 📤 **Upload Sysmon Logs**: Drag-and-drop CSV file upload
- 🔍 **Automated Analysis**: Parse and analyze Sysmon events
- 🎯 **MITRE ATT&CK Mapping**: Automatically map detections to MITRE techniques
- 📊 **Visual Dashboard**: Interactive visualizations of threat timeline and severity
- 📥 **Export Reports**: Download comprehensive analysis reports

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase (Auth & Storage)
- React Router

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utilities and parsers
├── types/         # TypeScript type definitions
└── config/        # Configuration files
```