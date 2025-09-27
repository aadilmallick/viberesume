import { neon } from "@neondatabase/serverless";

const db_url = process.env.DATABASE_URL;
if (!db_url) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const sql = neon(db_url);

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

class CloudDatabase {
  /* ---------- Tables ---------- */
  static async createUsersTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  static async createWebsitesTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS websites (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        slug VARCHAR(255) UNIQUE NOT NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  /* ---------- Users ---------- */
  static async getUserByClerkId(clerkId: string): Promise<User | null> {
    const result = await sql`SELECT * FROM users WHERE clerk_id = ${clerkId}`;
    return result[0] as User | null;
  }

  static async addUser({
    clerk_id,
    email,
  }: {
    clerk_id: string;
    email: string;
  }) {
    const result = await sql`
      INSERT INTO users (clerk_id, email)
      VALUES (${clerk_id}, ${email})
      ON CONFLICT (clerk_id) DO NOTHING
      RETURNING *
    `;
    return result[0] as User;
  }

  /* ---------- Websites ---------- */
  static async addWebsite({
    user_id,
    slug,
    code,
  }: {
    user_id: number;
    slug: string;
    code: string;
  }) {
    const result = await sql`
      INSERT INTO websites (user_id, slug, code)
      VALUES (${user_id}, ${slug}, ${code})
      RETURNING *
    `;
    return result[0] as Website;
  }

  static async getWebsiteBySlug(slug: string): Promise<Website | null> {
    const result = await sql`SELECT * FROM websites WHERE slug = ${slug}`;
    return result[0] as Website | null;
  }

  static async getWebsitesByUserId(userId: number): Promise<Website[]> {
    return (await sql`SELECT * FROM websites WHERE user_id = ${userId}`) as Website[];
  }

  static async updateWebsiteSlug(id: number, newSlug: string) {
    const result = await sql`
      UPDATE websites
      SET slug = ${newSlug}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] as Website;
  }

  static async deleteWebsite(id: number) {
    await sql`DELETE FROM websites WHERE id = ${id}`;
  }
}

export { sql, CloudDatabase };
