export default function SectionHeader({ title, subtitle = "Here is your performance stats of each month", tabs, active, onChange }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
      {tabs?.length ? (
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onChange?.(t)}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                active === t ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
