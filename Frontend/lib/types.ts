export type Participant = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
  is_online: boolean;
  mic_enabled: boolean;
  camera_enabled: boolean;
  created_at: string;
  updated_at: string;
};