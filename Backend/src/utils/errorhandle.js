// Custom Error Classes
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500);
        this.name = 'DatabaseError';
    }
}

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new NotFoundError(message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ValidationError(message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ValidationError(message);
    }

    // URL validation error
    if (err.message && err.message.includes('Invalid URL')) {
        error = new ValidationError('Please provide a valid URL');
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Async Error Handler Wrapper
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Service Layer Error Handlers
export const handleServiceError = (error, operation) => {
    console.error(`Service Error in ${operation}:`, error);
    
    if (error instanceof AppError) {
        throw error;
    }
    
    if (error.name === 'ValidationError') {
        throw new ValidationError(error.message);
    }
    
    if (error.code === 11000) {
        throw new ValidationError('Short URL already exists');
    }
    
    throw new DatabaseError(`Failed to ${operation}`);
};

// Controller Layer Error Handlers
export const handleControllerError = (error, res, operation) => {
    console.error(`Controller Error in ${operation}:`, error);
    
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: error.message
        });
    }
    
    return res.status(500).json({
        success: false,
        error: `Failed to ${operation}`,
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
};

// Validation Helpers
export const validateUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        throw new ValidationError('URL is required and cannot be empty');
    }
    
    try {
        new URL(url.trim());
    } catch (urlError) {
        throw new ValidationError('Please provide a valid URL');
    }
    
    return url.trim();
};

export const validateShortCode = (shortCode) => {
    if (!shortCode || typeof shortCode !== 'string' || shortCode.trim() === '') {
        throw new ValidationError('Short code is required');
    }
    
    if (shortCode.length < 3 || shortCode.length > 20) {
        throw new ValidationError('Short code must be between 3 and 20 characters');
    }
    
    return shortCode.trim();
};

// 404 Handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
};

// Graceful Shutdown Handler
export const gracefulShutdown = (server) => {
    const shutdown = (signal) => {
        console.log(`Received ${signal}. Graceful shutdown...`);
        
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
        
        // Force close after 10 seconds
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};

// Unhandled Promise Rejection Handler
export const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (err, promise) => {
        console.error('Unhandled Promise Rejection:', err);
        console.error('Promise:', promise);
        process.exit(1);
    });
};

// Uncaught Exception Handler
export const handleUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        process.exit(1);
    });
};
