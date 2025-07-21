
function scanAlgorithm(elevators, passengers, totalFloors) {
  // Only consider waiting passengers
  const waiting = passengers.filter(p => p.status === 'waiting');
  // Assign waiting passengers whose elevator is not yet assigned
  waiting.forEach(passenger => {
    if (!passenger.assignedElevator) {
      // Find closest non-full idle or moving elevator (in direction)
      let minDist = Number.MAX_SAFE_INTEGER, chosen = null;
      for (const elevator of elevators) {
        if (elevator.passengers.length >= elevator.maxCapacity) continue;
        const dist = Math.abs(elevator.currentFloor - passenger.originFloor);
        if (dist < minDist) {
          minDist = dist;
          chosen = elevator;
        }
      }
      if (chosen) {
        passenger.assignedElevator = chosen.id;
        chosen.targetFloors.push(passenger.originFloor);
      }
    }
  });

  elevators.forEach(elevator => {
    // If at floor in target, open doors
    if (elevator.targetFloors.includes(elevator.currentFloor)) {
      elevator.door = 'open';

      // Passengers board
      passengers.forEach(p => {
        if (p.status === 'waiting' && p.originFloor === elevator.currentFloor && p.assignedElevator === elevator.id && elevator.passengers.length < elevator.maxCapacity) {
          elevator.passengers.push(p.id);
          p.status = 'boarded';
          if (!elevator.targetFloors.includes(p.destinationFloor)) elevator.targetFloors.push(p.destinationFloor);
        }
      });
      // Passengers leave
      passengers.forEach(p => {
        if (p.status === 'boarded' && p.destinationFloor === elevator.currentFloor && elevator.passengers.includes(p.id)) {
          p.status = 'completed';
          elevator.passengers = elevator.passengers.filter(id => id !== p.id);
        }
      });

      // Remove floor from targets
      elevator.targetFloors = elevator.targetFloors.filter(f => f !== elevator.currentFloor);
      elevator.door = 'closed';
    }

    // Determine direction
    if (elevator.targetFloors.length > 0) {
      const dest = elevator.targetFloors[0];
      elevator.direction = dest > elevator.currentFloor ? 'up' : dest < elevator.currentFloor ? 'down' : 'idle';
      if (elevator.direction === 'up') elevator.currentFloor += 1;
      else if (elevator.direction === 'down') elevator.currentFloor -= 1;
      // Utilization (for metrics)
      elevator.busyTicks++;
      elevator.utilization = Math.round((elevator.busyTicks / (elevator.busyTicks + 1)) * 100);
    } else {
      elevator.direction = 'idle';
    }
  });
}

/* Enhanced SCAN/LOOK Algorithm (Extend as desired) */
function enhancedScanAlgorithm(elevators, passengers, totalFloors) {
  // Example: Give waiting > 30s higher priority, bias lobby (0th) during peak
  const now = Date.now();
  passengers.forEach(p => {
    if (p.status === 'waiting' && now - p.timestamp > 30000) p.priority = 2; // boost
    else if (p.status === 'waiting' && p.originFloor === 0) p.priority = 1; // lobby boost
    else p.priority = 0;
  });
  // Sort by priority THEN by timestamp
  const waiting = passengers.filter(p => p.status === 'waiting')
                  .sort((a,b) => b.priority - a.priority || a.timestamp - b.timestamp);
  // Everything else is similar to SCAN, but assigned in new order
  scanAlgorithm(elevators, waiting, totalFloors);
}

module.exports = { scanAlgorithm, enhancedScanAlgorithm };
