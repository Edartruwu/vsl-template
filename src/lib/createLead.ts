"use server";

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

export type CreateLeadInput = {
  name?: string;
  email?: string;
  phone?: string;
};

export type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export async function createLead(input: CreateLeadInput) {
  const { name, email, phone } = input;

  const [lead] = await sql`
    INSERT INTO leads (name, email, phone)
    VALUES (${name ?? null}, ${email ?? null}, ${phone ?? null})
    RETURNING id, name, email, phone, created_at;
  `;

  return lead;
}
