import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "../app/page";
import * as api from "../lib/api";

jest.mock("../lib/api", () => ({
  getParticipants: jest.fn(),
  getParticipant: jest.fn(),
  updateMic: jest.fn(),
  updateCamera: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockParticipants = [
  {
    id: 1,
    name: "Aarav Menon",
    email: "aarav@example.com",
    role: "Frontend Developer",
    avatar_url: "",
    is_online: true,
    mic_enabled: true,
    camera_enabled: false,
    created_at: "2026-05-12T10:00:00Z",
    updated_at: "2026-05-12T10:00:00Z",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "Product Manager",
    avatar_url: "",
    is_online: false,
    mic_enabled: false,
    camera_enabled: true,
    created_at: "2026-05-12T10:00:00Z",
    updated_at: "2026-05-12T10:00:00Z",
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders participants after successful API call", async () => {
    mockedApi.getParticipants.mockResolvedValue(mockParticipants);

    render(<HomePage />);

    expect(screen.getByText("Loading participants...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Aarav Menon")).toBeInTheDocument();
      expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    });

    expect(mockedApi.getParticipants).toHaveBeenCalled();
  });

  it("shows empty state when no participants are returned", async () => {
    mockedApi.getParticipants.mockResolvedValue([]);

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("No participants found.")).toBeInTheDocument();
    });
  });

  it("calls debounced search API when user types in search box", async () => {
    jest.useFakeTimers();

    mockedApi.getParticipants.mockResolvedValue(mockParticipants);

    render(<HomePage />);

    const searchInput = screen.getByPlaceholderText("Search participants by name");
    fireEvent.change(searchInput, { target: { value: "Aarav" } });

    jest.advanceTimersByTime(400);

    await waitFor(() => {
      expect(mockedApi.getParticipants).toHaveBeenLastCalledWith("Aarav", 0, 6);
    });

    jest.useRealTimers();
  });

  it("toggles mic successfully", async () => {
    mockedApi.getParticipants.mockResolvedValue([mockParticipants[0]]);

    mockedApi.updateMic.mockResolvedValue({
      ...mockParticipants[0],
      mic_enabled: false,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Aarav Menon")).toBeInTheDocument();
    });

    const micButton = screen.getByText("Mute Mic");
    fireEvent.click(micButton);

    await waitFor(() => {
      expect(mockedApi.updateMic).toHaveBeenCalledWith(1, false);
    });
  });

  it("toggles camera successfully", async () => {
    mockedApi.getParticipants.mockResolvedValue([mockParticipants[1]]);

    mockedApi.updateCamera.mockResolvedValue({
      ...mockParticipants[1],
      camera_enabled: false,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Priya Sharma")).toBeInTheDocument();
    });

    const cameraButton = screen.getByText("Turn Camera Off");
    fireEvent.click(cameraButton);

    await waitFor(() => {
      expect(mockedApi.updateCamera).toHaveBeenCalledWith(2, false);
    });
  });

  it("shows error message when initial participant fetch fails", async () => {
    mockedApi.getParticipants.mockRejectedValue(new Error("Failed to load participants"));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load participants")).toBeInTheDocument();
    });
  });

  it("shows error message when mic update fails", async () => {
    mockedApi.getParticipants.mockResolvedValue([mockParticipants[0]]);

    mockedApi.updateMic.mockRejectedValue(new Error("Failed to update mic"));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Aarav Menon")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Mute Mic"));

    await waitFor(() => {
      expect(screen.getByText("Failed to update mic")).toBeInTheDocument();
    });
  });
});