import { classifyAndStoreEmail } from '@/services/emailClassifier';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { subject, body, from } = await request.json();
    const isInquiry = await classifyAndStoreEmail(subject, body, from);
    return NextResponse.json({ isInquiry });
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 });
  }
}
