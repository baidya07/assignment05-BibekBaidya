// broken-server.js — Assignment05, Task 1, Step 5
// This server has THREE bugs. Fix each one with a small change
// (move or add a line or two). Do not rewrite the file.
import express from 'express';

const app = express();

const notes = [
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Finish Assignment05' }
];

// log every request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// how many notes?
app.get('/notes/count', (req, res) => {
  res.json({ count: notes.length });
});

// one note by id
app.get('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(3001, () => {
  console.log('Broken server running at http://localhost:3001');
});