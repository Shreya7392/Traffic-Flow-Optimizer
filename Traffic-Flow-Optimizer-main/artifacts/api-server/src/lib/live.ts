import type { Response } from "express";

const clients = new Set<Response>();

export function subscribe(response: Response): void {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  response.write("event: connected\ndata: {}\n\n");
  clients.add(response);
  response.on("close", () => clients.delete(response));
}

export function publish(type: string, data: Record<string, unknown> = {}): void {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) client.write(message);
}
