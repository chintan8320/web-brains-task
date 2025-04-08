## Project Structure

```
project-root/
├── frontend/    # Frontend application
├── backend/     # Backend application
└── README.md    # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/chintan8320/web-brains-task.git
cd web-brains-task
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example (if applicable)
cp .env.example .env
```

Edit the `.env` file in the backend directory with your specific configuration values:

```
PORT = 3333
MONGO_URI = ''
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file from example (if applicable)
cp .env.example .env
```

Edit the `.env` file in the frontend directory with your specific configuration values:

```
VITE_BACKEND_URL=http://localhost:3333/api
```

## Running the Application

### 1. Start the Backend

```bash
# In the backend directory
cd backend
npm run dev
```

The backend server should start and be available at the configured port (default: http://localhost:5000).

### 2. Start the Frontend

```bash
# In the frontend directory
cd frontend
npm run dev
```

The frontend development server should start and be available at the configured port (default: http://localhost:3000 or http://localhost:5173 if using Vite).
