import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    // locationId: { type: String, required: [true] },
    locationName: { type: String, required: [true] },
    deviceName: { type: String, required: [true] },
    deviceId: { type: String, required: [true] },
    habitacion: { type: String, required: [true] },
    valor: { type: Number, required: [true] },
    createdTime: { type: Number, required: [true] }
});

// Validator

// Schema to model.
const Data = mongoose.model('Data', dataSchema);

export default Data;