  # SWP391
  ## Project Structure

  The project follows a **feature-based structure**, grouping code by feature (e.g., auth, blog, appointment) and role (e.g., patient, doctor, admin). Below is the folder structure:


  my-react-app/
  ├── public/                     # Static assets
  │   ├── index.html             # Main HTML file
  │   ├── favicon.ico
  │   └── assets/                # Images, fonts, etc.
  │
  ├── src/                       # Source code
  │   ├── assets/                # Dynamic assets (images, fonts)
  │   │   ├── images/
  │   │   ├── fonts/
  │   │
  │   ├── components/            # Reusable UI components
  │   │   ├── common/           # Basic UI components (Button, Input, Card)
  │   │   ├── layout/           # Layout components (Header, Footer, Sidebar)
  │   │
  │   ├── features/             # Feature-based modules
  │   │   ├── auth/             # Authentication (Login, Register, Logout)
  │   │   ├── website/          # Website info (Guest landing page)
  │   │   ├── blog/             # Blog features (List, Detail, Search, Comment)
  │   │   ├── doctor/           # Doctor info (List, Detail, Search)
  │   │   ├── appointment/      # Appointment features (Book, Manage, Confirm)
  │   │   ├── patient/          # Patient features (Profile, Treatment, Prescriptions)
  │   │   ├── treatment/        # Treatment protocols and plans
  │   │   ├── feedback/         # Feedback submission and management
  │   │   ├── document/         # Document management (Upload, View)
  │   │   ├── user/             # User management (Admin)
  │   │   ├── schedule/         # Schedule management (Admin)
  │   │   ├── medicine/         # Medicine management (Admin)
  │   │
  │   ├── hooks/                # Custom hooks (useAuth, useFetch)
  │   ├── services/             # API services (axiosInstance)
  │   ├── contexts/             # Context API (AuthContext, RoleContext)
  │   ├── routes/               # Routing (PrivateRoute, RoleBasedRoute)
  │   ├── utils/                # Utilities (formatDate, validators)
  │   ├── styles/               # Global styles (global.css, variables.css)
  │   ├── App.jsx               # Root component
  │   ├── index.jsx             # Entry point
  │
  ├── .env                      # Environment variables
  ├── .gitignore                # Git ignore
  ├── package.json              # Dependencies and scripts
  ├── vite.config.js            # Vite configuration
  ├── jsconfig.json             # JavaScript import aliases



  ### Folder and File Conventions

  - **Features (`src/features/`)**:
    - Each feature (e.g., `blog`, `appointment`) contains:
      - `components/`: Feature-specific components (e.g., BlogList, AppointmentForm).
      - `services/`: API calls (e.g., blogApi.js).
      - `hooks/`: Custom hooks (e.g., useBlog).
      - `pages/`: Pages, grouped by role (e.g., `patient/`, `doctor/`, `admin/`).
    - Example: `features/blog/pages/BlogListPage.jsx` for the blog list page.
  - **Components (`src/components/`)**:
    - `common/`: Reusable UI components (e.g., Button, Card).
    - `layout/`: Layout components used across pages (e.g., Header, Footer).
  - **Pages**:
    - Named as `{Feature}Page.jsx` (e.g., BlogListPage.jsx, BookAppointment.jsx).
  - **Files per component**:
    - `{Component}.jsx`: Logic and JSX.
    - `{Component}.styles.js`: Styled-Components or CSS modules.
    - `{Component}.test.js`: Unit tests (optional).
    - `index.js`: Export component for cleaner imports.
  - **Naming**:
    - Use PascalCase for components (e.g., BlogList).
    - Use camelCase for hooks (e.g., useAuth).
    - Use kebab-case for CSS classes (e.g., blog-list).

  ### Import Aliases

  To simplify imports, we use aliases defined in `jsconfig.json` and `vite.config.js`. Examples:

  ```jsx
  import Header from '@components/layout/Header';
  import WebsiteInfo from '@features/website/pages/WebsiteInfo';
  import useAuth from '@hooks/useAuth';

