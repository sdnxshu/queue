import Redis from 'ioredis';

export class QueueManager {
    private client: Redis;

    constructor(redisUrl = process.env.REDIS_URL || 'redis://localhost:6379') {
        this.client = new Redis(redisUrl);
    }

    private getQueueKey(queueName: string): string {
        return `queue:${queueName}`;
    }

    async enqueue(queueName: string, item: any) {
        const key = this.getQueueKey(queueName);
        await this.client.rpush(key, JSON.stringify(item));
    }

    async dequeue(queueName: string): Promise<any | null> {
        const key = this.getQueueKey(queueName);
        const item = await this.client.lpop(key);
        return item ? JSON.parse(item) : null;
    }

    async peek(queueName: string): Promise<any | null> {
        const key = this.getQueueKey(queueName);
        const item = await this.client.lindex(key, 0);
        return item ? JSON.parse(item) : null;
    }

    async size(queueName: string): Promise<number> {
        const key = this.getQueueKey(queueName);
        return await this.client.llen(key);
    }

    async getAll(queueName: string): Promise<any[]> {
        const key = this.getQueueKey(queueName);
        const items = await this.client.lrange(key, 0, -1);
        return items.map(i => JSON.parse(i));
    }

    async clear(queueName: string): Promise<boolean> {
        const key = this.getQueueKey(queueName);
        const result = await this.client.del(key);
        return result > 0;
    }

    async close() {
        await this.client.quit();
    }
}