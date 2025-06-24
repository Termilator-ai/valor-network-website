import { NextRequest, NextResponse } from 'next/server';

// Optionally, import revalidatePath if using Next.js 13+ with app directory
import { revalidatePath } from 'next/cache';

// This API route receives webhook POSTs from NamelessMC
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Log the webhook payload for now
    console.log('Received NamelessMC webhook:', body);

    // Check for relevant forum events
    if (
      body?.event === 'New Topic' ||
      body?.event === 'Topic reply' ||
      body?.event === 'forum_topic_created' ||
      body?.event === 'forum_post_created'
    ) {
      // Revalidate the forums page (Next.js 13+ app dir)
      try {
        // This will revalidate the /forums route
        await revalidatePath('/forums');
        console.log('Revalidated /forums');
      } catch (err) {
        console.error('Failed to revalidate /forums:', err);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error', error: error?.toString() }, { status: 400 });
  }
}
