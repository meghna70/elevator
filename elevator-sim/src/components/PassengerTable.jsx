import React from 'react';

export default function PassengerTable({ passengers }) {
  return (
    <div className="overflow-x-auto mt-3 rounded-lg shadow-lg bg-white">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">ID</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">From</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">To</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">Assigned</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">Status</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">Wait Time</th>
            <th className="text-center bg-gray-100 uppercase font-semibold text-xs text-gray-700 py-3 border-b border-gray-200 sticky top-0 z-10">Travel Time</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p, idx) => (
            <tr
              key={p.id}
              className={
                `transition-colors duration-150 border-b 
                
                ${p.status === 'completed' ? 'bg-green-50/70' : 
                  p.status === 'waiting' ? 'bg-yellow-50/70' : 'bg-blue-50/70'}
                hover:bg-blue-100`
              }
            >
              <td className="text-center px-3 py-2 border-r border-gray-100">{p.id}</td>
              <td className="text-center px-3 py-2 border-r border-gray-100">{p.originFloor}</td>
              <td className="text-center px-3 py-2 border-r border-gray-100">{p.destinationFloor}</td>
              <td className="text-center px-3 py-2 border-r border-gray-100">{p.assignedElevator || '-'}</td>
              <td className="text-center px-3 py-2 border-r border-gray-100">{p.status}</td>
              <td className="text-center px-3 py-2 border-r border-gray-100">
                {p.arrivalTime && p.boardTime
                  ? ((p.boardTime - p.arrivalTime) / 1000).toFixed(2) + ' s'
                  : '-'}
              </td>
              <td className="text-center px-3 py-2">
                {p.leaveTime && p.boardTime
                  ? ((p.leaveTime - p.boardTime) / 1000).toFixed(2) + ' s'
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
