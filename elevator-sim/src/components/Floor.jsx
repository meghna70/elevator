import React from 'react';

export default function Floor({ floor, waitingPassengers, elevatorsHere }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-gray-700 font-medium">Floor {floor}</div>
      <div>
        <span className="text-xs mr-2"> Waiting: {waitingPassengers?.length}</span>
        {elevatorsHere.map(e => (
          <span className="inline-block bg-blue-100 border px-1 mx-0.5 rounded">E{e.id}</span>
        ))}
      </div>
    </div>
  )
}
