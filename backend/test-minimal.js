const express = require('express');
const app = express();

// Test basic routing
app.get('/test', (req, res) => {
  res.json({ message: 'Basic route works' });
});

// Test route with parameter
app.get('/test/:id', (req, res) => {
  res.json({ message: 'Parameter route works', id: req.params.id });
});

// Test route with nested parameter
app.get('/test/:id/status', (req, res) => {
  res.json({ message: 'Nested parameter route works', id: req.params.id });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});
