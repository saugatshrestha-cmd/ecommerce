import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/authService';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';
import { AppError } from '@utils/errorHandler';
import { AuthRequest } from '@mytypes/authTypes';

@injectable()
export class AuthController {

  constructor(
              @inject("AuthService") private authService: AuthService
          ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
      const result = await this.authService.login(email, password, req);

      if (!result.token) {
        logger.warn('Failed login attempt', { email });
        res.status(401).json({ message: result.message });
        return;
      }

      logger.info(`[${req.method}] ${req.originalUrl} - User logged in successfully`, { email });
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });
      
      handleSuccess(res, { 
        message: result.message,
        token: result.token
      });
    } catch (error) {
      handleError(next, error);
    }
  };

  async registerCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.registerCustomer(req.body, req);

      if (!result.user) {
        logger.warn('Registration failed', {
          status: 'failed',
          type: 'registration'
        });
        throw AppError.badRequest(result.message);
      }

      logger.info(`[${req.method}] ${req.originalUrl} - User registered successfully`);

      handleSuccess(res, { message: result.message });
    } catch (error) {
      handleError(next, error);
    }
  };

  async registerSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.registerSeller(req.body, req);

      if (!result.seller) {
        logger.warn('Registration failed', {
          status: 'failed',
          type: 'registration'
        });
        throw AppError.badRequest(result.message);
      }

      logger.info(`[${req.method}] ${req.originalUrl} - Seller registered successfully`);

      handleSuccess(res,result);
    } catch (error) {
      handleError(next, error);
    }
  };

  async registerAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.registerAdmin(req.body, req);

      if (!result.user) {
        logger.warn('Registration failed', {
          status: 'failed',
          type: 'registration'
        });
        throw AppError.badRequest(result.message);
      }

      logger.info(`[${req.method}] ${req.originalUrl} - Admin registered successfully`);

      handleSuccess(res, { message: result.message });
    } catch (error) {
      handleError(next, error);
    }
  };

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.token;

      if (!token) {
        logger.warn('Logout attempt with no active session');
        throw AppError.badRequest('No active session to logout');
      }
      
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info(`[${req.method}] ${req.originalUrl} - User logged out successfully`);

      handleSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      handleError(next, error);
    }
  }

  async currentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new Error("Unauthorized - no user attached to request");
    }
    const authUser = req.user;
    const result = await this.authService.getCurrentUser(authUser);

    logger.info(`[${req.method}] ${req.originalUrl} - Authenticated user fetched`, {
      userId: authUser._id,
      role: authUser.role
    });

    handleSuccess(res, result);
  } catch (error) {
    handleError(next, error);
  }
  }
}
