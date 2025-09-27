# Frontend - Lyrid Prima Indonesia

Web application using Next.js and Bootstrap for user and employee management.

## Features

- JWT Authentication
- User Pages (add)
- Employee Pages (add, edit, delete) + Photo Upload (Only: JPG, JPEG)
- Responsive design (mobile-friendly)
- Toast notifications
- Smooth animations

## Requirements

- Node.js
- npm

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Make sure backend is running**
   - Backend must run at `http://localhost:_your_backend_port`

## Running the App

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Open browser at: `http://localhost:3000`

## Default Login

- Username: `admin`
- Password: `admin123`

## Pages

### Home (`/`)
- Auto redirect to login or dashboard

### Login (`/login`)
- Simple login form
- Input validation
- Error handling

### 👥 Users (`/users`)
- Users table
- Add new user (modal)
- Role: admin/staff

### Employees (`/employees`)
- Employee card layout
- Upload employee photo
- Photo preview before upload
- Edit employee data
- Delete employee

## Photo Upload

- Format: JPG, JPEG only
- Size: max 300KB
- Method: click or drag & drop
- Has photo preview

## Project Structure

```
frontend/
├── components/           # Reusable components
│   ├── Layout.jsx       # Main layout
│   ├── LoadingSpinner.jsx # Loading
│   └── ...              # Other components
├── pages/               # Application pages
│   ├── index.jsx        # Home
│   ├── login.jsx        # Login
│   ├── users.jsx        # User management
│   └── employees.jsx    # Employee management
├── styles/              # CSS
├── utils/               # Helper functions
└── lib/                 # API client
```

## Tech Stack

- **Next.js** - React framework
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **SWR** - Data fetching
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icons

## Troubleshooting

**Can't connect to API?**
- Check CORS settings in backend

**Login failed?**
- Make sure username/password is correct
- Clear localStorage and cookies

**Photo upload error?**
- Check file format (JPG/JPEG only)
- Check file size (max 300KB)

**Build error?**
- Delete `.next` folder
- Run `npm install` again

## Mobile Support

- Responsive on all devices
- Touch-friendly
- Optimized for mobile
