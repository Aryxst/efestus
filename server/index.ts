Bun.serve({
 port: process.env.PORT || 4000,
 fetch(req, server) {
  const url = new URL(req.url);
  if (url.pathname === '/') {
   const upgraded = server.upgrade(req);
   if (!upgraded) {
    return new Response('Upgrade failed', { status: 400 });
   }
  }
  return new Response('Hello World');
 },
 websocket: {
  open: ws => {
   console.log('Client connected');
  },
  message: (ws, message) => {
   console.log('Client sent message', message);
  },
  close: ws => {
   console.log('Client disconnected');
  },
 },
});
