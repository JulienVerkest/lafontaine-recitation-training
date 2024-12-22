export function MenuLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center transform -rotate-6 transition-transform group-hover:rotate-0">
          <span className="text-xl">📖</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm transform rotate-12 transition-transform group-hover:rotate-0">
          <span className="text-sm">🪶</span>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          Menu
        </h2>
        <span className="text-xs text-indigo-500 font-medium tracking-wider">
          LA FONTAINE
        </span>
      </div>
    </div>
  );
}
