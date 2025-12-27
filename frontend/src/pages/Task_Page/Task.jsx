import React from 'react';
import { mockTasks } from '../../models/mockTask.js';
import { useState } from 'react';
import PopUp from '../../components/PopUp.jsx';
import formatDate from '../../components/foramatDate.jsx';
import { addTask } from '../../api/task.js';
export default function TaskTable() {
    const [showPopUp, setShowPopUp] = useState(false)
    const [error, setError] = useState('');

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
        status: "to_do",
        priority: "medium"
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


    return (
        <div className="p-6 ">
            <div className=' flex justify-end'>
                <button className="  bg-gray-500 text-white px-4 py-2 rounded hover:text-black " onClick={() => setShowPopUp(true)}>  add task</button>
                <PopUp showPopUp={showPopUp} closePopUp={() => setShowPopUp(false)}>
                    {addTaskform(handleSubmit, form, setForm, handleDropdown)}
                </PopUp>
            </div>
            <div className="overflow-x-auto pt-10 ">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2 text-left">Title</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">Priority</th>
                            <th className="border px-3 py-2">Assigned To</th>
                            <th className="border px-3 py-2">Start Date</th>
                            <th className="border px-3 py-2">Due Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {mockTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="border px-3 py-2">
                                    <div className="font-medium">{task.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {task.description}
                                    </div>
                                </td>

                                <td className="border px-3 py-2 text-center">
                                    <StatusBadge status={task.status} />
                                </td>

                                <td className="border px-3 py-2 text-center">
                                    <PriorityBadge priority={task.priority} />
                                </td>

                                <td className="border px-3 py-2 text-center">
                                    {task.assignedTo}
                                </td>

                                <td className="border px-3 py-2 text-center">
                                    {formatDate(task.startDate) ?? '-'}
                                </td>

                                <td className="border px-3 py-2 text-center">
                                    {formatDate(task.dueDate) ?? '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

/** @param {{ status: import('../types/task').ProgressStatus }} props */
function StatusBadge({ status }) {
    const map = {
        to_do: 'bg-gray-200 text-gray-800',
        in_progress: 'bg-blue-200 text-blue-800',
        done: 'bg-green-200 text-green-800',
    };

    return (
        <span className={`px-2 py-1 rounded text-sm ${map[status]}`}>
            {status}
        </span>
    );
}

/** @param {{ priority: import('../types/task').PriorityStatus }} props */
function PriorityBadge({ priority }) {
    const map = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 py-1 rounded text-sm ${map[priority]}`}>
            {priority}
        </span>
    );
}
