import React from 'react';

export default function PassengerTable({ passengers }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-full border text-sm">
        <thead>
          <tr>
            <th className="text-center">ID</th>
            <th className="text-center">From</th>
            <th className="text-center">To</th>
            <th className="text-center">Assigned</th>
            <th className="text-center">Status</th>
            <th className="text-center">Wait Time</th>
            <th className="text-center">Travel Time</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map(p => (
            <tr
              key={p.id}
              className={`border-b ${p.status === 'completed' ? 'bg-green-50' : p.status === 'waiting' ? 'bg-yellow-50' : 'bg-blue-50'}`}
            >
              <td className="text-center">{p.id}</td>
              <td className="text-center">{p.originFloor}</td>
              <td className="text-center">{p.destinationFloor}</td>
              <td className="text-center">{p.assignedElevator || '-'}</td>
              <td className="text-center">{p.status}</td>
              <td className="text-center">
                {p.arrivalTime && p.boardTime ? ((p.boardTime - p.arrivalTime) / 1000).toFixed(2) + ' s' : '-'}
              </td>
              <td className="text-center">
                {p.leaveTime && p.boardTime ? ((p.leaveTime - p.boardTime) / 1000).toFixed(2) + ' s' : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
