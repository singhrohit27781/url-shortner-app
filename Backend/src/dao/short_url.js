import urlSchema from "../models/short_url.model.js";
import { DatabaseError, NotFoundError } from "../utils/errorhandle.js";

export const saveShortUrl = async (fullurl, shortUrl, userId) => {
    try {
        const newUrl = new urlSchema({
            full_url: fullurl,
            short_url: shortUrl
        });

        if (userId) {
            newUrl.users = userId;
        }

        const savedUrl = await newUrl.save();
        return savedUrl;
    } catch (error) {
        console.error('Database Error in saveShortUrl:', error);

        if (error.code === 11000) {
            throw new DatabaseError('Short URL already exists');
        }

        if (error.name === 'ValidationError') {
            throw new DatabaseError(`Validation failed: ${error.message}`);
        }

        throw new DatabaseError('Failed to save URL to database');
    }
};

export const getShortUrl = async (shortUrl) => {
    try {
        const url = await urlSchema.findOneAndUpdate(
            { short_url: shortUrl },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!url) {
            throw new NotFoundError('Short URL not found');
        }

        return url;
    } catch (error) {
        console.error('Database Error in getShortUrl:', error);

        if (error instanceof NotFoundError) {
            throw error;
        }

        throw new DatabaseError('Failed to retrieve URL from database');
    }
};