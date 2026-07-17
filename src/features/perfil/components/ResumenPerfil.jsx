export default function ResumenPerfil({ user }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-xl flex items-center gap-4">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
        {user?.email?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div>
        <h2 className="text-2xl font-black text-white">Mi Cuenta</h2>
        <p className="text-slate-400 text-sm font-mono">{user?.email}</p>
      </div>
    </div>
  );
}
