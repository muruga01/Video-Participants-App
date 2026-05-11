"use client";

import { Participant } from "../lib/types";

type ParticipantDetailModalProps = {
  participant: Participant | null;
  open: boolean;
  onClose: () => void;
};

export default function ParticipantDetailModal({
  participant,
  open,
  onClose,
}: ParticipantDetailModalProps) {
  if (!open || !participant) return null;

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modalCard"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="participant-modal-title"
      >
        <div className="modalPreview">
          {participant.camera_enabled ? "Large Video Preview" : "Camera Off"}
        </div>

        <h2 id="participant-modal-title">{participant.name}</h2>
        <div className="detailGrid">
          <p><strong>Email:</strong> {participant.email}</p>
          <p><strong>Role:</strong> {participant.role}</p>
          <p><strong>Status:</strong> {participant.is_online ? "Online" : "Offline"}</p>
          <p><strong>Mic:</strong> {participant.mic_enabled ? "On" : "Off"}</p>
          <p><strong>Camera:</strong> {participant.camera_enabled ? "On" : "Off"}</p>
        </div>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}