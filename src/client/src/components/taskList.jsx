import React from 'react';
import TaskItem from './taskItem';

const TaskList = ({ handleAddTagToTask, tasks, onToggle, onEdit, onDelete, onRemoveTag }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Нет задач</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          handleAddTagToTask={handleAddTagToTask}
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onRemoveTag={onRemoveTag}
        />
      ))}
    </div>
  );
};

export default TaskList;