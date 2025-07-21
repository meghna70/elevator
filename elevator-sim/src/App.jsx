import React, { useEffect, useState, useRef } from "react";
import 'react-tooltip/dist/react-tooltip.css'; 
import {
  initSimulation,
  getStatus,
  tickSimulation,
  setSpeed,
  resetSimulation,
} from "./api/elevatorApi"
import Controls from "./components/Controls.jsx";
import Elevator from "./components/Elevator.jsx";
import Floor from "./components/Floor.jsx";
import PassengerTable from "./components/PassengerTable.jsx";
import MetricsDashboard from "./components/MetricsDashboard.jsx";

function App() {
  const [state, setState] = useState({ elevators: [], floors: 10, passengers: [], metrics: {} });
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);


  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(async () => {
        const stat = await getStatus();
        setState(stat);
      }, 500);
      return () => clearInterval(intervalRef.current);
    }
  }, [running]);

  const handleInit = async (n, k, r) => {
    await initSimulation(n, k, r);
    const stat = await getStatus();
    setState(stat);
    setRunning(false);
  };

  const handleStart = () => {
    setRunning(true);
    tickSimulation();
  };

  const handleStop = () => setRunning(false);

  const handleReset = async () => {
    await resetSimulation();
    setRunning(false);
    setState({ elevators: [], floors: 10, passengers: [], metrics: {} });
  };

  const handleSpeed = async (speed) => {
    await setSpeed(speed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="text-3xl font-semibold mb-1"> Elevator Simulation </div>
      <div className="mb-4 text-gray-700 max-w-xl">
        Simulating multiple elevators and passengers, with advanced scheduling, real-time animation, and live metrics.
      </div>
      <Controls
        onInit={handleInit}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onSpeed={handleSpeed}
      />

      <MetricsDashboard metrics={state.metrics} />

      
      <div className="flex gap-6 mt-6">
        <div>
          {[...Array(state.floors)].map((_, i) => {
            const floorNum = state.floors - 1 - i;
            const waitingPassengers = state.passengers.filter(p => p.status === 'waiting' && p.originFloor === floorNum);
            const elevatorsHere = state.elevators.filter(e => e.currentFloor === floorNum);
            return (
              <div key={floorNum} className="flex items-center" style={{ height: 90 }}>
                <Floor floor={floorNum} waitingPassengers={waitingPassengers} elevatorsHere={elevatorsHere} />
                <div className="w-5 h-10" />
              </div>
            );
          })}
        </div>

        <div className="flex">
          {state.elevators.map((e, i) => (
            <Elevator key={e.id} elevator={e} floors={state.floors} width={90} height={80} />
          ))}
        </div>
      </div>
 
      <div className="mt-8 w-full max-w-2xl">
        <PassengerTable passengers={state.passengers} />
      </div>
    </div>
  );
}

export default App;