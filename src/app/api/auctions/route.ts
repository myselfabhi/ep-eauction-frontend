import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: '1', title: 'Food Cups', status: 'Live', timeline: '1h', suppliers: '4', lots: '2' }
  ]);
}
