import { Request, Response, NextFunction } from 'express';
import mime from 'mime-types';
import { AppError } from '../utils/errorHandler';

export const validateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files) {
            return next(); // No files to validate
        }

        const maxSizeMB = 1;
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        // Handle both single file array and fields object
        let filesToValidate: Express.Multer.File[] = [];

        if (Array.isArray(req.files)) {
            // Case when using upload.array()
            filesToValidate = req.files;
        } else {
            // Case when using upload.fields()
            const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };
            filesToValidate = Object.values(filesMap).flat();
        }

        if (filesToValidate.length === 0) {
            return next(); // No files to validate
        }

        for (const file of filesToValidate) {
            const mimeType = mime.lookup(file.originalname);
            
            if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
                return next(new AppError(
                    `Only ${allowedMimeTypes.map(t => t.split('/')[1]).join(', ')} images are allowed`
                ));
            }

            if (file.size > maxSizeMB * 1024 * 1024) {
                return next(new AppError(`Each image must be less than ${maxSizeMB}MB`));
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};