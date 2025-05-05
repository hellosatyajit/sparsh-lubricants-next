import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';
import { inquiries } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const result = await db.select().from(inquiries);
  return NextResponse.json(result);
}
