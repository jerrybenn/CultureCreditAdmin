import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import "./DashboardGraph.css";

const DashboardGraph = () => {
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));

  const monthLabels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axios.get("http://127.0.0.1:3841/events"); // or events/past/<device>
        const events = eventsRes.data.events;

        const monthCounts = new Array(12).fill(0);

        for (const event of events) {
          const eventMonth = new Date(event.date).getMonth(); // 0-based
          const attendanceRes = await axios.get(`http://127.0.0.1:3841/attendance/${event.id}`);
          const numStudents = attendanceRes.data.length;

          monthCounts[eventMonth] += numStudents;
        }

        setMonthlyData(monthCounts);
      } catch (err) {
        console.error("Error loading graph data", err);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    xaxis: {
      categories: monthLabels,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    title: {
      text: "Monthly Student Attendance",
      align: "center",
    }
  };

  const series = [
    {
      name: "Students Attended",
      data: monthlyData,
    },
  ];

  return (
    <div className="graphContainer">
      <Chart options={chartOptions} series={series} type="bar" height={280} width="100%" />
    </div>
  );
};

export default DashboardGraph;
