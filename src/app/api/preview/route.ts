import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenGraph-Bot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Simple regex extraction for Open Graph data
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i);
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"[^>]*>/i);
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i);
    
    // Fallback to regular title if no og:title
    const fallbackTitleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    return NextResponse.json({
      title: titleMatch?.[1] || fallbackTitleMatch?.[1] || 'No title',
      description: descriptionMatch?.[1] || 'No description',
      image: imageMatch?.[1] || null,
    });
  } catch (error: unknown) {
    console.error('Error fetching Open Graph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preview data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
