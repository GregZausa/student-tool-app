const TipBox = ({ title, tips = [], icon: Icon }) => (
  <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-4">
    <h3 className="text-sm font-semibold text-amber-800 mb-2.5">
      <div className="items-center flex gap-2">
        <Icon size={20} />
        {title}
      </div>
    </h3>
    <ul className="list-disc pl-4 text-xs text-amber-700 space-y-1.5 leading-relaxed">
      {tips.map((tip, i) => (
        <li key={i}>{tip}</li>
      ))}
    </ul>
  </div>
);

export default TipBox;
