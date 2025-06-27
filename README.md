# TaskFlow - Task Management App

A simple and intuitive task management application built with React and Tailwind CSS.

## Features

- **Task Overview**: View all tasks with status statistics (Todo, In Progress, Complete)
- **Task Management**: Create, edit, and delete tasks
- **Task Details**: View detailed information for each task
- **Status Tracking**: Track task progress with visual status indicators
- **Responsive Design**: Clean, modern UI that works on all devices

## Tech Stack

- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend API**: .NET Core API (https://localhost:7237)

## Project Structure

```
src/
├── components/
│   └── TaskForm.jsx          # Form component for creating/editing tasks
├── pages/
│   ├── LandingPage.jsx       # Welcome page
│   ├── TaskPage.jsx          # Main task list page
│   └── TaskDetails.jsx       # Individual task detail page
├── App.jsx                   # Main app with routing
├── main.jsx                  # App entry point
└── index.css                 # Tailwind CSS imports
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Make sure your backend API is running** on `https://localhost:7237`

## Usage

1. Visit the landing page and click "View Tasks"
2. See all tasks in a table format with statistics
3. Click "Add Task" to create a new task
4. Click "View Detail" to see task details
5. Use "Edit" to modify tasks or "Delete" to remove them

## API Endpoints

The app connects to these API endpoints:
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update existing task
- `DELETE /api/tasks/{id}` - Delete task

## Task Properties

Each task contains:
- **Name**: Task title
- **Description**: Detailed task description
- **Status**: Todo, In Progress, or Complete
- **Deadline**: Due date for the task
