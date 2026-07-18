import { Worker } from 'bullmq';
import { connection } from '../queues/email.queue.js';
import CampaignSend from '../models/crm/CampaignSend.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

const processEmail = async (job) => {
    const { campaignSendId, toEmail, couponCode, title } = job.data;

    // Check if real key is provided, else mock
    const isMock = !process.env.RESEND_API_KEY;

    try {
        if (!isMock) {
            const senderEmail = process.env.RESEND_EMAIL || 'onboarding@resend.dev';
            await resend.emails.send({
                from: `Abeer Label <${senderEmail}>`,
                to: [toEmail],
                subject: `Special Offer: ${title}`,
                html: `<p>Hello,</p><p>We have a special offer for you!</p><h2>${title}</h2><p>Use code <strong>${couponCode}</strong> at checkout to get your discount!</p>`
            });
        } else {
            // Mock delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Simulate 5% random failure
            if (Math.random() > 0.95) throw new Error("Simulated Provider Timeout");
        }

        await CampaignSend.findByIdAndUpdate(campaignSendId, {
            status: 'sent',
            sentAt: new Date(),
            $inc: { attempts: 1 }
        });

    } catch (error) {
        await CampaignSend.findByIdAndUpdate(campaignSendId, {
            status: 'failed',
            error: error.message,
            $inc: { attempts: 1 }
        });
        throw error; // Let BullMQ handle retry
    }
};

export const initEmailWorker = () => {
    const worker = new Worker('email-queue', processEmail, {
        connection,
        concurrency: 5, // Process 5 emails at a time
        limiter: {
            max: 10, // Max 10 jobs per second (to respect rate limits)
            duration: 1000,
        }
    });

    worker.on('completed', job => {
        console.log(`Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job.id} has failed with ${err.message}`);
    });

    console.log("Email Worker initialized.");
};
