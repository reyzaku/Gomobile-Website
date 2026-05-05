import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASS) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    return NextResponse.json({ token: process.env.ADMIN_SECRET });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
