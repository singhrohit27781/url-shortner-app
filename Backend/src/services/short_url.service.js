import { saveShortUrl } from "../dao/short_url.js";
import { generateNanoId } from "../utils/helper.js";
import { handleServiceError, ValidationError } from "../utils/errorhandle.js";

export const createshorturlwithoutuser = async (url) => {
    try {
        // Validate input
        if (!url || typeof url !== 'string' || url.trim() === '') {
            throw new ValidationError('URL is required and cannot be empty');
        }

        // Generate unique short URL
        const shortUrl = generateNanoId(7);

        // Save to database
        await saveShortUrl(url, shortUrl);

        return shortUrl;
    } catch (error) {
        handleServiceError(error, 'create short URL without user');
    }
};

export const createshorturlwithuser = async (url, userId) => {
    try {
        // Validate input
        if (!url || typeof url !== 'string' || url.trim() === '') {
            throw new ValidationError('URL is required and cannot be empty');
        }

        if (!userId) {
            throw new ValidationError('User ID is required');
        }

        // Generate unique short URL
        const shortUrl = generateNanoId(7);

        // Save to database with user
        await saveShortUrl(url, shortUrl, userId);

        return shortUrl;
    } catch (error) {
        handleServiceError(error, 'create short URL with user');
    }
};