import Card from "../ui/Card";
import { formatCurrency } from "../../utils/formatters";

const PctBadge = ({ value }) => {
  const up = (value ?? 0) >= 0;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}>
      {up ? "↑" : "↓"} {Math.abs(value || 0).toFixed(2)}%
    </span>
  );
};

export default function MetricCard({ logo, title, subtitle, price, changePct }) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="text-3xl leading-none">{logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-800 truncate">{title}</div>
            <PctBadge value={changePct} />
          </div>
          <div className="text-gray-500 text-sm truncate">{subtitle}</div>
          <div className="mt-3 text-2xl font-semibold">{formatCurrency(price)}</div>
        </div>
      </div>
    </Card>
  );
}
