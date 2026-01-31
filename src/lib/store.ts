"use client";

import type { User, Module, Episode, Progression, Resource, Announcement } from "./types";
import {
  DEMO_MODULES,
  DEMO_EPISODES,
  DEMO_ANNOUNCEMENTS,
  DEMO_RESOURCES,
  DEMO_USERS,
  DEMO_PROGRESSIONS,
} from "./demo-data";

const PREFIX = "platform-thumbnail-";

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

// Current logged-in user (minimal: id, email, name, role)
const USER_KEY = "user";

export function getStoredUser(): User | null {
  return get(USER_KEY, null);
}

export function setStoredUser(user: User | null): void {
  set(USER_KEY, user);
  if (user && typeof window !== "undefined") {
    const full = getUsers().find((u) => u.id === user.id);
    if (full) {
      full.derniereConnexion = new Date().toISOString();
      set("users", [...getUsers().filter((u) => u.id !== full.id), full]);
    }
  }
}

// Full data (demo seed)
export function getUsers(): User[] {
  return get("users", DEMO_USERS);
}

export function setUsers(users: User[]): void {
  set("users", users);
}

export function getModules(): Module[] {
  return get("modules", DEMO_MODULES);
}

export function setModules(modules: Module[]): void {
  set("modules", modules);
}

export function getEpisodes(): Episode[] {
  return get("episodes", DEMO_EPISODES);
}

export function setEpisodes(episodes: Episode[]): void {
  set("episodes", episodes);
}

export function getProgressions(): Progression[] {
  return get("progressions", DEMO_PROGRESSIONS);
}

export function setProgressions(progressions: Progression[]): void {
  set("progressions", progressions);
}

export function getResources(): Resource[] {
  return get("resources", DEMO_RESOURCES);
}

export function getAnnouncements(): Announcement[] {
  return get("announcements", DEMO_ANNOUNCEMENTS);
}

export function setAnnouncements(announcements: Announcement[]): void {
  set("announcements", announcements);
}

// Progression helpers
export function getCompletedEpisodeIds(userId: string): string[] {
  return getProgressions()
    .filter((p) => p.userId === userId && p.completed)
    .map((p) => p.episodeId);
}

export function markEpisodeCompleted(userId: string, episodeId: string): void {
  const list = getProgressions();
  if (list.some((p) => p.userId === userId && p.episodeId === episodeId)) return;
  list.push({
    userId,
    episodeId,
    completed: true,
    dateCompletion: new Date().toISOString(),
  });
  set("progressions", list);
}

export function getProgressForUser(userId: string): {
  completedEpisodes: number;
  totalEpisodes: number;
  progressPercent: number;
  byModule: Record<string, { completed: number; total: number; percent: number }>;
} {
  const episodes = getEpisodes();
  const totalEpisodes = episodes.length;
  const completedIds = getCompletedEpisodeIds(userId);
  const byModule: Record<string, { completed: number; total: number; percent: number }> = {};
  for (const ep of episodes) {
    if (!byModule[ep.moduleId]) {
      byModule[ep.moduleId] = { completed: 0, total: 0, percent: 0 };
    }
    byModule[ep.moduleId].total++;
    if (completedIds.includes(ep.id)) byModule[ep.moduleId].completed++;
  }
  for (const modId of Object.keys(byModule)) {
    const b = byModule[modId];
    b.percent = b.total ? Math.round((b.completed / b.total) * 100) : 0;
  }
  const completedEpisodes = completedIds.length;
  const progressPercent = totalEpisodes ? Math.round((completedEpisodes / totalEpisodes) * 100) : 0;
  return { completedEpisodes, totalEpisodes, progressPercent, byModule };
}

// Activity score 0-5 for admin (connexions + episodes + time)
export function getActivityScore(user: User): number {
  const progressions = getProgressions().filter((p) => p.userId === user.id && p.completed);
  const lastLogin = new Date(user.derniereConnexion).getTime();
  const now = Date.now();
  const daysSinceLogin = (now - lastLogin) / (24 * 60 * 60 * 1000);
  const completedThisWeek = progressions.filter((p) => {
    const d = new Date(p.dateCompletion).getTime();
    return (now - d) / (24 * 60 * 60 * 1000) <= 7;
  }).length;
  let score = 0;
  if (daysSinceLogin <= 1) score += 2;
  else if (daysSinceLogin <= 7) score += 1;
  if (completedThisWeek >= 3) score += 2;
  else if (completedThisWeek >= 1) score += 1;
  const totalCompleted = progressions.length;
  if (totalCompleted >= 10) score += 1;
  return Math.min(5, score);
}

// Seed demo data once
export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(PREFIX + "users")) {
    set("users", DEMO_USERS);
    set("modules", DEMO_MODULES);
    set("episodes", DEMO_EPISODES);
    set("progressions", DEMO_PROGRESSIONS);
    set("resources", DEMO_RESOURCES);
    set("announcements", DEMO_ANNOUNCEMENTS);
  }
}
