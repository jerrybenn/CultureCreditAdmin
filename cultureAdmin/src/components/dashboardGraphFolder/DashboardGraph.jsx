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
        // Get current year's start and end dates
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        // Fetch all events for the current year (both past and upcoming)
        const eventsRes = await axios.get(`http://127.0.0.1:3841/events/daterange?start_date=${startDate}&end_date=${endDate}`);
        const events = eventsRes.data;

        // Create an array of Sets to store unique student IDs for each month
        const uniqueStudentsPerMonth = Array(12).fill().map(() => new Set());

        for (const event of events) {
          const eventMonth = new Date(event.date).getMonth(); // 0-based
          const attendanceRes = await axios.get(`http://127.0.0.1:3841/attendance/${event.id}`);
          const attendingStudents = attendanceRes.data;
          
          // Add each student's ID to the Set for that month
          attendingStudents.forEach(student => {
            uniqueStudentsPerMonth[eventMonth].add(student.id);
          });
        }

        // Convert Sets to counts
        const monthCounts = uniqueStudentsPerMonth.map(students => students.size);
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
      name: "Unique Students",
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
