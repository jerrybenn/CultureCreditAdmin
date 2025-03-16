import React from 'react'
import './DashboardGraph.css'
import { LineChart } from '@mui/x-charts/LineChart';

const DashboardGraph = () => {
  return (
    <div className="graphContainer">
        this where the graph will be
        <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
        },
      ]}
      width={500}
      height={300}
    />
    </div>
  )
}

export default DashboardGraph