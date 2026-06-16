export default function AgentCard({ title, role, description, tags, active }) {
  return (
    <div className={`p-4 rounded-xl border border-gray-700 bg-gray-900 mb-4 ${active ? 'ring-1 ring-orange-500' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-orange-200 p-2 rounded-lg text-xl">🎨</div>
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <span className="text-[10px] uppercase tracking-widest text-orange-500">{role}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] px-2 py-1 rounded-full border border-gray-600 text-gray-300">{tag}</span>
        ))}
      </div>
    </div>
  );
}