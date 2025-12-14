import React, { useState } from 'react';

const TagManager = ({ onDeleteTag, tags, onCreateTag, onAddTag, taskId, taskTags = [] }) => {
  const [newTag, setNewTag] = useState('');

  const handleCreateTag = () => {
    if (newTag.trim()) {
      onCreateTag({ name: newTag.trim() });
      setNewTag('');
    }
  };

  const availableTags = tags.filter(tag => 
    !taskTags.includes(tag.name)
  );

  return (
    <div className="tag-manager">
      <div className="tag-input-group">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Новый тег"
          className="tag-input"
        />
        <button onClick={handleCreateTag} className="btn btn-secondary">
          Создать
        </button>
      </div>
      
      {(
        <select
          onChange={(e) => {
            onDeleteTag(e.target.value);
            e.target.value = 'def';
          }}
          className="tag-remove"
        >
          <option disabled value='def'>Убрать Тег</option>
          {availableTags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default TagManager;