import cron from 'node-cron';
import { runAnalyticsEngine } from './updateCustomerAnalytics.js';
import { runExpireCoupons } from './expireCoupons.js';

export const initCronJobs = () => {
    // Run at 2:00 AM every day
    cron.schedule('0 2 * * *', () => {
        console.log('Running nightly Customer Analytics cron job...');
        runAnalyticsEngine();
    });
    
    // Run at 12:05 AM every day
    cron.schedule('5 0 * * *', () => {
        console.log('Running daily Expire Coupons cron job...');
        runExpireCoupons();
    });
    
    console.log('CRM Cron jobs initialized.');
};
