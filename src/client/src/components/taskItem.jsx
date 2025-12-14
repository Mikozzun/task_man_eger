import React from 'react';
import { isOverdue, formatDateTime } from '../utils/dateUtils';
import { useTasks } from '../hooks/useTasks'

const TagDropSelect = ({ handleAddTagToTask, task }) => {
  const { tags } = useTasks();
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = e.target.value;
    handleAddTagToTask(task.id, tag);
};
return (
  <select placeholder='+' onChange={handleAddTag} className="tag-select">
    <option value="" disabled selected>Добавить Тег</option>
    {Array.isArray(tags) && tags.map((tag) => {
      return <option key={tag.id}>{tag.name}</option>
    })}
  </select>
)
}

const TaskItem = ({ handleAddTagToTask, task, onToggle, onEdit, onDelete, onRemoveTag }) => {
  const overdue = isOverdue(task.deadline);

  task.tags && !task.tags.includes('task') ? task.tags = ['task', ...task.tags] : task.tags = [...task.tags];

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        
        <div className="task-info">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
        
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="btn btn-small">
            ✏️
          </button>
          <button onClick={() => onDelete(task.id)} className="btn btn-small btn-danger">
            🗑️
          </button>
        </div>
      </div>
      
      {task.deadline && (
        <div className="task-meta">
          <span className="deadline">
            До: {formatDateTime(task.deadline)}
            {overdue && !task.completed && (
              <span className="overdue-badge">Просрочено</span>
            )}
          </span>
        </div>
      )}
      
      {task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              {onRemoveTag && (
                <button 
                  onClick={() => tag === 'task' ? alert('cannot remove default task tag') : onRemoveTag(task.id, tag)}
                  className="task-tag-remove"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        <TagDropSelect task={task} handleAddTagToTask={handleAddTagToTask}/>
        </div>
      )}
    </div>
  );
};

export default TaskItem;