import AgentCard from './AgentCard';

export default function Sidebar() {
  return (
    <div className="w-80 bg-gray-950 p-6 flex flex-col h-screen border-r border-gray-800">
      <h1 className="text-orange-500 font-bold text-xl mb-8">Atelier IA</h1>
      
      <div className="flex-1">
        <h2 className="text-gray-500 text-xs uppercase mb-4">Agents disponibles</h2>
        <AgentCard 
          title="Maestro Éloi" 
          role="Expert en art" 
          description="Analyse vos œuvres et images..." 
          tags={["Analyse", "Histoire", "Critique"]}
          active={true}
        />
        <AgentCard 
          title="Assistant Orion" 
          role="Tâches & Productivité" 
          description="Gestion de tâches, organisation..." 
          tags={["Organisation", "Rédaction"]}
        />
      </div>

      <div className="mt-auto border-t border-gray-800 pt-6">
        <h2 className="text-gray-500 text-xs mb-2">Agent sélectionné</h2>
        <p className="text-white font-bold">Maestro Éloi</p>
      </div>
    </div>
  );
}