import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Task({ task, index, onDelete }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 mb-2 rounded shadow-sm border border-gray-200 flex justify-between items-center break-words"
        >
          <span className="flex-1 mr-2">{task.content}</span>
          <button 
            onClick={() => onDelete(task.id)} 
            className="text-red-500 hover:text-red-700 text-xl px-2"
          >
            ×
          </button>
        </div>
      )}
    </Draggable>
  );
}

export default Task;