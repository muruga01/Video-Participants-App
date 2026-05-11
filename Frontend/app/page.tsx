"use client";

import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import ParticipantCard from "../components/ParticipantCard";
import ParticipantDetailModal from "../components/ParticipantDetailModal";
import { getParticipant, getParticipants, updateCamera, updateMic } from "../lib/api";
import { Participant } from "../lib/types";
import { useDebounce } from "../lib/useDebounce";

export default function HomePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    async function loadParticipants() {
      try {
        setLoading(true);
        setError("");
        const data = await getParticipants(debouncedSearch);
        setParticipants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load participants");
      } finally {
        setLoading(false);
      }
    }

    loadParticipants();
  }, [debouncedSearch]);

  async function handleToggleMic(participant: Participant) {
    const previous = participants;
    const nextEnabled = !participant.mic_enabled;

    setUpdatingId(participant.id);
    setParticipants((current) =>
      current.map((p) =>
        p.id === participant.id ? { ...p, mic_enabled: nextEnabled } : p
      )
    );

    try {
      const updated = await updateMic(participant.id, nextEnabled);
      setParticipants((current) =>
        current.map((p) => (p.id === updated.id ? updated : p))
      );

      if (selectedParticipant?.id === updated.id) {
        setSelectedParticipant(updated);
      }
    } catch (err) {
      setParticipants(previous);
      setError(err instanceof Error ? err.message : "Failed to update mic");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleCamera(participant: Participant) {
    const previous = participants;
    const nextEnabled = !participant.camera_enabled;

    setUpdatingId(participant.id);
    setParticipants((current) =>
      current.map((p) =>
        p.id === participant.id ? { ...p, camera_enabled: nextEnabled } : p
      )
    );

    try {
      const updated = await updateCamera(participant.id, nextEnabled);
      setParticipants((current) =>
        current.map((p) => (p.id === updated.id ? updated : p))
      );

      if (selectedParticipant?.id === updated.id) {
        setSelectedParticipant(updated);
      }
    } catch (err) {
      setParticipants(previous);
      setError(err instanceof Error ? err.message : "Failed to update camera");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleOpenDetails(participantId: number) {
    try {
      setError("");
      const participant = await getParticipant(participantId);
      setSelectedParticipant(participant);
      setModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load participant details");
    }
  }

  return (
    <main className="container">
      <header className="pageHeader">
        <h1>Video Call Participants</h1>
        <p className="subtext">
          Search participants, inspect details, and toggle microphone or camera state.
        </p>
      </header>

      <SearchBar value={search} onChange={setSearch} />

      {loading && <p className="infoText">Loading participants...</p>}
      {!loading && error && <p className="errorText">{error}</p>}
      {!loading && !error && participants.length === 0 && (
        <p className="infoText">No participants found.</p>
      )}

      {!loading && participants.length > 0 && (
        <section className="grid">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onToggleMic={handleToggleMic}
              onToggleCamera={handleToggleCamera}
              onOpenDetails={handleOpenDetails}
              disabled={updatingId === participant.id}
            />
          ))}
        </section>
      )}

      <ParticipantDetailModal
        participant={selectedParticipant}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}