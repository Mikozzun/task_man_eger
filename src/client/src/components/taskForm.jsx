import React, { useState } from 'react';

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [task, setTask] = useState(initialData || {
    title: '',
    description: '',
    deadline: '',
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title.trim()) {
      onSubmit(task);
      setTask({
        title: '',
        description: '',
        deadline: '',
        tags: []
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        placeholder="Название задачи"
        className="task-input"
        required
      />
      
      <textarea
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        placeholder="Описание задачи"
        className="task-textarea"
      />
      
      <input
        type="datetime-local"
        value={task.deadline}
        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        className="deadline-input"
      />
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;