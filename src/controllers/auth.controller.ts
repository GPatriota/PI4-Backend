import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.validator';

const authService = new AuthService();

export class AuthController {
  async register(req: Request<object, object, RegisterInput>, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request<object, object, LoginInput>, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request<object, object, RefreshTokenInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await authService.getMe(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    // In a stateless JWT system, logout is handled client-side
    // by removing the tokens from storage
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }
}
