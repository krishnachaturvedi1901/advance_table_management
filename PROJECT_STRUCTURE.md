# 📁 Project Structure

```
spotify-table-app/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tsconfig.node.json           # TypeScript config for Node
│   ├── vite.config.ts               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .eslintrc.cjs                # ESLint rules
│   └── .gitignore                   # Git ignore patterns
│
├── 📄 Documentation
│   ├── README.md                    # Complete project documentation
│   ├── QUICKSTART.md                # Quick start guide
│   └── PROJECT_STRUCTURE.md         # This file
│
├── 🌐 Entry Points
│   ├── index.html                   # HTML entry point
│   └── src/
│       ├── main.tsx                 # React entry point
│       ├── App.tsx                  # Main App component
│       └── index.css                # Global styles with Tailwind
│
├── 🧩 Components (src/components/)
│   ├── DataTable.tsx                # Main table with TanStack Table + Virtual
│   │   ├── ✓ Column definitions
│   │   ├── ✓ Sorting logic
│   │   ├── ✓ Filtering logic
│   │   ├── ✓ Pagination controls
│   │   ├── ✓ Global search
│   │   ├── ✓ Virtual scrolling
│   │   ├── ✓ Row selection (checkboxes)
│   │   ├── ✓ Bulk actions
│   │   └── ✓ CSV export button
│   │
│   ├── FileUpload.tsx               # Drag-and-drop file upload
│   │   ├── ✓ Drag and drop support
│   │   ├── ✓ File input
│   │   └── ✓ Loading states
│   │
│   ├── Filters.tsx                  # Reusable filter components
│   │   ├── TextFilter               # For string columns
│   │   ├── RangeFilter              # For numeric columns
│   │   └── SelectFilter             # For categorical columns
│   │
│   └── PerformanceMetrics.tsx       # Virtual scrolling metrics display
│       ├── ✓ Performance stats
│       ├── ✓ DOM node comparison
│       └── ✓ Improvement percentage
│
├── 🪝 Custom Hooks (src/hooks/)
│   ├── useDebounce.ts               # Debounce hook for search
│   │   └── Returns debounced value after delay
│   │
│   └── useFileUpload.ts             # File upload logic
│       ├── Handles CSV parsing
│       ├── Loading states
│       └── Error handling
│
├── 🛠️ Utilities (src/utils/)
│   ├── csvParser.ts                 # CSV operations
│   │   ├── parseCSV()              # Parse uploaded CSV file
│   │   └── exportToCSV()           # Export data to CSV
│   │
│   └── formatters.ts                # Data formatting
│       ├── formatDuration()        # ms to MM:SS
│       ├── formatPercentage()      # decimal to %
│       ├── formatNumber()          # number formatting
│       └── debounce()              # Generic debounce function
│
├── 📐 Types (src/types/)
│   └── spotify.ts                   # TypeScript interfaces
│       ├── SpotifyTrack            # Track data structure
│       ├── ColumnFilter            # Filter state
│       └── TableState              # Table state
│
└── 🎨 Styling
    ├── Tailwind CSS (utility classes)
    ├── Dark theme (gray-900, gray-800, gray-700)
    └── Responsive design (mobile-first)
```

## Component Hierarchy

```
App
├── FileUpload (when no data)
└── DataTable (when data loaded)
    ├── Global Search Input
    ├── Export Button
    ├── Table Container (virtual scrolling)
    │   ├── Table Header
    │   │   ├── Column Headers (sortable)
    │   │   └── Filter Row
    │   │       ├── TextFilter
    │   │       ├── RangeFilter
    │   │       └── SelectFilter
    │   └── Table Body (virtualized rows)
    └── Pagination Controls
        ├── Page Size Selector
        └── Navigation Buttons
```

## Data Flow

```
1. User uploads CSV
   ↓
2. useFileUpload hook
   ↓
3. parseCSV utility
   ↓
4. SpotifyTrack[] array
   ↓
5. DataTable component
   ↓
6. TanStack Table processing
   ├── Sorting
   ├── Filtering
   ├── Pagination
   └── Global search
   ↓
7. TanStack Virtual rendering
   ↓
8. Display in browser
```

## Key Files Explained

### Core Application
- **App.tsx**: Main component, manages file upload state, renders FileUpload or DataTable
- **DataTable.tsx**: Complex table component (350+ lines), handles all table features
- **index.css**: Global Tailwind setup and base styles

### Table Features
- **Sorting**: Built into DataTable.tsx using TanStack Table's sorting API
- **Filtering**: Column filters in DataTable.tsx + Filter components in Filters.tsx
- **Search**: Global filter state with debouncing using useDebounce hook
- **Pagination**: TanStack Table's pagination API with custom controls
- **Virtual Scrolling**: TanStack Virtual for performance
- **Export**: exportToCSV utility called from DataTable

### Type Safety
- All components use TypeScript
- Strict mode enabled
- Proper interfaces for all data structures
- Type-safe filter functions

### Performance Optimizations
- useMemo for column definitions and derived data
- useCallback for event handlers
- Debounced search (300ms)
- Virtual scrolling (only renders ~50 DOM nodes)
- Memoized unique values for filters

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (hot reload enabled)
npm run dev

# Type check
tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack Breakdown

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18.2 | UI rendering |
| **Language** | TypeScript 5.2 | Type safety |
| **Build Tool** | Vite 5.0 | Fast dev server & bundling |
| **Table** | TanStack Table v8 | Data management |
| **Virtualization** | TanStack Virtual v3 | Performance |
| **CSV** | PapaParse 5.4 | CSV parsing/export |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **State** | React Hooks | Local state management |

## File Size Estimates

```
Source Code:
├── Components:    ~1,000 lines
├── Hooks:         ~50 lines
├── Utils:         ~100 lines
├── Types:         ~30 lines
└── Config:        ~100 lines
Total:             ~1,280 lines of code

Bundle Size (estimated):
├── React + ReactDOM:     ~150 KB
├── TanStack Table:       ~40 KB
├── TanStack Virtual:     ~15 KB
├── PapaParse:            ~50 KB
├── App code:             ~30 KB
└── Total (gzipped):      ~85 KB
```

## Next Steps for Scaling

To handle even larger datasets (1M+ rows):
1. Implement server-side pagination
2. Add database integration (PostgreSQL, MongoDB)
3. Use React Query for data fetching
4. Add Redis caching layer
5. Implement infinite scrolling
6. Add Web Workers for CSV parsing
7. Use IndexedDB for client-side caching

---

This structure follows React best practices:
- ✅ Component composition
- ✅ Custom hooks for reusable logic
- ✅ Separation of concerns
- ✅ Type safety
- ✅ Performance optimization
- ✅ Clean code organization
