import { Hono } from 'hono';
import { QueueManager } from '@/queue';

const queueManager = new QueueManager();
const route = new Hono();

route.get('/:name', async (c) => {
    const queueName = c.req.param('name');
    const items = await queueManager.getAll(queueName);

    if (!items || items.length === 0) {
        return c.json({ error: `Queue "${queueName}" is empty or does not exist` }, 404);
    }

    return c.json({ items });
});

route.post('/:name/enqueue', async (c) => {
    const queueName = c.req.param('name');
    const body = await c.req.json().catch(() => null);
    if (!body || !('item' in body)) {
        return c.json({ error: 'Missing "item" in request body' }, 400);
    }

    await queueManager.enqueue(queueName, body.item);
    return c.json({ message: `Item enqueued in queue "${queueName}"` });
});

route.post('/:name/dequeue', async (c) => {
    const queueName = c.req.param('name');
    const item = await queueManager.dequeue(queueName);

    if (item === null) {
        return c.json({ error: `Queue "${queueName}" is empty or does not exist` }, 404);
    }

    return c.json({ item });
});

route.get('/:name/peek', async (c) => {
    const queueName = c.req.param('name');
    const item = await queueManager.peek(queueName);

    if (item === null) {
        return c.json({ error: `Queue "${queueName}" is empty or does not exist` }, 404);
    }

    return c.json({ item });
});

route.post('/:name/clear', async (c) => {
    const queueName = c.req.param('name');
    const success = await queueManager.clear(queueName);

    if (!success) {
        return c.json({ error: `Queue "${queueName}" does not exist` }, 404);
    }

    return c.json({ message: `Queue "${queueName}" has been cleared` });
});

route.get('/:name/size', async (c) => {
    const queueName = c.req.param('name');
    const size = await queueManager.size(queueName);

    return c.json({ size });
});

export default route;