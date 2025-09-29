import { neon } from "@neondatabase/serverless";
import { User, Website, AIUsage } from "@/lib/types";
const db_url = process.env.DATABASE_URL;
if (!db_url) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const sql = neon(db_url);

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

  static async createAIUsageTable() {
    await sql`
      CREATE TABLE IF NOT EXISTS ai_usage (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        clerk_id VARCHAR(255) NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
        usage INT DEFAULT(0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  }

  static async updateWebsiteCodeByID(id: number, code: string) {
    const result = await sql`
      UPDATE websites
      SET code = ${code}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] as Website;
  }

  static async updateWebsiteCodeBySlug(slug: string, code: string) {
    const result = await sql`
      UPDATE websites
      SET code = ${code}, updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
      RETURNING *
    `;
    return result[0] as Website;
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

  static async getOrCreateUser({
    clerk_id,
    email,
  }: {
    clerk_id: string;
    email: string;
  }): Promise<User> {
    // Try to get existing user first
    let user = await this.getUserByClerkId(clerk_id);

    if (!user) {
      // Create user if doesn't exist
      user = await this.addUser({ clerk_id, email });
    }

    return user;
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

  /* ---------- AI Usage ---------- */
  static async getAIUsageByClerkId(clerkId: string): Promise<AIUsage | null> {
    const result =
      await sql`SELECT * FROM ai_usage WHERE clerk_id = ${clerkId}`;
    return result[0] as AIUsage | null;
  }

  // static async getAIUsageByUserId(userId: number): Promise<AIUsage | null> {
  //   const result = await sql`SELECT * FROM ai_usage WHERE user_id = ${userId}`;
  //   return result[0] as AIUsage | null;
  // }

  static async createAIUsage({
    // user_id,
    clerk_id,
  }: {
    // user_id: number;
    clerk_id: string;
  }): Promise<AIUsage> {
    const result = await sql`
      INSERT INTO ai_usage (clerk_id, usage)
      VALUES (${clerk_id}, 0)
      RETURNING *
    `;
    return result[0] as AIUsage;
  }

  static async getOrCreateAIUsage({
    // user_id,
    clerk_id,
  }: {
    // user_id: number;
    clerk_id: string;
  }): Promise<AIUsage> {
    let aiUsage = await this.getAIUsageByClerkId(clerk_id);

    if (!aiUsage) {
      aiUsage = await this.createAIUsage({ clerk_id });
    }

    return aiUsage;
  }

  static async getPortfoliosCountByUserId(userId: number): Promise<number> {
    const result =
      await sql`SELECT COUNT(*) FROM websites WHERE user_id = ${userId}`;
    return result[0].count as number;
  }

  static async getPortfoliosCountByClerkId(clerkId: string): Promise<number> {
    const result =
      await sql`
        SELECT COUNT(*) FROM websites w
        JOIN users u ON w.user_id = u.id
        WHERE u.clerk_id = ${clerkId}
      `;
    return result[0].count as number;
  }

  static async incrementAIUsage(
    clerkId: string,
    amount: number = 1
  ): Promise<AIUsage> {
    const result = await sql`
      UPDATE ai_usage
      SET usage = usage + ${amount}, updated_at = CURRENT_TIMESTAMP
      WHERE clerk_id = ${clerkId}
      RETURNING *
    `;
    return result[0] as AIUsage;
  }

  static async setAIUsage(clerkId: string, usage: number): Promise<AIUsage> {
    const result = await sql`
      UPDATE ai_usage
      SET usage = ${usage}, updated_at = CURRENT_TIMESTAMP
      WHERE clerk_id = ${clerkId}
      RETURNING *
    `;
    return result[0] as AIUsage;
  }

  static async resetAIUsage(clerkId: string): Promise<AIUsage> {
    return this.setAIUsage(clerkId, 0);
  }

  /* ---------- Combined Operations ---------- */
  static async getUserWithAIUsage(
    clerkId: string
  ): Promise<{ user: User; aiUsage: AIUsage } | null> {
    const user = await this.getUserByClerkId(clerkId);
    if (!user) return null;

    const aiUsage = await this.getOrCreateAIUsage({
      // user_id: user.id,
      clerk_id: clerkId,
    });

    return { user, aiUsage };
  }

  static async trackAIUsageForUser(
    clerkId: string,
    amount: number = 1
  ): Promise<AIUsage> {
    // Ensure AI usage record exists
    const user = await this.getUserByClerkId(clerkId);
    if (!user) {
      throw new Error(`User with clerk_id ${clerkId} not found`);
    }

    await this.getOrCreateAIUsage({ clerk_id: clerkId });

    // Increment usage
    return this.incrementAIUsage(clerkId, amount);
  }
}

export { sql, CloudDatabase };
