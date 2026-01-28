# My Smart List

A modern, full-stack shopping list management application built with React, TypeScript, and JSON Server. Features user authentication, list sharing, and real-time collaboration.

## 🚀 Features

- **User Authentication**: Secure signup and login with encrypted passwords
- **Shopping List Management**: Create, edit, delete, and organize shopping lists
- **Item Categories**: Organize items by categories (groceries, dairy, meat, etc.)
- **List Sharing**: Share shopping lists with other users via email
- **Real-time Updates**: Instant synchronization across all users
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Uses JSON Server for backend data storage

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **React Router** - Client-side routing
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling and validation

### Backend
- **JSON Server** - REST API simulation with full CRUD operations
- **bcryptjs** - Password hashing for security

## 📁 Project Structure

```
my-smart-list-main/
├── data/
│   └── db.json              # JSON Server database
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   └── shopping/       # Shopping list components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── store/              # Redux store and slices
│   │   ├── slices/         # Redux slices
│   │   └── hooks.ts        # Typed Redux hooks
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-smart-list-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server (Backend)**
   ```bash
   npm run server
   ```
   This will start the JSON Server on `http://localhost:3001`

4. **Start the development server (Frontend)**
   ```bash
   npm run dev
   ```
   This will start the Vite development server on `http://localhost:5173`

5. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

## 📖 Usage

### User Registration
1. Click on "Register" in the navigation
2. Fill in your details (name, surname, email, cell number, password)
3. Passwords are automatically encrypted before storage

### Creating Shopping Lists
1. After logging in, click "Create New List"
2. Enter a list name and optional description
3. Add items to your list with categories and quantities

### Sharing Lists
1. Open any of your shopping lists
2. Click the "Share" button
3. Enter the email address of the user you want to share with
4. The recipient will see the shared list in their dashboard

### Managing Items
- **Add Items**: Click "Add Item" and fill in the details
- **Mark Complete**: Click the checkbox next to completed items
- **Edit Items**: Click on an item to edit its details
- **Delete Items**: Use the delete button on each item

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run server` - Start the JSON Server backend
- `npm run lint` - Run ESLint for code quality
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## 🔒 Security Features

- **Password Encryption**: All passwords are hashed using bcryptjs before storage
- **User Isolation**: Users can only see their own lists and shared lists
- **Input Validation**: Form validation prevents invalid data entry
- **Authentication Guards**: Protected routes require user authentication

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for mobile and desktop
- **Dark/Light Theme Support**: Built with Tailwind CSS for easy theming
- **Accessible Components**: Using shadcn/ui for accessibility compliance
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Visual feedback during API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [JSON Server](https://github.com/typicode/json-server) for API simulation
- [React](https://reactjs.org/) for the frontend framework
