import React, { useState } from 'react';

function TaskForm({ task = {}, onSave, onCancel }) {


    const [formData, setFormData] = useState({
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'Todo',
        deadline: task.deadline ? task.deadline.slice(0, 10) : '',
        categories: task.categories || [],

    });

    const categoryOptions = ['Work', 'Personal', 'Shopping', 'Health', 'Study'];
    const toggleCategory = (cat) => {
        setFormData((prev) => {
            const alreadySelected = prev.categories.includes(cat);
            return {
                ...prev,
                categories: alreadySelected
                    ? prev.categories.filter((c) => c !== cat)
                    : [...prev.categories, cat],
            };
        });
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'Todo':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const [errors, setErrors] = useState({});


    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            let res;
            if (task.id) {
                // แก้ไข (PUT)
                res = await fetch(`https://localhost:7237/api/Tasks/${task.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else {
                // สร้างใหม่ (POST)
                res = await fetch('https://localhost:7237/api/Tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            }

            if (!res.ok) {
                throw new Error('Failed to save task');
            }

            const savedTask = await res.json();
            onSave(savedTask);  // ส่งข้อมูลที่เซฟแล้วกลับไปหน้าเรียกใช้
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task. Please try again.');
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Task name is required.';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required.';
        if (formData.categories.length === 0) newErrors.categories = 'Please select at least one category.';

        const validStatuses = ['Todo', 'In Progress', 'Complete'];
        if (!validStatuses.includes(formData.status)) newErrors.status = 'Please select a valid status.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="text-xl font-bold text-gray-900">
                                TaskFlow
                            </div>
                            <div className="text-sm text-gray-500">
                                Project Management
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onCancel}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full text-3xl font-bold border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </h1>
                    {errors.name && <p className="text-red-600 text-sm mt-1 mb-2">{errors.name}</p>}

                    <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(formData.status)}`}>
                            {formData.status}
                        </span>
                    </div>
                </div>

                {/* Task Details Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Edit Task Information</h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.deadline && <p className="text-red-600 text-sm mt-1">{errors.deadline}</p>}

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                </select>
                                {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}

                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter task description..."
                            />
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categories
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map((cat) => (
                                    <label key={cat} className="flex items-center space-x-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300"
                                        />

                                        <span>{cat}</span>
                                    </label>
                                ))}

                            </div>
                            {errors.categories && <p className="text-red-600 text-sm mt-2">{errors.categories}</p>}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskForm;
