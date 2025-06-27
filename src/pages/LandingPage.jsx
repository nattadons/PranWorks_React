import React from 'react'
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Task Manager</h1>
            <p className="mb-6">Simple task tracking tool built with React and Tailwind CSS</p>
            <Link to="/tasks" className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100">
                View Tasks
            </Link>
        </div>
    )
}
