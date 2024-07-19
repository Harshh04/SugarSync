import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const HbA1cAndGraph = () => {
  const [hba1c, setHbA1c] = useState("");
  const [sugarLogs, setSugarLogs] = useState([]);
  const { user } = useAuthContext();
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch HbA1c
    const fetchHbA1c = async () => {
      const response = await fetch("/api/sugars/calculate/hba1c", {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure you have the user's token
        },
      });
      const data = await response.json();
      if (response.ok) {
        setHbA1c(data.hba1c);
      } else {
        console.log("NO A1C DATA");
        console.log(response);
      }
    };

    // Fetch sugar logs for the last 3 months
    const fetchSugarLogs = async () => {
      const response = await fetch("/api/sugars?timeframe=3months", {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure you have the user's token
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSugarLogs(data);
        // Initialize graph here after data is fetched
      }
    };

    fetchHbA1c();
    fetchSugarLogs();
  }, []);

  // Initialize the graph with Chart.js in a useEffect hook based on sugarLogs state

  useEffect(() => {
    if (sugarLogs.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      // Check if chart instance exists
      if (window.mySugarChart) {
        window.mySugarChart.destroy(); // Destroy existing chart
      }

      // Create new chart instance and assign it to a global variable for later access
      window.mySugarChart = new Chart(ctx, {
        type: "line", // or 'bar', 'pie', etc.
        data: {
          labels: sugarLogs.map((log) =>
            new Date(log.time).toLocaleDateString()
          ), // 'time' is a property of sugarLogs items
          datasets: [
            {
              label: "Sugar Level",
              data: sugarLogs.map((log) => log.sugarlvl), // 'sugarlvl' is a property of sugarLogs items
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              type: "linear",
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [sugarLogs]); // Dependency array includes sugarLogs

  return (
    <div>
      <h3>HbA1c: {hba1c}</h3>
      <canvas id="sugarGraph" ref={chartRef}></canvas>{" "}
      {/* Modify this line to use ref */}
    </div>
  );
};

export default HbA1cAndGraph;
