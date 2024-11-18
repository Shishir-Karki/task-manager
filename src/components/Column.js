import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

function Column({ column, tasks, onDelete }) {
  return (
    <div className="w-full md:w-64 bg-gray-100 rounded-lg p-4 mb-4 md:mb-0">
      <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[100px]"
          >
            {tasks.map((task, index) => (
              <Task 
                key={task.id} 
                task={task} 
                index={index} 
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;