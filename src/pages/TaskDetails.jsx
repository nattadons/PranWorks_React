import React, { useState, useEffect } from 'react';
import { ArrowDown, Calendar, Edit, Trash2 } from 'lucide-react';
import TaskForm from '../components/TaskForm.jsx';
import { useParams, useNavigate } from 'react-router-dom';  // นำเข้า useNavigate

function TaskDetail() {
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState(null);
    const { Id } = useParams();
    const selectedTaskId = parseInt(Id, 10);

    const navigate = useNavigate(); // ใช้สำหรับเปลี่ยน URL

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await fetch(`https://localhost:7237/api/tasks/${selectedTaskId}`);
                if (!res.ok) throw new Error("Task not found");
                const data = await res.json();
                setTask(data);
            } catch (err) {
                console.error("Error fetching task:", err);
                setTask(null);
            }
        };

        fetchTask();
    }, [selectedTaskId]);

    const [taskOptions, setTaskOptions] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch("https://localhost:7237/api/tasks");
                const data = await res.json();
                setTaskOptions(data);
            } catch (err) {
                console.error("Error loading task list", err);
            }
        };
        fetchAll();
    }, []);

    const handleSave = (formData) => {
        console.log('Saving task:', formData);
        setTask(formData);
        setIsEditing(false);
        // API update call here
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const res = await fetch(`https://localhost:7237/api/tasks/${selectedTaskId}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    alert("Deleted successfully");
                    const updatedList = taskOptions.filter(t => t.id !== selectedTaskId);
                    setTaskOptions(updatedList);
                    if (updatedList.length > 0) {
                        navigate(`/tasks/${updatedList[0].id}`); // เปลี่ยน URL ไป task ใหม่
                    } else {
                        navigate('/tasks'); // ถ้าไม่มี task แล้ว กลับไปหน้า task list
                    }
                }
            } catch (err) {
                console.error("Error deleting task:", err);
            }
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Work': return 'bg-blue-100 text-blue-800';
            case 'Personal': return 'bg-pink-100 text-pink-800';
            case 'Study': return 'bg-purple-100 text-purple-800';
            case 'Health': return 'bg-green-100 text-green-800';
            case 'Shopping': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Todo': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
                    <button
                        onClick={() => navigate('/tasks')}  // เปลี่ยน URL กลับหน้า task list
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <TaskForm
                task={task}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/tasks')} // เปลี่ยน URL กลับหน้า task list
                                className="text-xl font-bold text-gray-900"
                            >
                                TaskFlow
                            </button>
                            <div className="text-sm text-gray-500">
                                Project Management
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Task Selector for Demo */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <select
                            value={selectedTaskId}
                            onChange={(e) => navigate(`/tasks/${e.target.value}`)} // เปลี่ยน URL ไป task ใหม่
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                        >
                            {taskOptions.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        <ArrowDown className="w-4 h-4 rotate-90" />
                        <span className="text-gray-900">Task Detail</span>
                    </div>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {task.name}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                    </div>
                </div>

                {/* Task Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Task Information</h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date
                                </label>
                                <div className="flex items-center text-gray-900">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(task.deadline).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <p className="text-gray-900 leading-relaxed">
                                {task.description || 'No description available'}
                            </p>
                        </div>
                        {task.categories && task.categories.length > 0 && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categories
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {task.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className={`inline-block text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;
