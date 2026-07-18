import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Reuse a single connection for the queue
export const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

export const emailQueue = new Queue('email-queue', { connection });

export const enqueueEmails = async (jobs) => {
    // jobs should be an array of { name: string, data: any }
    await emailQueue.addBulk(jobs);
};
