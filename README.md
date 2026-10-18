# Student Account Generator

A TypeScript-based tool for generating student accounts from Excel spreadsheets, with support for both web and desktop builds.

## Features

- Import student lists from Excel (`.xlsx`)
- Automatically generate usernames and initial passwords
- Normalize Vietnamese names and detect duplicate usernames
- Preview generated accounts before exporting
- Export account lists to Excel (`.xlsx`)
- Build for web or Windows desktop using Electron

## Tech Stack

- TypeScript
- Vite
- ExcelJS
- Electron
- electron-builder

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for web

```bash
npm run build:web
```

### Build the desktop application

```bash
npm run build:app
```

## Security

- Student data is processed locally on the user's device.
- Generated account files may contain sensitive information and must be stored securely.
- Initial passwords should be changed after the first login.
- Never commit student records, generated account files, or credentials to version control.

## License

See [LICENSE](LICENSE) for license information.
