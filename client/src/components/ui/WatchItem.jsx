import { formatCurrency } from "../../utils/formatters";

export default function WatchItem({ badge, name, company, price, changePct }) {
  const up = (changePct ?? 0) >= 0;
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 grid place-items-center rounded-full bg-gray-100 text-lg">{badge}</div>
        <div className="min-w-0">
          <div className="font-medium text-gray-800 truncate">{name}</div>
          <div className="text-gray-500 text-xs truncate">{company}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{formatCurrency(price)}</div>
        <div className={`text-xs ${up ? "text-emerald-600" : "text-rose-600"}`}>
          {up ? "▲" : "▼"} {Math.abs(changePct || 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
