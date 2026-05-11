"use client";

import { Participant } from "../lib/types";

type ParticipantCardProps = {
  participant: Participant;
  onToggleMic: (participant: Participant) => void;
  onToggleCamera: (participant: Participant) => void;
  onOpenDetails: (participantId: number) => void;
  disabled?: boolean;
};

export default function ParticipantCard({
  participant,
  onToggleMic,
  onToggleCamera,
  onOpenDetails,
  disabled = false,
}: ParticipantCardProps) {
  return (
    <article className="card">
      <div className="videoPreview" aria-label={`${participant.name} video preview`}>
        <div className={`videoPlaceholder ${participant.camera_enabled ? "" : "off"}`}>
          {participant.camera_enabled ? "Video Preview" : "Camera Off"}
        </div>
      </div>

      <div className="participantHeader">
        <div className="avatar" aria-hidden="true">
          {participant.avatar_url ? (
            <img src={participant.avatar_url} alt={participant.name} className="avatarImage" />
          ) : (
            <span>{participant.name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="participantInfo">
          <h2 className="participantName">{participant.name}</h2>
          <p className="participantRole">{participant.role}</p>
          <span className={`status ${participant.is_online ? "online" : "offline"}`}>
            {participant.is_online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="actions">
        <button type="button" onClick={() => onToggleMic(participant)} disabled={disabled}>
          {participant.mic_enabled ? "Mute Mic" : "Unmute Mic"}
        </button>

        <button type="button" onClick={() => onToggleCamera(participant)} disabled={disabled}>
          {participant.camera_enabled ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <button type="button" onClick={() => onOpenDetails(participant.id)} disabled={disabled}>
          View Details
        </button>
      </div>
    </article>
  );
}