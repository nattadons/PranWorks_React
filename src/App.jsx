import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import TaskDetails from './pages/TaskDetails.jsx';

function App() {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks/:Id" element={<TaskDetails />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
