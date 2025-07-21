import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/solid';

export default function Elevator({ elevator, floors, width = 80, height = 80 }) {
  const y = (floors - 1 - elevator.currentFloor) * height;
  return (
    <div className="relative" style={{ width, height: floors*height }}>
      <motion.div
        animate={{ y }}
        transition={{ duration: 0.6, type: "spring" }}
        className="absolute left-0 w-full flex flex-col items-center"
      >
        <div className={`rounded border shadow bg-white w-full h-[${height}px] flex flex-col items-center px-1
          ${elevator.door === 'open' ? 'bg-green-100' : ''}
          ${elevator.passengers.length >= elevator.maxCapacity ? 'border-red-500 border-2' : ''}
        `}>
          <span className="text-xs font-semibold">E{elevator.id}</span>
          <span className="text-xs">Floor: {elevator.currentFloor}</span>
          <span>
            {elevator.direction === 'up' ? <ArrowUpIcon className="w-4 h-4 text-green-600" /> :
             elevator.direction === 'down' ? <ArrowDownIcon className="w-4 h-4 text-blue-600" /> :
             <MinusIcon className="w-4 h-4 text-gray-400" />}
          </span>
          <span className="text-xs">🚪 {elevator.door}</span>
          <span className="text-xs">🧑‍🤝‍🧑 {elevator.passengers.length}</span>
        </div>
      </motion.div>
    </div>
  )
}
