const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { tasks: [], tags: [] };
  }
};

const writeData = async (data) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/tasks', async (req, res) => {
  const data = await readData();
  res.json(data.tasks);
});

app.post('/api/tasks', async (req, res) => {
  const data = await readData();
  const task = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  data.tasks.push(task);
  await writeData(data);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const data = await readData();
  const index = data.tasks.findIndex(task => task.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  data.tasks[index] = {
    ...data.tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  await writeData(data);
  res.json(data.tasks[index]);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const data = await readData();
  const filteredTasks = data.tasks.filter(task => task.id !== req.params.id);
  
  if (filteredTasks.length === data.tasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  data.tasks = filteredTasks;
  await writeData(data);
  res.json({ message: 'Task deleted' });
});

// ИСПРАВЛЕННЫЙ МЕТОД - была опечатка data.tag вместо data.tags
app.delete('/api/tags/:id', async (req, res) => {
  const data = await readData();
  const filteredTags = data.tags.filter(tag => tag.id !== req.params.id);
  
  if (filteredTags.length === data.tags.length) {
    return res.status(404).json({ error: 'Tag not found' });
  }
  
  data.tags = filteredTags; // ИСПРАВЛЕНО: было data.tag
  await writeData(data);
  res.json({ message: 'Tag deleted' });
});

app.get('/api/tasks/search', async (req, res) => {
  const data = await readData();
  const { q } = req.query;
  
  if (!q) {
    return res.json(data.tasks);
  }
  
  const searchTerm = q.toLowerCase();
  const filtered = data.tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm) ||
    task.description.toLowerCase().includes(searchTerm) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
  
  res.json(filtered);
});

app.get('/api/tags', async (req, res) => {
  const data = await readData();
  res.json(data.tags);
});

app.post('/api/tags', async (req, res) => {
  const data = await readData();
  const { name, color } = req.body;
  
  if (!name || data.tags.some(tag => tag.name === name)) {
    return res.status(400).json({ error: 'Invalid tag name' });
  }
  
  const tag = {
    id: uuidv4(),
    name,
    color: color || '#6b7280'
  };
  
  data.tags.push(tag);
  await writeData(data);
  res.status(201).json(tag);
});

app.get('/api/overdue', async (req, res) => {
  const data = await readData();
  const now = new Date();
  
  const overdue = data.tasks.filter(task => 
    task.deadline && 
    new Date(task.deadline) < now && 
    !task.completed
  );
  
  res.json(overdue);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});