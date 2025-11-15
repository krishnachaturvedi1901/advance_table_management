# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm 9 or higher (`npm --version`)

## Installation (3 steps)

```bash
# 1. Navigate to project directory
cd spotify-table-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## First Use

1. **Get the Dataset**
   - Download from: https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs
   - Save the CSV file to your computer

2. **Upload Data**
   - Drag and drop the CSV file onto the upload area
   - OR click "Choose File" to browse

3. **Explore**
   - Click column headers to sort
   - Use filter inputs below headers
   - Try the global search bar
   - Export filtered results

## Key Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **Sort** | Click any column header |
| **Filter** | Use input fields below column headers |
| **Search** | Type in the search bar at top |
| **Export** | Click "Export CSV" button |
| **Pagination** | Use dropdown and arrow buttons at bottom |

## Troubleshooting

### npm not recognized
Install Node.js from https://nodejs.org/

### Port 5173 already in use
```bash
# Kill the process or change port in vite.config.ts
```

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CSV won't upload
- Ensure file is .csv format
- Check file isn't corrupted
- Try different browser

## Performance Tips

- Use pagination for very large datasets (100K+ rows)
- Enable virtual scrolling for smooth scrolling
- Use filters to narrow down data before exporting
- Keep page size reasonable (50-100 rows)

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code in `src/` directory
- Try building for production: `npm run build`

---

Need help? Check the README or raise an issue!
