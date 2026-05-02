# MindMates Project

This workspace is structured as a full-stack monorepo with a React + Tailwind frontend and a Node.js + Express backend connected to MongoDB.

## Folder Structure

- `frontend` - React application with Tailwind CSS
- `backend` - Express API with MongoDB integration, JWT auth, and admin endpoints

## Local Setup

1. Run `npm install` from the workspace root so npm installs both workspace apps.
2. Put your MongoDB Atlas URI in `backend/.env` as `MONGODB_URI`.
3. Add the remaining environment variables in `backend/.env` and `frontend/.env`.
4. Run `npm run dev` from the workspace root to start both frontend and backend together.

## Environment Variables

Backend:

- `PORT=5001`
- `JWT_SECRET=your-jwt-secret`
- `MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority`
- `FRONTEND_URL=http://localhost:5173`
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=your-admin-password`

Optional:

- `ADMIN_CODE=admin-secret` for admin registration through the auth form

Frontend:

- `VITE_API_URL=http://localhost:5001/api`
