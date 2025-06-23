import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata";
// import 'module-alias/register';
import express from 'express';
import cors from "cors";
import { corsOption } from '@middleware/corsMiddleware';
import mongoose from 'mongoose';
import routes from './routes/mongo_routes';
import { errorMiddleware } from "@middleware/errorMiddleware";
import cookieParser from 'cookie-parser';
import { logger } from '@utils/logger';
import { autoLogger } from '@middleware/autoLogger';
import paymentRoutes from './routes/mongo_routes/paymentRoutes';

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

const app = express();
app.use('/payment/webhook', express.raw({ type: 'application/json' }), paymentRoutes);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use(autoLogger());

app.use("", routes);
app.use(errorMiddleware);

mongoose.connect(MONGO_URI)
    .then(() => {
        logger.info('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection failed', {
            error: error.message
        });;
    });
