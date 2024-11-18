import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';

const initialData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

function App() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('data');
    return savedData ? JSON.parse(savedData) : initialData;
  });
  const [newTaskContent, setNewTaskContent] = useState('');

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = [...start.taskIds];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = [...start.taskIds];
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };
    const finishTaskIds = [...finish.taskIds];
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
    };
    const firstColumnId = data.columnOrder[0];
    const column = data.columns[firstColumnId];
    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...data.columns,
        [firstColumnId]: {
          ...column,
          taskIds: [...column.taskIds, newTaskId],
        },
      },
    });
    setNewTaskContent('');
  };

  const deleteTask = (taskId) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];
    const newColumns = {};
    Object.keys(data.columns).forEach((columnId) => {
      newColumns[columnId] = {
        ...data.columns[columnId],
        taskIds: data.columns[columnId].taskIds.filter(id => id !== taskId),
      };
    });
    setData({
      ...data,
      tasks: newTasks,
      columns: newColumns,
    });
  };

  const clearAllTasks = () => {
    const clearedColumns = {};
    Object.keys(data.columns).forEach((columnId) => {
      clearedColumns[columnId] = {
        ...data.columns[columnId],
        taskIds: [],
      };
    });
    setData({
      ...initialData,
      columns: clearedColumns,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-6 border border-purple-900/30">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-100">Task Manager</h1>
          <button
            onClick={clearAllTasks}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
        <form onSubmit={addTask} className="mb-8 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 p-2 rounded bg-gray-700 border border-purple-900/50 text-purple-100 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-purple-600 text-purple-100 px-4 py-2 rounded hover:bg-purple-700 w-full sm:w-auto transition-colors duration-200 font-medium"
          >
            Add Task
          </button>
        </form>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row md:space-x-5 space-y-4 md:space-y-0">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
              return <Column key={column.id} column={column} tasks={tasks} onDelete={deleteTask} />;
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;