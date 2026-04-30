import { Request, Response, NextFunction } from 'express';
import { parseIdParam } from '../utils/helpers';
import { UserService } from '../services/user.service';
import { UpdateUserInput, UpdateAccessibilityInput } from '../validators/user.validator';

const userService = new UserService();

export class UserController {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      const user = await userService.getUserById(userId, req.user.userId, req.user.role);

      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request<{ id: string }, object, UpdateUserInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      const user = await userService.updateUser(
        userId,
        req.body,
        req.user.userId,
        req.user.role
      );

      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      await userService.deleteUser(userId, req.user.userId, req.user.role);

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAccessibilitySettings(
    req: Request<{ id: string }, object, UpdateAccessibilityInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      const settings = await userService.updateAccessibilitySettings(
        userId,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        status: 'success',
        message: 'Accessibility settings updated successfully',
        data: { settings },
      });
    } catch (error) {
      next(error);
    }
  }
}
