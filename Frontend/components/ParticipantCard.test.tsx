import { render, screen, fireEvent } from "@testing-library/react";
import ParticipantCard from "./ParticipantCard";

const participant = {
  id: 1,
  name: "Aarav Menon",
  email: "aarav@example.com",
  role: "Frontend Developer",
  avatar_url: "",
  is_online: true,
  mic_enabled: true,
  camera_enabled: false,
  created_at: "",
  updated_at: "",
};

describe("ParticipantCard", () => {
  it("renders participant info and triggers actions", () => {
    const onToggleMic = jest.fn();
    const onToggleCamera = jest.fn();
    const onOpenDetails = jest.fn();

    render(
      <ParticipantCard
        participant={participant}
        onToggleMic={onToggleMic}
        onToggleCamera={onToggleCamera}
        onOpenDetails={onOpenDetails}
      />
    );

    expect(screen.getByText("Aarav Menon")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mute Mic"));
    expect(onToggleMic).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Turn Camera On"));
    expect(onToggleCamera).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Details"));
    expect(onOpenDetails).toHaveBeenCalledWith(1);
  });
});