import { getShortUrl } from "../dao/short_url.js";
import { createshorturlwithoutuser } from "../services/short_url.service.js";
import {
    asyncHandler,
    validateUrl,
    validateShortCode,
    NotFoundError
} from "../utils/errorhandle.js";

export const createShortUrl = asyncHandler(async (req, res) => {
    const { url } = req.body;

    // Validate input
    const validatedUrl = validateUrl(url);

    // Create short URL
    const shortUrl = await createshorturlwithoutuser(validatedUrl);

    // Send success response
    res.status(201).json({
        success: true,
        data: {
            shortUrl: shortUrl,
            fullUrl: process.env.APP_URI + shortUrl,
            originalUrl: validatedUrl
        },
        message: 'Short URL created successfully'
    });
});

export const redirectFromShortUrl = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate short code
    const validatedId = validateShortCode(id);

    // Get URL from database
    const urlDoc = await getShortUrl(validatedId);

    if (!urlDoc) {
        throw new NotFoundError('Short URL not found');
    }

    // Redirect to original URL
    res.redirect(urlDoc.full_url);
});
        
