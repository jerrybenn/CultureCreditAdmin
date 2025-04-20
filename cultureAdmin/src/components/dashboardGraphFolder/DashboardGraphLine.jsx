import React, { useState, useEffect } from "react";
import "./DashboardGraphLine.css";
import Chart from "react-apexcharts";

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
        const res = await fetch(`http://127.0.0.1:3841/events/daterange?start_date=${startDate}&end_date=${endDate}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from /events/daterange");
        }

        const monthlyCounts = Array(12).fill(0);
        const monthlyEvents = Array(12).fill().map(() => []);

        console.log("\n=== Date Parsing Debug ===");
        data.forEach(event => {
          // safer date parsing to avoid timezone issues
          const [year, month, day] = event.date.split('-').map(Number);
          const eventDate = new Date(year, month - 1, day); // month is 0-indexed
          const eventMonth = eventDate.getMonth();

          console.log(`Event: ${event.title}`);
          console.log(`Original string: ${event.date}`);
          console.log(`Parsed date: ${eventDate}`);
          console.log(`Month Index: ${eventMonth} (${monthLabels[eventMonth]})`);
          console.log('---');

          if (!isNaN(eventDate.getTime())) {
            monthlyCounts[eventMonth] += 1;
            monthlyEvents[eventMonth].push(event);
          } else {
            console.warn("Skipping invalid date:", event.date);
          }
        });

        console.log("\n=== Monthly Event Details ===");
        monthlyEvents.forEach((events, monthIndex) => {
          if (events.length > 0) {
            console.log(`\n${monthLabels[monthIndex]}:`);
            console.log(`Total events: ${events.length}`);
            events.forEach(event => {
              console.log(`- ${event.title} (${event.date})`);
            });
          }
        });

        console.log("\n=== Summary ===");
        console.log("Total events this year:", data.length);
        console.log("April events:", monthlyCounts[3]);
        console.log("=====================");

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
      toolbar: { show: false }
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
    <div className="graphContainer">
      {loading ? <p>Loading chart...</p> : (
        <Chart
          options={options}
          series={series}
          type="area"
          height={280}
          width="100%"
        />
      )}
    </div>
  );
};

export default DashboardGraphLine;
