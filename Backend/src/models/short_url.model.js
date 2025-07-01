import mongoose from "mongoose";

const shorturlSchema = new mongoose.Schema({
    full_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});    

const ShortUrl = mongoose.model('ShortUrl', shorturlSchema);

export default ShortUrl;