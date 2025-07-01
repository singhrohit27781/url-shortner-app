import express from 'express';
import connectMongoDB from './src/config/mongo.config.js';
import dotenv from 'dotenv';
import router from './src/routes/short_url.route.js';
import { redirectFromShortUrl } from './src/controller/short_url.controller.js';
import { errorHandler } from './src/utils/errorhandle.js';
import cors from 'cors';

dotenv.config('./.env');

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
// app.post('/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Server is healthy',
//         timestamp: new Date().toISOString()
//     });
// });

// Routes
app.use('/api-create', router);
app.get('/:id', redirectFromShortUrl);

// Handle 404 for undefined routes (removed due to Express 5.x compatibility issue)
// app.all('*', notFoundHandler);

// Global error handler middleware (must be last)
app.use(errorHandler);

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
    connectMongoDB();
});
