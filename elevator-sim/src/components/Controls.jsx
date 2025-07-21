import React, { useState } from 'react';

export default function Controls({ onInit, onStart, onStop, onReset, onSpeed }) {
  const [n, setN] = useState(3);
  const [k, setK] = useState(10);
  const [r, setR] = useState(20);

  return (
    <div className="flex gap-4 items-center p-4 bg-gray-100 rounded">
      <label># Elevators <input type="number" value={n} min="1" max="10" onChange={e => setN(+e.target.value)} className="w-16 ml-1 p-1" /></label>
      <label># Floors <input type="number" value={k} min="2" max="30" onChange={e => setK(+e.target.value)} className="w-16 ml-1 p-1" /></label>
      <label># Passengers <input type="number" value={r} min="1" max="100" onChange={e => setR(+e.target.value)} className="w-16 ml-1 p-1" /></label>
      <button className="btn btn-primary" onClick={() => onInit(n,k,r)}>Init</button>
      <button className="btn btn-success" onClick={onStart}>Start</button>
      <button className="btn btn-warning" onClick={onStop}>Stop</button>
      <button className="btn btn-danger" onClick={onReset}>Reset</button>
      <select onChange={e => onSpeed(+e.target.value)} className="ml-4 p-1 rounded">
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={5}>5x</option>
      </select>
    </div>
  )
}
