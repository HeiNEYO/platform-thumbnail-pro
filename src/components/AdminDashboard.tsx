"use client";

import { useState, useMemo } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Search } from "lucide-react";
import type { UserWithStats } from "@/lib/db/admin";

interface AdminDashboardProps {
  users: UserWithStats[];
}

export function AdminDashboard({ users }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [filterProgress, setFilterProgress] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        const name = (u.full_name ?? u.email)?.toLowerCase() ?? "";
        if (!name.includes(q) && !u.email.toLowerCase().includes(q))
          return false;
      }
      const pct = u.progress_percent ?? 0;
      if (filterProgress === "low" && pct > 25) return false;
      if (filterProgress === "mid" && (pct <= 25 || pct > 75)) return false;
      if (filterProgress === "high" && pct <= 75) return false;
      return true;
    });
  }, [users, search, filterProgress]);

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Tableau des élèves</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Recherche nom / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] py-2 pl-9 pr-3 text-white placeholder-gray-500 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={filterProgress}
          onChange={(e) => setFilterProgress(e.target.value)}
          className="rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">Toute progression</option>
          <option value="low">0-25%</option>
          <option value="mid">26-75%</option>
          <option value="high">76-100%</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-[#2a2a2a]">
              <th className="pb-3 pr-4">Profil</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Inscription</th>
              <th className="pb-3 pr-4">Dernière mise à jour</th>
              <th className="pb-3 pr-4">Progression</th>
              <th className="pb-3 pr-4">Modules complétés</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      name={u.full_name ?? u.email}
                      photo={u.avatar_url}
                      size="sm"
                    />
                    <span className="font-medium text-white">
                      {u.full_name ?? u.email}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                <td className="py-3 pr-4 text-gray-400">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="py-3 pr-4 text-gray-400">
                  {u.updated_at
                    ? new Date(u.updated_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="py-3 pr-4">
                  <div className="w-24">
                    <ProgressBar value={u.progress_percent ?? 0} showLabel />
                  </div>
                  <span className="text-xs text-gray-500">
                    {u.progress_percent ?? 0}%
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-400">
                  {u.completed_episodes ?? 0} / {u.total_episodes ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
