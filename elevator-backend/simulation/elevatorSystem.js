// elevatorSystem.js

const PRIORITY_WAIT_TIME = 30 * 1000; // 30 seconds
const LOBBY_FLOOR = 0;
const MAX_RUSH_HOUR_ELEVATORS = 1;

let elevators = [];
let passengers = [];
let floors = 0;
let lastPassengerId = 1;
let simulationInterval = null;
let speed = 1;
let isMorningRush = true;

function simulationNow() {
  return Date.now();
}

function initSimulation(numElevators = 3, numFloors = 10, numPassengers = 20) {
  stopLoop();
  floors = numFloors;
  lastPassengerId = 1;

  elevators = Array.from({ length: numElevators }, (_, i) => ({
    id: i + 1,
    currentFloor: LOBBY_FLOOR,
    direction: 'idle',
    door: 'closed',
    passengers: [],
    targetFloors: [],
    utilization: 0,
    busyTicks: 0,
    maxCapacity: 5,
    stops: 0,
  }));

  passengers = Array.from({ length: numPassengers }, (_, i) => {
    const origin = isMorningRush ? LOBBY_FLOOR : Math.floor(Math.random() * numFloors);
    let destination;
    do {
      destination = Math.floor(Math.random() * numFloors);
    } while (destination === origin);
    return {
      id: lastPassengerId++,
      timestamp: simulationNow(),
      originFloor: origin,
      destinationFloor: destination,
      status: 'waiting',
      assignedElevator: null,
      arrivalTime: simulationNow(),
      boardTime: null,
      leaveTime: null,
    };
  });

  startLoop();
}

function tickSimulation() {
  assignRequestsToElevators();
  moveElevators();

  if (isMorningRush && passengers.some(p => p.status === 'waiting' && p.originFloor === LOBBY_FLOOR)) {
    elevators.forEach((elevator, i) => {
      if (
        elevator.direction === 'idle' &&
        elevator.passengers.length === 0 &&
        !elevator.targetFloors.includes(LOBBY_FLOOR) &&
        i < MAX_RUSH_HOUR_ELEVATORS
      ) {
        elevator.targetFloors.push(LOBBY_FLOOR);
      }
    });
  }

  updatePassengerTimes();

  if (passengers.every(p => p.status === 'completed')) {
    stopLoop();
  }
}

function startLoop() {
  stopLoop();
  simulationInterval = setInterval(tickSimulation, 1000 / speed);
}

function stopLoop() {
  if (simulationInterval) clearInterval(simulationInterval);
  simulationInterval = null;
}

function assignRequestsToElevators() {
  const now = simulationNow();
  const waiting = passengers.filter(p => p.status === 'waiting');

  waiting.sort((a, b) => {
    const aWait = now - a.timestamp, bWait = now - b.timestamp;
    const aPriority = aWait > PRIORITY_WAIT_TIME, bPriority = bWait > PRIORITY_WAIT_TIME;
    if (aPriority !== bPriority) return bPriority - aPriority;
    return bWait - aWait;
  });

  for (const passenger of waiting) {
    if (passenger.assignedElevator) {
      const elev = elevators.find(e => e.id === passenger.assignedElevator);
      if (
        !elev ||
        elev.passengers.length >= elev.maxCapacity ||
        (elev.targetFloors.indexOf(passenger.originFloor) === -1 &&
         elev.currentFloor !== passenger.originFloor)
      ) {
        passenger.assignedElevator = null;
      }
    }
    if (passenger.assignedElevator) continue;

    const desiredDir = passenger.destinationFloor > passenger.originFloor ? 'up' : 'down';
    let bestElevator = null, bestScore = -Infinity;

    for (const elevator of elevators) {
      const assignedWaiters = passengers.filter(
        p2 => p2.status === 'waiting' && p2.assignedElevator === elevator.id
      ).length;
      const willHaveRoom = elevator.passengers.length + assignedWaiters < elevator.maxCapacity;
      if (!willHaveRoom) continue;

      let score = 0;
      const waitMs = now - passenger.timestamp;
      if (waitMs > PRIORITY_WAIT_TIME) score += 10000;

      const movingToward =
        elevator.direction === desiredDir &&
        ((desiredDir === 'up' && elevator.currentFloor <= passenger.originFloor) ||
         (desiredDir === 'down' && elevator.currentFloor >= passenger.originFloor));
      if (movingToward) score += 1000;
      else if (elevator.direction === 'idle') score += 800;

      if (
        isMorningRush &&
        elevator.direction === 'idle' &&
        elevator.currentFloor === LOBBY_FLOOR &&
        passenger.originFloor === LOBBY_FLOOR &&
        desiredDir === 'up'
      ) {
        score += 3000;
      }

      score -= elevator.targetFloors.length * 5;
      score -= Math.abs(elevator.currentFloor - passenger.originFloor);
      score -= elevator.passengers.length * 3;

      if (score > bestScore) {
        bestScore = score;
        bestElevator = elevator;
      }
    }
    if (bestElevator) {
      passenger.assignedElevator = bestElevator.id;
      if (!bestElevator.targetFloors.includes(passenger.originFloor)) {
        bestElevator.targetFloors.push(passenger.originFloor);
      }
    }
  }
}

function moveElevators() {
  elevators.forEach(elevator => {
    let doorsShouldOpen = false;
    const now = simulationNow();

    const offloading = elevator.passengers
      .map(pid => passengers.find(p => p.id === pid))
      .filter(p => p.status === 'boarded' && p.destinationFloor === elevator.currentFloor);

    if (offloading.length > 0) {
      doorsShouldOpen = true;
      for (const p of offloading) {
        p.status = 'completed';
        p.leaveTime = now;
        elevator.passengers = elevator.passengers.filter(id => id !== p.id);
        elevator.targetFloors = elevator.targetFloors.filter(f => f !== elevator.currentFloor);
      }
    }

    const available = elevator.maxCapacity - elevator.passengers.length;
    const boarding = passengers.filter(
      p =>
        p.status === 'waiting' &&
        p.assignedElevator === elevator.id &&
        p.originFloor === elevator.currentFloor
    ).slice(0, available);

    if (boarding.length > 0) {
      doorsShouldOpen = true;
      for (const p of boarding) {
        p.status = 'boarded';
        p.boardTime = now;
        elevator.passengers.push(p.id);
        if (!elevator.targetFloors.includes(p.destinationFloor)) {
          elevator.targetFloors.push(p.destinationFloor);
        }
      }
      const stillWaiting = passengers.some(
        p =>
          p.status === 'waiting' &&
          p.assignedElevator === elevator.id &&
          p.originFloor === elevator.currentFloor
      );
      if (!stillWaiting) {
        elevator.targetFloors = elevator.targetFloors.filter(f => f !== elevator.currentFloor);
      }
    }

    elevator.door = doorsShouldOpen ? 'open' : 'closed';
    if (doorsShouldOpen) {
      elevator.stops = (elevator.stops || 0) + 1;
    }

    if (elevator.targetFloors.length > 0) {
      const closestTarget = elevator.targetFloors.reduce((a, b) =>
        Math.abs(a - elevator.currentFloor) < Math.abs(b - elevator.currentFloor) ? a : b
      );
      if (closestTarget > elevator.currentFloor) elevator.direction = 'up';
      else if (closestTarget < elevator.currentFloor) elevator.direction = 'down';
      else elevator.direction = 'idle';
    } else {
      elevator.direction = 'idle';
    }

    if (elevator.door === 'closed' && elevator.direction !== 'idle') {
      if (elevator.direction === 'up' && elevator.currentFloor < floors - 1)
        elevator.currentFloor += 1;
      else if (elevator.direction === 'down' && elevator.currentFloor > 0)
        elevator.currentFloor -= 1;
      elevator.busyTicks++;
    }
  });
}

function updatePassengerTimes() {
  const now = simulationNow();
  passengers.forEach(p => {
    if (p.status === 'waiting' && !p.arrivalTime) p.arrivalTime = now;
    if (p.status === 'boarded' && !p.boardTime) p.boardTime = now;
    if (p.status === 'completed' && !p.leaveTime) p.leaveTime = now;
  });
}

function getStatus() {
  const completed = passengers.filter(p => p.status === 'completed');
  const avgWait = completed.length
    ? (completed.reduce((a, p) => a + (p.boardTime - p.arrivalTime), 0) / completed.length / 1000).toFixed(2)
    : 0;
  const avgTravel = completed.length
    ? (completed.reduce((a, p) => a + (p.leaveTime - p.boardTime), 0) / completed.length / 1000).toFixed(2)
    : 0;
  const stopsPerElevator = elevators.map(e => ({
    id: e.id,
    stops: e.stops || 0
  }));

  return {
    elevators,
    floors,
    passengers,
    metrics: {
      avgWait,
      avgTravel,
      completed: completed.length,
      total: passengers.length,
      stopsPerElevator,
    }
  };
}

function setSpeed(newSpeed) {
  speed = newSpeed;
  if (simulationInterval) startLoop();
}
function resetSimulation() {
  stopLoop();
  elevators = [];
  passengers = [];
  floors = 0;
  lastPassengerId = 1;
}
function setMorningRush(enabled) {
  isMorningRush = !!enabled;
}

module.exports = {
  initSimulation,
  getStatus,
  tickSimulation,
  setSpeed,
  resetSimulation,
  setMorningRush
};