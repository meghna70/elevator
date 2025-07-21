const express = require('express');
const cors = require('cors');
const { initSimulation, getStatus, tickSimulation, setSpeed, resetSimulation } = require('./simulation/elevatorSystem');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/init', (req, res) => {
  const { numElevators, numFloors, numPassengers } = req.body;
  initSimulation(numElevators, numFloors, numPassengers);
  res.json({ ok: true });
});

app.get('/status', (req, res) => {
  res.json(getStatus());
});

app.post('/tick', (req, res) => {
  tickSimulation();
  res.json(getStatus());
});

app.post('/speed', (req, res) => {
  setSpeed(req.body.speed);
  res.json({ ok: true });
});

app.post('/reset', (req, res) => {
  resetSimulation();
  res.json({ ok: true });
});

const PORT = 4000;
app.listen(PORT, () => console.log(` Backend running on http://localhost:${PORT}`));
