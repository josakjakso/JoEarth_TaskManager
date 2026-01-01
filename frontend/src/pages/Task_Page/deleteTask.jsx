import PopUp from '../../components/PopUp.jsx';
import { deleteTask } from '../../api/task.js';

const DeleteTask = ({ task, showDeletePopUp, onClose, setTasks_byME }) => {


    if (!showDeletePopUp) return null;


    const confirmDelete = async () => {
        await deleteTask(task.id);
        setTasks_byME((prev) => prev.filter(t => t.id !== task.id));
        onClose();

    };
    console.log('DeleteTask task:', task);

    return (
        <PopUp showPopUp={showDeletePopUp} closePopUp={onClose}>
            <div className="text-center">
                <h2 className="text-xl font-bold  mb-2">Confirm Delete</h2>
                <p className="text-gray-600"> task: {task.name} </p>
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-500"
                    >
                        cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        c className="px-4 py-2 border rounded-md bg-gray-300 hover:bg-gray-500 "
                    >
                        delete
                    </button>
                </div>
            </div>
        </PopUp>
    );
};

export default DeleteTask;
