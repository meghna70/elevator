import React from 'react';

export default function Floor({ floor, waitingPassengers, elevatorsHere }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-gray-300 rounded mb-1">
      <div className="text-gray-800 font-medium text-base flex-1 mr-1">
        Floor {floor}
      </div>
      <div className="flex items-center gap-2">
        <span className={
          `px-2 py-0.5 mr-3 rounded-full text-xs font-medium 
          ${waitingPassengers?.length > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-gray-100 text-gray-500'
          }`}
        >
          Waiting: {waitingPassengers?.length}
        </span>
        {elevatorsHere.map(e => (
          <span
            key={e.id}
            className="inline-flex items-center px-2 py-1 mx-0.5 rounded-full
             bg-blue-50 text-blue-900 border-2 border-blue-400 text-xs font-medium"
          >
            E{e.id}
          </span>
        ))}
      </div>
    </div>
  );
}
