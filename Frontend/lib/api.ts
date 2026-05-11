import { Participant } from "./types";

declare const process: { env?: { NEXT_PUBLIC_API_BASE?: string } } | undefined;

const API_BASE = (typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_API_BASE : undefined) ?? "http://127.0.0.1:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
}

export async function getParticipants(search = ""): Promise<Participant[]> {
  const url = search.trim()
    ? `${API_BASE}/participants?search=${encodeURIComponent(search.trim())}`
    : `${API_BASE}/participants`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse<Participant[]>(res);
}

export async function getParticipant(id: number): Promise<Participant> {
  const res = await fetch(`${API_BASE}/participants/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse<Participant>(res);
}

export async function updateMic(id: number, enabled: boolean): Promise<Participant> {
  const res = await fetch(`${API_BASE}/participants/${id}/mic`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enabled }),
  });

  return handleResponse<Participant>(res);
}

export async function updateCamera(id: number, enabled: boolean): Promise<Participant> {
  const res = await fetch(`${API_BASE}/participants/${id}/camera`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ enabled }),
  });

  return handleResponse<Participant>(res);
}