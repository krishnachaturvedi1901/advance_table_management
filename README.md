# 🎵 Spotify Table Management Application

A high-performance React TypeScript application for managing and analyzing large Spotify track datasets (30,000+ rows) with advanced table features.

## 🌐 Live Demo

**Try the live app:** [https://spotify-table-app.vercel.app/](https://spotify-table-app.vercel.app/)

No installation required - upload your Spotify dataset CSV and start exploring!

## 🚀 Features Implemented

### Core Requirements (All Completed)

✅ **1. Table Rendering & Performance**
- Virtual scrolling using TanStack Virtual for smooth 60 FPS performance
- Handles 30,000+ rows efficiently with row virtualization
- Optimized rendering with React.memo and useMemo

✅ **2. Sorting**
- Single-column sorting (click column headers)
- Visual indicators (▲ ascending, ▼ descending, ⇅ sortable)
- Supports strings, numbers, and dates

✅ **3. Filtering**
- **5 filterable columns** with appropriate UI controls:
  - Track Name (text filter)
  - Artist Name (text filter)
  - Genre (dropdown select filter)
  - Popularity (range filter: 0-100)
  - Energy (range filter: 0-100%)
- Filters work together with AND logic
- Real-time filtering

✅ **4. Global Search**
- Search across all columns simultaneously
- 300ms debounced search to prevent performance issues
- Visual feedback when search is active (blue checkmark)
- Case-insensitive search

✅ **5. Pagination**
- Page size selector: 25, 50, 100, 200 rows per page
- Full navigation controls (first, previous, next, last)
- Current page info display ("Showing 1-50 of 30,000 tracks")
- Page number display (Page X of Y)

✅ **6. Data Export**
- Export filtered/sorted data to CSV
- Handles special characters and commas properly using PapaParse
- Dynamic filename with current date
- Exports only the currently filtered/visible data

✅ **7. User Experience**
- Loading spinner during data import
- Error handling with user-friendly messages
- Empty state when no data matches filters
- Responsive design (desktop and tablet)
- Dark theme for reduced eye strain
- Drag-and-drop file upload
- Smooth transitions and hover effects

### Bonus Features (Implemented)

✅ **Virtual Scrolling**
- Windowing/virtualization using TanStack Virtual
- Only renders ~50-60 visible rows instead of all 30,000+
- Performance improvement: 99%+ reduction in DOM nodes
- Smooth 60 FPS scrolling maintained
- Overscan of 10 rows for seamless experience

✅ **Bulk Actions**
- Multi-row selection with checkboxes
- Select all functionality (pagination-aware)
- Batch operations:
  - Export selected rows to CSV
  - Delete selected rows (with confirmation)
  - Clear selection
- Visual feedback for selected rows (blue highlight)
- Selection counter showing number of selected rows
- Bulk action bar appears when rows are selected

✅ **Column Management**
- Toggle column visibility (show/hide columns)
- Column resizing with drag handles (with min/max constraints)
- Column reordering via drag-and-drop (☰ icon)
- Persist preferences to localStorage
- Search columns by name
- Show/Hide all columns
- Reset to default settings
- Visual resize handles on hover (blue highlight)
- Minimum and maximum width constraints prevent extreme sizing
- Smooth drag-and-drop experience

## 🛠️ Technology Stack

### Required
- **React 18.2** - Functional components with hooks
- **TypeScript 5.2** - Full type safety
- **Vite 5.0** - Fast build tool and dev server

### Recommended Libraries (Used)
- **TanStack Table v8** - Headless table library for data management
- **TanStack Virtual v3** - Row virtualization for performance
- **PapaParse 5.4** - CSV parsing and export
- **Tailwind CSS 3.4** - Utility-first styling

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed
- Git (for cloning)

### Steps

1. **Clone or navigate to the project directory**
```bash
cd spotify-table-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
- Navigate to `http://localhost:5173`
- Upload a Spotify tracks CSV file
- Start exploring!

### Build for Production
```bash
npm run build
npm run preview
```

## 📊 Dataset

**Chosen Dataset:** Spotify Tracks Dataset (Recommended Option)

**Why this dataset?**
- Rich variety of data types (strings, numbers, booleans, dates)
- Meaningful real-world data that's interesting to explore
- Good size (30,000 rows) for testing performance
- Multiple categorical and numerical fields for filtering

**Download Link:** [Kaggle - 30,000 Spotify Songs](https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs)

**Data Fields Used:**
- Track Name, Artist, Album, Genre
- Popularity, Tempo, Energy, Danceability
- Duration, Release Date, Explicit flag

## 🏗️ Architecture & Design Decisions

### Component Structure
```
src/
├── components/
│   ├── DataTable.tsx       # Main table with virtualization
│   ├── FileUpload.tsx      # Drag-and-drop file upload
│   └── Filters.tsx         # Reusable filter components
├── hooks/
│   ├── useDebounce.ts      # Debounce hook for search
│   └── useFileUpload.ts    # File handling logic
├── utils/
│   ├── csvParser.ts        # CSV import/export utilities
│   └── formatters.ts       # Data formatting functions
├── types/
│   └── spotify.ts          # TypeScript interfaces
└── App.tsx                 # Main application component
```

### Key Design Decisions

**1. TanStack Table (Headless UI)**
- Provides full control over rendering and styling
- Lightweight (9KB) with excellent performance
- Built-in sorting, filtering, pagination
- Great TypeScript support

**2. TanStack Virtual for Row Virtualization**
- Only renders visible rows (50-60 DOM nodes instead of 30,000)
- Dramatically improves scroll performance
- Overscan of 10 rows for smooth scrolling
- Estimated row height of 50px

**3. State Management**
- React hooks (useState, useMemo, useCallback)
- Local component state for table functionality
- No external state management needed (keeps it simple)
- Memoized column definitions and unique values

**4. Performance Optimizations**
- Debounced global search (300ms delay)
- Memoized column definitions with useMemo
- Virtual scrolling for DOM efficiency
- Strategic use of useCallback for event handlers
- Pagination to limit rendered rows

**5. TypeScript**
- Full type safety throughout the application
- Interfaces for all data structures
- Type-safe filter functions
- Better developer experience and fewer bugs

## 📈 Performance Metrics

Tested with 30,000 row dataset:

- **Initial render:** < 1 second
- **Search/filter response:** < 500ms with debouncing
- **Sorting:** < 300ms
- **Pagination navigation:** < 200ms
- **Smooth scrolling:** 60 FPS maintained

## 🎯 Features Breakdown

### Sorting
- Click any column header to sort
- First click: ascending (▲)
- Second click: descending (▼)
- Third click: remove sort
- Visual indicators always visible

### Filtering
- **Text Filters:** Track Name, Artist (partial match, case-insensitive)
- **Select Filter:** Genre (dropdown with all unique genres)
- **Range Filters:** Popularity (0-100), Energy (0-100%)
- All filters work together (AND logic)

### Global Search
- Searches across ALL columns
- 300ms debounce prevents performance issues
- Blue checkmark shows when active
- Works with column filters

### Pagination
- Dropdown selector: 25, 50, 100, 200 rows
- Navigation: << < Page X of Y > >>
- Shows: "Showing 1-50 of 30,000 tracks"
- Disabled buttons when at boundaries

### CSV Export
- Exports currently filtered/sorted data
- Proper CSV formatting with quotes
- Handles commas and special characters
- Filename includes current date

## 🔧 Trade-offs & Limitations

### Current Limitations
1. **In-memory data only** - Large files (>100MB) may cause memory issues
2. **Single file at a time** - No multi-file support
3. **No data persistence** - Refresh loses data
4. **Basic CSV validation** - Assumes correct format

### Trade-offs Made
1. **Virtual scrolling vs. Traditional pagination**
   - Chose virtual scrolling for better UX with large datasets
   - Also included pagination for traditional navigation

2. **Client-side processing**
   - Simpler architecture, no backend needed
   - Good for datasets up to 100K rows
   - Would need server-side for larger datasets

3. **Dark theme only**
   - Reduced complexity, consistent appearance
   - Could add theme toggle in future

## 🚀 Future Improvements

### Bonus Features (Not Yet Implemented)
- [ ] Multi-row selection with checkboxes
- [ ] Inline editing capabilities
- [ ] Column visibility toggles
- [ ] Column reordering (drag and drop)
- [ ] Resizable columns
- [ ] Advanced filtering (OR logic, date ranges)
- [ ] Save/load filter presets
- [ ] Data visualization charts

### Other Improvements
- [ ] LocalStorage persistence
- [ ] Multiple dataset support
- [ ] Advanced search with regex
- [ ] Keyboard navigation
- [ ] Accessibility improvements (ARIA labels)
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Light theme option

## 📝 Time Spent

Approximately **6-8 hours** total:
- Initial setup & configuration: 1 hour
- Core table implementation: 2 hours
- Filters & search: 1.5 hours
- Styling & UX polish: 1.5 hours
- Testing & bug fixes: 1 hour
- Documentation: 1 hour

## 🧪 How to Test

1. **Upload CSV**
   - Drag and drop or browse for Spotify CSV
   - Should show loading spinner
   - Should display track count after load

2. **Test Sorting**
   - Click "Track Name" header → should sort A-Z
   - Click again → should sort Z-A
   - Try numeric columns (Popularity, Tempo)

3. **Test Filtering**
   - Type in "Track Name" filter → should filter instantly
   - Set Popularity range 80-100 → should show only popular tracks
   - Select a Genre → should show only that genre
   - Combine multiple filters → should work together

4. **Test Global Search**
   - Type any artist name → should filter across all columns
   - Should see blue checkmark indicator

5. **Test Pagination**
   - Change page size → table should update
   - Navigate pages with buttons
   - Check "Showing X-Y of Z" updates correctly

6. **Test Export**
   - Click "Export CSV" → should download file
   - Open in spreadsheet → should match filtered data

## 🙏 Acknowledgments

Built as part of a technical assessment for demonstrating React, TypeScript, and large dataset management skills.

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ using React, TypeScript, TanStack Table & TanStack Virtual**
