
export async function initSimulation(numElevators, numFloors, numPassengers) {
  return fetch(import.meta.env.VITE_BACKEND_URL + '/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numElevators, numFloors, numPassengers }),
  }).then(res => res.json());
}

export async function getStatus() {
  return fetch(import.meta.env.VITE_BACKEND_URL + '/status').then(res => res.json());
}

export async function tickSimulation() {
  return fetch(import.meta.env.VITE_BACKEND_URL + '/tick', { method: 'POST' }).then(res => res.json());
}

export async function setSpeed(speed) {
  return fetch(import.meta.env.VITE_BACKEND_URL + '/speed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ speed }),
  });
}

export async function resetSimulation() {
  return fetch(import.meta.env.VITE_BACKEND_URL + '/reset', { method: 'POST' });
}
