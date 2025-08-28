import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useMarketStore } from "../../stores/marketStore";

export default function StockLine() {
  // 1. FIX: Select each piece of state individually. This is stable and prevents re-renders.
  const featuredStocks = useMarketStore((s) => s.featuredStocks);
  const selectedSymbol = useMarketStore((s) => s.selectedSymbol || "AAPL");

  const [seriesData, setSeriesData] = useState([]);

  // 2. FIX: This useEffect now only runs when the live price data changes.
  useEffect(() => {
    // Find the latest price for the currently selected stock
    const latestPrice = featuredStocks?.find(
      (s) => s.symbol === selectedSymbol
    )?.price;

    // Only update the chart data if we have a valid new price
    if (typeof latestPrice === "number") {
      setSeriesData((currentData) => {
        // If the chart is empty, create initial mock data ending with the real price
        if (currentData.length === 0) {
          const mockHistory = Array.from(
            { length: 39 },
            () => latestPrice + (Math.random() - 0.5) * 5 // More realistic mock
          );
          return [...mockHistory, latestPrice];
        }
        // Otherwise, create a new array by shifting the old data and adding the new price
        return [...currentData.slice(1), latestPrice];
      });
    }
  }, [featuredStocks, selectedSymbol]); // This dependency array is now safe

  // 3. The rest of your component can stay the same
  const series = [{ name: selectedSymbol, data: seriesData }];

  const options = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true, easing: "linear", speed: 200 },
    },
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { labels: { show: false } },
    grid: { show: false },
    tooltip: { enabled: false },
  };

  return <Chart options={options} series={series} type="area" height={260} />;
}
