import React from 'react';

export default function MetricsDashboard({ metrics }) {
  return (
    <div className="flex gap-8 mt-3 bg-slate-100 rounded p-2">
      <div>Avg Wait: <span className="font-bold">{metrics.avgWait}s</span></div>
      <div>Avg Travel: <span className="font-bold">{metrics.avgTravel}s</span></div>
      <div>Completed: <span className="font-bold">{metrics?.completed}/{metrics?.total}</span></div>
    </div>
  )
}
