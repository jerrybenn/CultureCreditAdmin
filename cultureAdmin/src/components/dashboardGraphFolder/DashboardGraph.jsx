import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { motion } from "framer-motion";
import "./DashboardGraph.css";

const DashboardGraph = () => {
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));
  const [monthlyDetails, setMonthlyDetails] = useState(new Array(12).fill().map(() => ({
    events: [],
    uniqueStudents: new Set(),
    totalAttendance: 0
  })));

  const monthLabels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const uniqueStudentsPerMonth = new Array(12).fill().map(() => new Set());
        const monthlyDetails = new Array(12).fill().map(() => ({
          events: [],
          uniqueStudents: new Set(),
          totalAttendance: 0
        }));

        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const eventsRes = await axios.get(
          `http://127.0.0.1:3841/events/daterange?start_date=${startDate}&end_date=${endDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const events = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.events || []);
        console.log("Total events fetched:", events.length);

        // Log April events specifically
        const aprilEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === 3; // April is month 3 (0-based)
        });
        console.log("April events:", aprilEvents);

        for (const event of events) {
          const eventDate = new Date(event.date);
          const eventMonth = eventDate.getMonth(); // 0-based
          
          try {
            const attendanceRes = await axios.get(`http://127.0.0.1:3841/attendance/${event.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const students = attendanceRes.data;
            
            // Log April attendance specifically
            if (eventMonth === 3) { // April
              console.log(`April event ${event.id} attendance:`, students);
            }

            // Update monthly details
            monthlyDetails[eventMonth].events.push({
              id: event.id,
              name: event.name,
              date: event.date,
              attendanceCount: students.length
            });
            
            students.forEach(student => {
              uniqueStudentsPerMonth[eventMonth].add(student.id);
              monthlyDetails[eventMonth].uniqueStudents.add(student.id);
              monthlyDetails[eventMonth].totalAttendance++;
            });
          } catch (error) {
            console.error(`Error fetching attendance for event ${event.id}:`, error);
          }
        }

        // Log April details
        console.log("April details:", {
          events: monthlyDetails[3].events,
          uniqueStudents: monthlyDetails[3].uniqueStudents.size,
          totalAttendance: monthlyDetails[3].totalAttendance
        });

        // Convert Sets to counts
        const monthCounts = uniqueStudentsPerMonth.map(students => students.size);
        console.log("Final monthly counts:", monthCounts);
        setMonthlyData(monthCounts);
        setMonthlyDetails(monthlyDetails);
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
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
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
    <motion.div 
      className="graphContainer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Chart 
        options={chartOptions} 
        series={series} 
        type="bar" 
        height={280} 
        width="100%" 
      />
    </motion.div>
  );
};

export default DashboardGraph;
