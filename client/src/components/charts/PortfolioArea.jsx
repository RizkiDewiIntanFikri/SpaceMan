import Chart from 'react-apexcharts'
import { usePortfolioStore } from '../../stores/portfolioStore'

export default function PortfolioArea() {
  const series = usePortfolioStore(s => s.performance)
  const options = {
    chart: { toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: false } },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
    grid: { strokeDashArray: 4 },
  }
  return <Chart options={options} series={[{ name: 'Portfolio', data: series }]} type="area" height={260} />
}
