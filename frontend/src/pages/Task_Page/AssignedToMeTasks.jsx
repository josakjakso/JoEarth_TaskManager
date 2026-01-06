import formatDate from '../../components/foramatDate.jsx';

export function AssignedToMeTasks({ tasks, onStatusChange }) {
    return (
        <div className="overflow-x-auto pt-5">
            <h1 className="text-xl font-bold mb-4">Tasks Assigned To Me</h1>
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-3 py-2 text-left">Title</th>
                        <th className="border px-3 py-2 text-center">Status</th>
                        <th className="border px-3 py-2 text-center">Priority</th>
                        <th className="border px-3 py-2 text-center">From</th>
                        <th className="border px-3 py-2 text-center">Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                            <td className="border px-3 py-2">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-gray-500">{task.description}</div>
                            </td>
                            <td className="border px-3 py-2 text-center">
                                <select
                                    value={task.status}
                                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                                    className={`px-2 py-1 rounded-md text-sm font-medium border ${getStatusStyles(task.status)}`}
                                >
                                    <option value="To_do">To_do</option>
                                    <option value="In_Progess">In_Progess</option>
                                    <option value="Waiting">Waiting</option>
                                    <option value="Done">Done</option>
                                </select>
                            </td>
                            <td className="border px-3 py-2 text-center"><PriorityBadge priority={task.priority} /></td>
                            <td className="border px-3 py-2 text-center">{task.name}</td>
                            <td className="border px-3 py-2 text-center">{formatDate(task.due_date) ?? '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** @param {{ status: import('../types/task').ProgressStatus }} props */
const getStatusStyles = (status) => {
    const map = {
        To_do: 'bg-gray-200 text-gray-800 border-gray-400',
        In_Progess: 'bg-blue-200 text-blue-800 border-blue-400',
        Waiting: 'bg-yellow-200 text-yellow-800 border-yellow-400',
        Done: 'bg-green-200 text-green-800 border-green-400',
    };
    return map[status] || 'bg-slate-100 text-slate-600'; // ค่า default ถ้าไม่ตรงกับอะไรเลย
};

function StatusBadge({ status }) {
    return (
        <span className={`px-2 py-1 rounded text-sm    ${getStatusStyles(status)}`}>
            {status.replace('_', ' ')} {/* แปลง To_do เป็น To do เพื่อความสวยงาม */}
        </span>
    );
}

/** @param {{ priority: import('../types/task').PriorityStatus }} props */
function PriorityBadge({ priority }) {
    const map = {
        Low: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 py-1 rounded text-sm ${map[priority]}`}>
            {priority}
        </span>
    );
}
