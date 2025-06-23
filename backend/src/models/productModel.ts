import mongoose from 'mongoose';
import { ProductStatus } from '@mytypes/enumTypes';
import { Product } from '@mytypes/productTypes';

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true 
    },
    images: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File', 
        required: true 
    }],
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller',
        required: true 
    },
    status: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.ACTIVE,
        required: true
    },
    featured: {
        type: Boolean,
        default: false,
    },
    bannerProduct: {
        type: Boolean,
        default: false, 
    },
    isActive: {
        type: Boolean,
        default: false, 
    },
    bannerImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false
    },
    bannerTitle: {
        type: String,
        required: false,
    },
    bannerDescription: {
        type: String,
        required: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    }
},
{ timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });

export const ProductModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);
