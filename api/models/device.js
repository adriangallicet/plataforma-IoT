import mongoose from 'mongoose'
import UniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, unique: true, required: [true] },
    name: { type: String, required: [true] },
    selected: { type: Boolean, required: [true], default: false },
    actuators: {type: Array, default: []},
   locationId: {type: String, required: [true]},
    locationName: {type: String, required: [true]},
    createdTime: { type: Number }
});

// Validator
deviceSchema.plugin(UniqueValidator, { message: 'Error, device already exists.' });

// Schema to model.
const Device = mongoose.model('Device', deviceSchema);

export default Device;