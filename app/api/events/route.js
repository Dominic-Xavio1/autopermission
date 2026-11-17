import { getEventBus } from '@/src/lib/events.js';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const encoder = new TextEncoder();
  const eventBus = getEventBus();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: 'connected' })}\n\n`)
      );

      const listener = (data) => {
        try {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream closed by client
        }
      };

      eventBus.on('permission-update', listener);

      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 25000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        eventBus.off('permission-update', listener);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
