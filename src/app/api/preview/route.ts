import { NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const { result } = await ogs({ url });
    return NextResponse.json({
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
    });
  } catch (error: any) {
    console.error('Error fetching Open Graph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview data', details: error.message },
      { status: 500 },
    );
  }
}
