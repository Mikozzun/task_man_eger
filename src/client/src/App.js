import React, { useState } from 'react';
import { ThemeProvider } from './context/themeContext';
import { useTasks } from './hooks/useTasks';
import ThemeToggle from './components/themeToggle';
import SearchBar from './components/searchBar';
import TaskForm from './components/taskForm';
import TaskList from './components/taskList';
import TagManager from './components/tagManager';
import './styles/themes.css';
import './styles/components.css';

const App = () => {
  const {
    tasks,
    tags,
    addTask,
    updateTask,
    deleteTask,
    createTag,
    deleteTag
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  const handleSubmitTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      await addTask(taskData);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Удалить задачу?')) {
      await deleteTask(id);
    }
  };

  const handleAddTagToTask = async (taskId, tagName) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTags = [...(task.tags || []), tagName];
      await updateTask(taskId, { tags: updatedTags });
    }
  };

  const handleRemoveTagFromTask = async (taskId, tagName) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTags = task.tags.filter(tag => tag !== tagName);
      await updateTask(taskId, { tags: updatedTags });
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <header className="header">
          <h1>Менеджер задач</h1>
          <ThemeToggle />
        </header>

        <main className="main-content">
          <div className="search-section">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Поиск задач..."
            />
          </div>

          <div className="content-grid">
            <div className="left-panel">
              <div className="task-form-section">
                <h2>{editingTask ? 'Редактировать задачу' : 'Новая задача'}</h2>
                <TaskForm
                  onSubmit={handleSubmitTask}
                  initialData={editingTask}
                  onCancel={editingTask ? () => setEditingTask(null) : null}
                />
              </div>

              <div className="tag-section">
                <h2>Управление тегами</h2>
                <TagManager
                  tags={tags}
                  onDeleteTag={deleteTag}
                  onCreateTag={createTag}
                />
              </div>
            </div>

            <div className="right-panel">
              <div className="tasks-header">
                <h2>Задачи ({filteredTasks.length})</h2>
              </div>
              
              <TaskList
                handleAddTagToTask={handleAddTagToTask}
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onRemoveTag={handleRemoveTagFromTask}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;