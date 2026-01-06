import React, { useEffect } from 'react';
import { mockTasks } from '../../models/mockTask.js';
import { useState } from 'react';
import PopUp from '../../components/PopUp.jsx';
import { addTask } from '../../api/task.js';
import { getTaskAssignToUser, getTaskCreateByUser, UpdateStatus } from '../../api/task.js';
import DeleteTask from './deleteTask.jsx';
import { MyCreatedTasks } from './MyCreatedTasks.jsx';
import { AssignedToMeTasks } from './AssignedToMeTasks.jsx';

export default function TaskTable() {
    const [activeTab, setActiveTab] = useState('byMe'); // 'byMe' หรือ 'toMe'
    const [showPopUp, setShowPopUp] = useState(false)
    const [showDeletePopUp, setshowDeletePopUp] = useState(false)
    const [error, setError] = useState('');
    const [tasks_byME, setTasks_byME] = useState([]);
    const [tasks_toME, setTasks_toME] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);


    const handleDropdown = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const [form, setForm] = useState({
        title: "",
        description: "",
        assignedTo: "",
        startDate: "",
        dueDate: "",
        status: "To_do",
        priority: "Medium"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { title, description, assignedTo, startDate, dueDate, status, priority } = form;
            const response = await addTask(title, description, assignedTo, startDate, dueDate, status, priority);
            console.log('Add Task Successful from Task Page :', response);
            setShowPopUp(false)
        } catch (err) {
            setError(err.message);
            console.log('Add Task error from Task Page :', err.message);
        }
    }
    const handleDelete = (task) => {
        setSelectedTask(task);
        setshowDeletePopUp(true);
    }

    const handleStatusChange = async (taskId, newStatus) => {
        try {

            const response = await UpdateStatus(taskId, newStatus);
            setTasks_toME((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );



            console.log("Status updated!");
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    useEffect(() => {
        const task_byUser = async () => {
            try {
                const data = await getTaskCreateByUser();
                setTasks_byME(data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };

        const task_toUser = async () => {
            try {
                const data = await getTaskAssignToUser();
                setTasks_toME(data);
            } catch (err) {
                console.error('Failed to fetch tasks:', err);
            }
        };
        task_byUser();
        task_toUser();
        console.log('tasks_byME:', tasks_byME);
        console.log('tasks_toME:', tasks_toME);
    }, []);


    return (
        <div className="p-6">
            <div className='flex justify-between items-center mb-6'>
                {/* ปุ่มสลับหน้า (Tabs) */}
                <div className="flex gap-4 border-b w-full">
                    <button
                        className={`py-2 px-4 ${activeTab === 'byMe' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                        onClick={() => setActiveTab('byMe')}
                    >
                        My Created Tasks
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'toMe' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                        onClick={() => setActiveTab('toMe')}
                    >
                        Assigned To Me
                    </button>
                </div>

                <button className="ml-4 bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setShowPopUp(true)}>
                    + Add Task
                </button>
            </div>

            {/* ส่วนแสดงผลตาม Tab ที่เลือก */}
            {activeTab === 'byMe' ? (
                <MyCreatedTasks tasks={tasks_byME} onDelete={handleDelete} />
            ) : (
                <AssignedToMeTasks tasks={tasks_toME} onStatusChange={handleStatusChange} />
            )}

            {/* Popups ต่างๆ คงเดิม */}
            <PopUp showPopUp={showPopUp} closePopUp={() => setShowPopUp(false)}>
                {addTaskform(handleSubmit, form, setForm, handleDropdown)}
            </PopUp>

            <DeleteTask
                task={selectedTask}
                showDeletePopUp={showDeletePopUp}
                setTasks_byME={setTasks_byME}
                onClose={() => {
                    setshowDeletePopUp(false);
                    setSelectedTask(null);
                }}
            />
        </div>
    );
}

function addTaskform(handleSubmit, form, setForm, handleDropdown) {
    return <form className='py-5 px-5 flex flex-col gap-2' onSubmit={handleSubmit}>
        <div className=' flex'>
            <h2 className='py-1 px-1 '>title</h2>
            <input

                className="p-2 border border-gray-300 rounded w-full "
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required />

        </div>
        <div className=' flex '>
            <h2 className='py-1 px-1 '>description</h2>
            <input

                className="p-2 border border-gray-300 rounded w-full"
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required />

        </div>
        <div className=' flex justify-start gap-4'>
            <div className='flex '>
                <h2 className='py-1 px-1 '>Status</h2>
                <select name="status" className=" border rounded" value={form.status} onChange={handleDropdown}>
                    <option value="To_do">To_do</option>
                    <option value="In_Progess">In_Progess</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Done">Done</option>
                </select>
            </div>
            <div className='flex '>
                <h2 className='py-1 px-1'>Priority</h2>
                <select name="priority" className=" border rounded" value={form.priority} onChange={handleDropdown}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>


        </div>
        <div className=' flex '>
            <h2 className='py-1 px-1 '>assignedTo</h2>
            <input

                className="p-2 border border-gray-300 rounded w-full "
                type="text"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                required />

        </div>
        <div className=' flex '>
            <h2 className='py-1 px-1 '>StartDate</h2>
            <input

                className="p-2 border border-gray-300 rounded w-auto "
                type="date"
                value={form.startDate || ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required />

            <h2 className='py-1 px-1 '>DueDate</h2>
            <input

                className="p-2 border border-gray-300 rounded w-auto "
                type="date"
                value={form.dueDate || ""}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required />

        </div>
        <button
            className="mt-4  bg-gray-500 text-black px-4 py-2 rounded disabled:opacity-50"
            type="submit"
            disabled={!form.title || !form.description || !form.assignedTo || !form.startDate || !form.dueDate ||
                !form.status || !form.priority}

        >
            Submit
        </button>

    </form>;
}

