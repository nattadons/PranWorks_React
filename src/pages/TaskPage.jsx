import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import { useEffect } from 'react';


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

function TaskPage() {

  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false); // 🔹 toggle form
  const [nextId, setNextId] = useState(5); // 🔹 สำหรับสร้าง ID ใหม่


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://localhost:7237/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleSaveTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: nextId }]);
    setNextId(nextId + 1);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <TaskForm
        task={{}} // task ว่างสำหรับเพิ่ม
        onSave={handleSaveTask}
        onCancel={handleCancelForm}
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
              <Link to="/" className="text-xl font-bold text-gray-900">TaskFlow</Link>
              <div className="text-sm text-gray-500">Project Management</div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)} // 🔹 เปิดฟอร์ม
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats + Table เดิม */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage and track your project tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'Todo').length}</div>
            <div className="text-gray-600">Todo</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'In Progress').length}</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'Complete').length}</div>
            <div className="text-gray-600">Complete</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
            <span className="text-sm text-gray-500">{tasks.length} tasks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {task.categories && task.categories.map((cat, index) => (
                          <span
                            key={index}
                            className={`inline-block text-xs px-2 py-1 rounded-full ${getCategoryColor(cat)}`}
                          >
                            {cat}
                          </span>

                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/tasks/${task.id}`} className="text-blue-600 hover:text-blue-800 font-medium">View Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default TaskPage;
