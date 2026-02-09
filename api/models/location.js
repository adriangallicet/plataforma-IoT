import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    userId: { type: String, required: [true] },
    name: { type: String, required: [true] },
    description: { type: String, required: [true] },
    createdTime: { type: Number, required: [true] },
    devices: {type: Array, default: []}
});

// Validator

// Schema to model.
const Location = mongoose.model('Location', locationSchema);

export default Location;