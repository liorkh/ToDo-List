# TODO List Project

This project consists of two main components:

1. **TODO List Backend (BE)**: The server-side application responsible for handling requests related to creating, reading, updating, and deleting TODO tasks.
2. **TODO List Frontend (FE)**: The client-side application that provides a user interface for interacting with the TODO List.

Both components are located in separate folders within the repository.

- **TODOLIST-BE**: This folder contains the backend logic, including API routes and database interactions.
- **TODOLIST-FE**: This folder contains the frontend code, including the user interface and interactions with the backend.

## Prerequisites

Make sure you have the following installed:

- Node.js and npm
- A code editor like Visual Studio Code
- MongoDB 

## Getting Started

Follow these steps to get the project up and running locally.

### 1. Clone the repository

```bash
git clone https://github.com/liorkh/ToDo-List.git
cd todo-list
```
### 2. Set up Backend (TODO-LIST-BE)
Navigate to the TODO-LIST-BE folder.
```bash
cd TODO-LIST-BE
```
Install the necessary dependencies:
```bash
npm install
```
Configure your environment variables by using the dev.env file and setting up your database connection string, port and cors allowed.

Start the backend server:

```bash
npm run dev
```
The backend should now be running on http://localhost:5000 (or the port you specified).

### 3. Set up Frontend (TODO-LIST-FE)
Navigate to the TODO-LIST-FE folder.
```bash
cd TODO-LIST-FE
```
Install the necessary dependencies:
```bash
npm install
```
Start the frontend application:
```bash
npm start
```
The frontend should now be running on http://localhost:3000 (or the port specified by React).

### 4. API Endpoints (for BE)
The following API routes are available:

- GET /todos: Get all TODO tasks
- POST /todos: Create a new TODO task
- PUT /todos/:id: Update a TODO task by ID
- DELETE /todos/:id: Delete a TODO task by ID

### 5. Architecture Decision
- I used the *Repository Pattern* to manage database interactions. This helps keep things clean by separating data access logic from the rest of the app. It makes the code easier to maintain, test, and swap out the database with ease.

- I used a *Singleton* for Socket.IO. This ensures there's only one instance of Socket.IO running, which helps avoid conflicts and keeps things efficient. It simplifies event broadcasting across clients and ensures consistent communication throughout the app.

- I used the *Service Pattern* in Angular to keep business logic separate from components. This way, components focus on displaying data, while services handle things like API calls and data processing. It makes the code cleaner, reusable, and easier to maintain.
