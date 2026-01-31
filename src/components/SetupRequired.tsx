export function SetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a1a1a]">
      <div className="max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <h1 className="text-xl font-bold text-amber-400 mb-2">
          Configuration Supabase requise
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Les variables d&apos;environnement Supabase sont manquantes ou non chargées.
        </p>
        <ol className="text-left text-sm text-gray-300 space-y-2 list-decimal list-inside mb-6">
          <li>
            Créez un fichier <code className="bg-[#2a2a2a] px-1 rounded">.env.local</code> à la{" "}
            <strong>racine du projet</strong> (pas dans <code className="bg-[#2a2a2a] px-1 rounded">src/</code>).
          </li>
          <li>
            Ajoutez-y :<br />
            <code className="block mt-1 p-2 bg-[#2a2a2a] rounded text-xs text-left overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
            </code>
          </li>
          <li>
            Redémarrez le serveur : <code className="bg-[#2a2a2a] px-1 rounded">npm run dev</code>
          </li>
        </ol>
        <p className="text-xs text-gray-500">
          Vous pouvez copier <code className="bg-[#2a2a2a] px-1 rounded">.env.example</code> et remplir les valeurs.
        </p>
      </div>
    </div>
  );
}
