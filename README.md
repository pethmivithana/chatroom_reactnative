# Chat App - React Native Expo Developer Challenge

A real-time chat application built with React Native (Expo) + TypeScript frontend and Node.js + MySQL backend, featuring WebSocket real-time messaging.

## 🚀 Live Demo

- **Frontend (Expo):** [https://expo.dev/accounts/pethmi/projects/chat-app/updates/8141ea26-b95b-4c86-8e12-5290d5ffea3c](https://expo.dev/accounts/pethmi/projects/chat-app/updates/8141ea26-b95b-4c86-8e12-5290d5ffea3c)

## 📱 Features

### Frontend (React Native + Expo + TypeScript)
- **User Authentication:** Simple username-based login
- **Real-time Chat:** Instant message updates via WebSocket
- **Message History:** Persistent chat history with FlatList
- **Loading States:** ActivityIndicator during API calls
- **Redux State Management:** Centralized state for messages and user data
- **TypeScript:** Full type safety with interfaces

### Backend (Node.js + Express + MySQL)
- **REST API:** CRUD operations for messages
- **WebSocket Server:** Real-time messaging with Socket.IO
- **MySQL Database:** Persistent message storage
- **Input Validation & Error Handling**
- **CORS Configuration**

## 🛠️ Tech Stack

**Frontend:**
- React Native + Expo
- TypeScript
- Redux Toolkit
- Socket.IO Client
- Axios

**Backend:**
- Node.js + Express
- TypeScript
- MySQL + Sequelize ORM
- Socket.IO
- CORS

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- Expo CLI
- iOS Simulator / Android Emulator / Physical device with Expo Go

  📝 Design Decisions
Simple Authentication: Username-only login to focus on core real-time features

Redux Toolkit: Chosen for simpler boilerplate and TypeScript integration

Sequelize ORM: For type-safe database operations

Modular Architecture: Separation of concerns with clear folder structure

Loading States: Consistent UX during network operations

🚀 Deployment
Frontend: Deployed via Expo Publish

⏱️ Development Timeline
Day 1: Project setup, backend foundation, database design

Day 2: Frontend structure, Redux setup, basic UI components

Day 3: WebSocket integration, real-time features, testing

Day 4: Polish, bug fixes, deployment, documentation

🎨 Future Enhancements
Push notifications for new messages

User typing indicators

User presence status

Developed by: Pethmi Vithana
Challenge Completion Time: 4 days

## ⚡ Quick Start

### Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Start development server
npm run dev
Frontend Setup
bash
cd frontend
npm install

# Start Expo development server
npm start
Database Setup
sql
CREATE DATABASE chat_app;
# The Sequelize models will automatically create tables
🗂️ Project Structure
text
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens (Login, Chat)
│   ├── store/          # Redux store and slices
│   ├── services/       # API and WebSocket services
│   └── types/          # TypeScript interfaces
backend/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/         # Sequelize models
│   ├── routes/         # Express routes
│   ├── sockets/        # Socket.IO handlers
│   └── config/         # Database configuration
```bash

