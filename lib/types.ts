export type User = {
  id: number;
  clerk_id: string;
  email: string;
  created_at: string;
};

export type Website = {
  id: number;
  user_id: number;
  slug: string;
  code: string;
  created_at: string;
  updated_at: string;
};

export type AIUsage = {
  id: number;
  user_id: number;
  clerk_id: string;
  usage: number;
  created_at: string;
  updated_at: string;
};
