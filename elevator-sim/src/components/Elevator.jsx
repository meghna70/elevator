import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/solid';
import { Tooltip } from 'react-tooltip';
export default function Elevator({ elevator, floors, width = 120, height = 110 }) {
  const y = (floors - 1 - elevator.currentFloor) * height;
  const isFull = elevator.passengers.length >= elevator.maxCapacity;
  const isOpen = elevator.door === 'open';

  return (
    <div
      className="relative"
      style={{
        width,
        height: floors * height,
        minWidth: width
      }}
    >
      <motion.div
        animate={{ y }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="absolute left-0 w-full flex flex-col items-center"
      >
        <div
          className={`
            w-full h-[${height}px] flex flex-col justify-between items-center
            rounded-2xl border
            border-gray-200
            bg-white
            hover:shadow-lg
            transition
            ${isOpen ? 'border-green-500 bg-green-50' : ''}
            ${isFull && !isOpen ? 'border-red-400' : ''}
            py-2 px-2
          `}
        >
          {/* Header */}
          <span className="text-sm font-medium text-gray-700">
            Elevator{' '}
            <span className="font-semibold text-blue-600">
              E{elevator.id}
            </span>
          </span>

          {/* Floor + Arrow Row */}
          <div className="flex items-center justify-center mt-0.5 mb-1 space-x-1">
            <span className="text-2xl leading-none font-bold text-gray-900">
              {elevator.currentFloor}
            </span>
            {elevator.direction === 'up' ? (
              <ArrowUpIcon className="w-5 h-5 text-green-600 ml-1" />
            ) : elevator.direction === 'down' ? (
              <ArrowDownIcon className="w-5 h-5 text-blue-600 ml-1" />
            ) : (
              <MinusIcon className="w-5 h-5 text-gray-400 ml-1" />
            )}
          </div>


          <div className="">
            <span
              data-tooltip-id="door-tooltip"
              data-tooltip-content="door status"
            >
              <span
                className={`
                flex items-center mb-1 gap-1 px-3 py-1 rounded-full border text-xs font-medium
                ${isOpen
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                  }
              `}
              >
                <span role="img" aria-label="door">🚪</span> {elevator.door}
              </span> </span>

            <span
              data-tooltip-id="passenger-tooltip"
              data-tooltip-content="passenger count"
              className={`
                flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium
                ${isFull
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-blue-100 text-blue-700 border-blue-200'
                }
              `}
            >
              <span role="img" aria-label="passengers">🛗</span> {elevator.passengers.length}
            </span>

            <Tooltip id="door-tooltip" />
            <Tooltip id="passenger-tooltip" />

          </div>
        </div>
      </motion.div>
    </div>
  );
}
