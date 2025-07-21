import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const FLOOR_HEIGHT = 60;

const ElevatorSimulation = () => {
  const [numFloors, setNumFloors] = useState(10);
  const [numElevators, setNumElevators] = useState(3);
  const [numPassengers, setNumPassengers] = useState(5);
  const [passengerRequests, setPassengerRequests] = useState([]);
  const [elevators, setElevators] = useState([]);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  useEffect(() => {
    const initialElevators = Array.from({ length: numElevators }, (_, i) => ({
      id: i,
      currentFloor: 0,
      direction: 'idle',
      doorOpen: false,
      passengers: [],
    }));
    setElevators(initialElevators);
    stopSimulation();
  }, [numElevators, numFloors]);

  const generatePassengerRequests = (r) => {
    const now = Date.now();
    const requests = [];
    for (let i = 0; i < r; i++) {
      const origin = Math.floor(Math.random() * numFloors);
      let destination = Math.floor(Math.random() * numFloors);
      while (destination === origin) {
        destination = Math.floor(Math.random() * numFloors);
      }
      requests.push({
        id: i,
        originFloor: origin,
        destinationFloor: destination,
        timestamp: now + i * 1000,
        assignedElevator: null,
        status: 'waiting'
      });
    }
    return requests;
  };

  const assignRequestsToElevators = (elevators, requests) => {
    return requests.map((request) => {
      if (request.assignedElevator !== null) return request;
      let bestElevator = null;
      let minDistance = Infinity;

      elevators.forEach((elevator) => {
        const distance = Math.abs(elevator.currentFloor - request.originFloor);
        if (distance < minDistance) {
          minDistance = distance;
          bestElevator = elevator.id;
        }
      });

      return {
        ...request,
        assignedElevator: bestElevator,
      };
    });
  };

  const startSimulation = () => {
    if (intervalRef.current) return;

    const requests = generatePassengerRequests(numPassengers);
    setPassengerRequests(assignRequestsToElevators(elevators, requests));

    intervalRef.current = setInterval(() => {
      setElevators((prevElevators) => {
        const updatedElevators = prevElevators.map((elevator) => {
          let nextFloor = elevator.currentFloor;
          let nextDirection = elevator.direction;
          let doorOpen = false;

          const assignedPassengers = passengerRequests.filter(
            (p) => p.assignedElevator === elevator.id && p.status === 'waiting'
          );

          const dropOffs = elevator.passengers.filter(
            (p) => p.destinationFloor === nextFloor
          );

          const pickups = assignedPassengers.filter(
            (p) => p.originFloor === nextFloor
          );

          if (dropOffs.length || pickups.length) {
            doorOpen = true;
          }

          let updatedPassengers = elevator.passengers.filter(
            (p) => p.destinationFloor !== nextFloor
          );

          updatedPassengers = [...updatedPassengers, ...pickups];

          const hasWaitingPassengers = assignedPassengers.length > 0;
          const hasOnboardPassengers = updatedPassengers.length > 0;

          if (!hasWaitingPassengers && !hasOnboardPassengers) {
            nextDirection = 'idle';
          } else if (nextDirection === 'idle') {
            nextDirection = 'up';
          } else if (nextFloor >= numFloors - 1) {
            nextDirection = 'down';
          } else if (nextFloor <= 0) {
            nextDirection = 'up';
          }

          return {
            ...elevator,
            currentFloor:
              nextDirection === 'idle'
                ? nextFloor
                : nextDirection === 'up'
                ? nextFloor + 1
                : nextFloor - 1,
            direction: nextDirection,
            doorOpen,
            passengers: updatedPassengers,
          };
        });

        setPassengerRequests((prevRequests) =>
          prevRequests.map((req) => {
            const elevator = updatedElevators.find(
              (e) => e.id === req.assignedElevator
            );
            if (!elevator) return req;

            if (
              req.status === 'waiting' &&
              req.originFloor === elevator.currentFloor &&
              elevator.doorOpen
            ) {
              return { ...req, status: 'boarded' };
            }

            if (
              req.status === 'boarded' &&
              req.destinationFloor === elevator.currentFloor &&
              elevator.doorOpen
            ) {
              return { ...req, status: 'completed' };
            }

            return req;
          })
        );

        return updatedElevators;
      });
    }, 1000 / speed);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    const resetElevators = elevators.map((e) => ({
      ...e,
      currentFloor: 0,
      direction: 'idle',
      doorOpen: false,
      passengers: [],
    }));
    setElevators(resetElevators);
    setPassengerRequests([]);
  };

  const handleSpeedChange = (value) => {
    stopSimulation();
    setSpeed(value);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🚀 Elevator Simulation</h1>

      <div className="flex gap-4 mb-4">
        <label>
          Elevators:
          <input
            type="number"
            value={numElevators}
            min={1}
            onChange={(e) => setNumElevators(Number(e.target.value))}
            className="ml-2 border p-1 w-16"
          />
        </label>
        <label>
          Floors:
          <input
            type="number"
            value={numFloors}
            min={2}
            onChange={(e) => setNumFloors(Number(e.target.value))}
            className="ml-2 border p-1 w-16"
          />
        </label>
        <label>
          Passengers:
          <input
            type="number"
            value={numPassengers}
            min={1}
            onChange={(e) => setNumPassengers(Number(e.target.value))}
            className="ml-2 border p-1 w-16"
          />
        </label>
        <div className="flex gap-2">
          <button onClick={startSimulation} className="bg-green-500 text-white px-2 py-1 rounded">Start</button>
          <button onClick={stopSimulation} className="bg-yellow-500 text-white px-2 py-1 rounded">Stop</button>
          <button onClick={resetSimulation} className="bg-red-500 text-white px-2 py-1 rounded">Reset</button>
        </div>
        <div className="flex gap-1 ml-4">
          <button onClick={() => handleSpeedChange(1)} className="border px-2">1x</button>
          <button onClick={() => handleSpeedChange(2)} className="border px-2">2x</button>
          <button onClick={() => handleSpeedChange(5)} className="border px-2">5x</button>
        </div>
      </div>

      <table className="table-auto w-full text-sm border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Passenger</th>
            <th className="border px-2 py-1">From</th>
            <th className="border px-2 py-1">To</th>
            <th className="border px-2 py-1">Elevator</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {passengerRequests.map((req) => (
            <tr key={req.id} className="text-center">
              <td className="border px-2 py-1">P{req.id}</td>
              <td className="border px-2 py-1">{req.originFloor}</td>
              <td className="border px-2 py-1">{req.destinationFloor}</td>
              <td className="border px-2 py-1">{req.assignedElevator !== null ? `E${req.assignedElevator}` : '-'}</td>
              <td className="border px-2 py-1">{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-8">
        {elevators.map((elevator) => (
          <div
            key={elevator.id}
            style={{
              position: 'relative',
              width: '64px',
              height: `${numFloors * FLOOR_HEIGHT}px`,
              border: '1px solid #ccc',
              background: '#f0f0f0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
              }}
            >
              {[...Array(numFloors)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: `${FLOOR_HEIGHT}px`,
                    borderTop: '1px solid #ddd',
                    textAlign: 'center',
                    fontSize: '10px',
                    lineHeight: `${FLOOR_HEIGHT}px`,
                  }}
                >
                  {numFloors - 1 - i}
                </div>
              ))}
            </div>

            <motion.div
              style={{
                position: 'absolute',
                left: '4px',
                width: '56px',
                height: `${FLOOR_HEIGHT - 2}px`,
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                fontSize: '10px',
              }}
              animate={{
                bottom: `${elevator.currentFloor * FLOOR_HEIGHT}px`,
              }}
              transition={{ duration: 0.8 / speed }}
            >
              <div>{`E${elevator.id}`}</div>
              <div>{elevator.doorOpen ? '🚪 Open' : '🔒 Closed'}</div>
              <div>{`📍 ${elevator.direction}`}</div>
              <div>{`👥 ${elevator.passengers.length}`}</div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElevatorSimulation;
