<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
# Project-Task-Manager

A full-stack task management system that allows users to efficiently manage their **Projects** and **Tasks** with a user-friendly interface and robust backend.

---

## 🚀 Features

✅ Project and Task CRUD operations  
✅ Task filtering by status (To Do, In Progress, Done)  
✅ Status badges with dynamic colors  
✅ Due date display  
✅ Responsive UI with card/grid layout  
✅ RESTful API integration  
✅ MongoDB data persistence

---

## 📁 Folder Structure

Project-Task-Manager/
│
├── backend/ # Express.js server with MongoDB
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── ...
│
├── frontend/ # React + Vite + Tailwind frontend
│ ├── components/
│ ├── pages/
│ └── ...

yaml
Copy
Edit

---

## 🔧 Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Disha2901185/Project-Task-Manager.git
cd Project-Task-Manager
⚙️ Backend Setup (/backend)
bash
Copy
Edit
cd backend
npm install
Create a .env file inside /backend:

ini
Copy
Edit
PORT=3001
MONGO_URI=your_mongo_connection_string
Start the backend server:

bash
Copy
Edit
npm run dev
🌐 Frontend Setup (/frontend)
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
Open in browser: http://localhost:5173

🛠️ Tech Stack
Frontend: React + Vite + TailwindCSS

Backend: Node.js + Express.js

Database: MongoDB

Communication: Axios

🧑‍💻 Author
Name: Disha Kansal
GitHub: Disha2901185

yaml
Copy
Edit
>>>>>>> 10bb5a5394093b510b98f2ae4a38a151e38cd517
