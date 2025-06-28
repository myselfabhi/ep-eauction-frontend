import { NextResponse } from "next/server";

type Auction = {
  id: string;
  title: string;
  status: string;
  timeline: string;
  suppliers: string;
  lots: string;
};

export async function GET() {
   try {
  const data: Auction[] = [
    { id: '1', title: 'Food Cups', status: 'Live', timeline: '1h', suppliers: '4', lots: '2' }
  ];
  return NextResponse.json(data);
} catch (error) {
  console.error('Error in GET /api/auctions:', error); 
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
}
