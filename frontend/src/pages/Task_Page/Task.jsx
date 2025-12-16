import React from 'react';
import { mockTasks } from '../../models/mockTask.js';
import formatDate from '../../components/foramatDate.jsx';
export default function TaskTable() {
    return (
        <div className="p-6 ">

            <div className="overflow-x-auto pt-20 ">
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
