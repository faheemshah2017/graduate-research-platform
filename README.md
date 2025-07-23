# Graduate Research Platform

A full-stack platform for graduate research management, supporting students and faculty with user registration/login, document submission and review, grading, chat, and search. All operations are handled via backend APIs with role-based UI and logic.

## Features
- User registration and login (JWT-based)
- Role-based dashboards for students and faculty
- Document submission (with file upload)
- Document review and grading by faculty
- Chat between students and faculty
- Search for users, documents, and feedback
- Download and view uploaded documents
- All data operations via backend APIs (no static/in-memory frontend data)

## Project Structure
```
graduate-research-platform/
├── src/
│   ├── app.js                # Main backend entry point
│   ├── swagger.js            # Swagger API docs setup
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/          # API controllers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── documentController.js
│   │   ├── gradeController.js
│   │   └── searchController.js
│   ├── models/               # Mongoose models
│   │   ├── chat.js
│   │   ├── document.js
│   │   ├── grade.js
│   │   └── user.js
│   └── routes/               # Express API routes
│       ├── auth.js
│       ├── chat.js
│       ├── document.js
│       ├── grade.js
│       ├── search.js
│       └── user.js
├── public/                   # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── templates/
├── uploads/                  # Uploaded documents (gitignored)
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd graduate-research-platform
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and set your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/graduate-research-platform
   JWT_SECRET=your_jwt_secret
   ```
5. Start the application:
   ```
   npm start
   ```

## Usage
- The app will run on `http://localhost:5000` by default.
- Access the frontend at the root URL.
- API endpoints are under `/api/`.

## API Endpoints (examples)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in
- `POST /api/documents` — Submit a document (multipart/form-data)
- `GET /api/documents/review` — List documents for review
- `POST /api/documents/:id/review` — Submit review/grade
- `GET /api/search` — Search users, documents, feedback
- `GET /api/chat` — Get/send chat messages

## Tech Stack
- Node.js, Express, MongoDB, Mongoose
- Multer (file uploads)
- JWT (authentication)
- Bootstrap, Vanilla JS (frontend)

## License
MIT License
