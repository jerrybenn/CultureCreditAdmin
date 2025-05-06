import React, { useState, useEffect } from "react";
import "./DashboardGraphLine.css";
import Chart from "react-apexcharts";
import { motion } from "framer-motion";

const DashboardGraphLine = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    const fetchMonthlyEventCounts = async () => {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01`;
      const endDate = `${currentYear}-12-31`;

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://127.0.0.1:3841/events/daterange?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from /events/daterange");
        }

        const monthlyCounts = Array(12).fill(0);
        const monthlyEvents = Array(12).fill().map(() => []);

        data.forEach(event => {
          const [year, month, day] = event.date.split('-').map(Number);
          const eventDate = new Date(year, month - 1, day);
          const eventMonth = eventDate.getMonth();

          if (!isNaN(eventDate.getTime())) {
            monthlyCounts[eventMonth] += 1;
            monthlyEvents[eventMonth].push(event);
          } else {
            console.warn("Skipping invalid date:", event.date);
          }
        });

        setMonthlyData(monthlyCounts);
      } catch (error) {
        console.error("Error fetching monthly event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyEventCounts();
  }, []);

  const options = {
    chart: {
      type: "area",
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
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return "";
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: '#2196F3', opacity: 0.8 },
          { offset: 100, color: '#1976D2', opacity: 0.1 }
        ]
      }
    },
    xaxis: {
      categories: monthLabels
    },
    tooltip: {
      enabled: true
    },
    title: {
      text: "Monthly Event Count",
      align: "center",
    }
  };

  const series = [
    {
      name: "Events",
      data: monthlyData
    }
  ];

  return (
    <motion.div 
      className="graphContainer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {loading ? <p>Loading chart...</p> : (
        <Chart
          options={options}
          series={series}
          type="area"
          height={280}
          width="100%"
        />
      )}
    </motion.div>
  );
};

export default DashboardGraphLine;
