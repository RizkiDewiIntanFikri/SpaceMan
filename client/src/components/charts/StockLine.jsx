import Chart from 'react-apexcharts'
import { useMarketStore } from '../../stores/marketStore'

export default function StockLine() {
  const selected = useMarketStore(s => s.selectedSymbol)
  const series = useMarketStore(s => s.series[selected] || [])
  const options = {
    chart: { toolbar: { show: false }, animations: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: false } },
    grid: { strokeDashArray: 4 },
  }
  return <Chart options={options} series={[{ name: selected, data: series }]} type="area" height={260} />
}
