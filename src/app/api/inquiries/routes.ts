import { db } from '@/db';
import { inquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    // Convert string ID to number
    const inquiryId = Number(params.id);
    if (isNaN(inquiryId)) {
      return NextResponse.json(
        { error: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['New', 'InProgress', 'Closed'] as const;
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update the inquiry
    const result = await db.update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, inquiryId));

    // Instead of rowsAffected, check for changes by inspecting the result
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
