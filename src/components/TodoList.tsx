import React, { useState, useEffect } from 'react';

interface Todo {
    text: string;
    completed: boolean;
}

interface Day {
    day: number;
    month: string;
    todos: Todo[];
}

const today = new Date().getDate();
const daysOfMonth: Day[] = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    month: "Oct",
    todos: []
}));

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [newTask, setNewTask] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedTask, setEditedTask] = useState("");
    const [filter, setFilter] = useState<'all' | 'done'>('all');
    const [selectedDay, setSelectedDay] = useState<number>(today);
    const [startDayIndex, setStartDayIndex] = useState(Math.max(today - 4, 0));

    useEffect(() => {
        setTasks([...daysOfMonth[selectedDay - 1].todos]);
    }, [selectedDay]);

    const addTask = () => {
        if (newTask.trim() !== "" && selectedDay !== null) {
            daysOfMonth[selectedDay - 1].todos.push({ text: newTask.trim(), completed: false });
            setTasks([...daysOfMonth[selectedDay - 1].todos]);
            setNewTask("");
        }
    };

    const editTask = (index: number) => {
        setEditingIndex(index);
        setEditedTask(tasks[index].text);
    };

    const saveEdit = (index: number) => {
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, text: editedTask } : task
        );
        daysOfMonth[selectedDay - 1].todos = updatedTasks;
        setTasks(updatedTasks);
        setEditingIndex(null);
        setEditedTask("");
    };

    const deleteTask = (index: number) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        daysOfMonth[selectedDay - 1].todos = updatedTasks;
        setTasks(updatedTasks);
    };

    const toggleCompletion = (index: number) => {
        const updatedTasks = tasks.map((task, i) => 
            i === index ? { ...task, completed: !task.completed } : task
        );
        daysOfMonth[selectedDay - 1].todos = updatedTasks;
        setTasks(updatedTasks);
    };

    const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.completed);

    const displayDays = daysOfMonth.slice(startDayIndex, startDayIndex + 7);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 pt-8">
            {/* Calendar Section */}
            <div className="calendar flex items-center justify-center gap-2 mb-6 w-full px-4">
                <button
                    onClick={() => setStartDayIndex((prev) => Math.max(prev - 7, 0))}
                    className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-700"
                >
                    &lt;
                </button>
                {displayDays.map(({ day, month }, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedDay(day);
                            setTasks([...daysOfMonth[day - 1].todos]);
                        }}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer w-16 h-24 ${
                            selectedDay === day ? "bg-teal-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        <span className="text-2xl font-semibold">{day}</span>
                        <span className="text-sm">{month}</span>
                    </div>
                ))}
                <button
                    onClick={() => setStartDayIndex((prev) => Math.min(prev + 7, daysOfMonth.length - 7))}
                    className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-700"
                >
                    &gt;
                </button>
            </div>

            {/* Todo Section */}
            <div className="bg-white p-5 rounded-lg shadow-lg text-center w-full max-w-3xl">
                {/* Todo Input */}
                <div className="todo-input p-4 border border-gray-300 rounded-lg mb-6">
                    <div className="flex justify-center items-center gap-2 w-full">
                        <input
                            type="text"
                            placeholder="New Todo"
                            className="flex-1 p-2 border border-gray-300 rounded-md w-full"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button
                            onClick={addTask}
                            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                        >
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Todo List */}
                <div className="todo-list mt-6">
                    <h2 className="mb-4 text-xl font-semibold">Todo List for {selectedDay} Oct</h2>
                    <div className="filter-buttons flex justify-center gap-2 mb-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 ${filter === 'all' ? 'bg-teal-700' : ''}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('done')}
                            className={`bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-700 ${filter === 'done' ? 'bg-teal-700' : ''}`}
                        >
                            Done
                        </button>
                    </div>

                    <div className="todo-items grid gap-2 mt-2">
                        {filteredTasks.map((task, index) => (
                            <div
                                key={index}
                                className={`todo-item flex justify-between items-center p-3 border border-gray-300 rounded-md ${task.completed ? "line-through text-red-500" : ""}`}
                            >
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={editedTask}
                                        onChange={(e) => setEditedTask(e.target.value)}
                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                    />
                                ) : (
                                    <span>{task.text}</span>
                                )}
                                <div className="actions flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="transform scale-125"
                                        checked={task.completed}
                                        onChange={() => toggleCompletion(index)}
                                    />
                                    {editingIndex === index ? (
                                        <button
                                            onClick={() => saveEdit(index)}
                                            className="text-green-500 text-xl"
                                        >
                                            ✔️
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => editTask(index)}
                                            className="text-orange-500 text-xl"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteTask(index)}
                                        className="text-red-500 text-xl"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;

