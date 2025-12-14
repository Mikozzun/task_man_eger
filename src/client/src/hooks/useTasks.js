import { useState, useEffect, useCallback } from 'react';
import { taskService, tagService } from '../../../server/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await tagService.getAll();
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, [fetchTasks, fetchTags]);

  const addTask = async (taskData) => {
    try {
      const response = await taskService.create(taskData);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskService.update(id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createTag = async (tagData) => {
    try {
      const response = await tagService.create(tagData);
      setTags(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteTag = async (id) => {
    try {
      await tagService.delete(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
    }

  return {
    tasks,
    tags,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    createTag,
    deleteTag,
    refreshTasks: fetchTasks,
    refreshTags: fetchTags
  };
};