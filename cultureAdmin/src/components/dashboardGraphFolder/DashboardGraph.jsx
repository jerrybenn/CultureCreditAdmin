import React from "react";
import "./DashboardGraph.css";
import Chart from "react-apexcharts";

const DashboardGraph = () => {
  const chartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    title: {
      text: "Monthly Participation",
      align: "center",
    },
  };

  const seriesData = [
    {
      name: "Sales",
      data: [30, 45, 60, 20, 50, 70],
    },
  ];

  return (
    <div className="graphContainer">
      <Chart options={chartOptions} series={seriesData} type="bar" height={350} />
    </div>
  );
};

export default DashboardGraph;
