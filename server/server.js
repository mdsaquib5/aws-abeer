import "dotenv/config";
import app from './app.js';
import mongoConnection from './configs/database.js';
import { initCronJobs } from './cron/index.js';
import { initEmailWorker } from './workers/email.worker.js';
const PORT = process.env.PORT || 4000;

// Connect to Database
mongoConnection();

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    initCronJobs();
    initEmailWorker();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});
