"use client";

import { create } from "zustand";
import { Participant } from "./types";

type ParticipantStore = {
  participants: Participant[];
  selectedParticipant: Participant | null;
  setParticipants: (participants: Participant[]) => void;
  updateParticipant: (participant: Participant) => void;
  setSelectedParticipant: (participant: Participant | null) => void;
};

export const useParticipantStore = create<ParticipantStore>((set) => ({
  participants: [],
  selectedParticipant: null,
  setParticipants: (participants) => set({ participants }),
  updateParticipant: (participant) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participant.id ? participant : p
      ),
      selectedParticipant:
        state.selectedParticipant?.id === participant.id
          ? participant
          : state.selectedParticipant,
    })),
  setSelectedParticipant: (participant) => set({ selectedParticipant: participant }),
}));