import mongoose, { Schema } from 'mongoose';
import { ShipmentInfo } from '@mytypes/shippingTypes';

const shippingSchema = new mongoose.Schema({
    customer_id: {type: Schema.Types.ObjectId, ref: 'customer'},
    full_name: {type: String, minlength: 3},
    email: {type: String},
    phone: {type: Number, minlength: 10},
    region: {type: String},
    city: {type: String},
    address: {type: String},
    isDefault: {type: Boolean, default: false}
},
{ timestamps: true }
);


export const ShippingModel = mongoose.model<ShipmentInfo & mongoose.Document>('Shipping', shippingSchema);
