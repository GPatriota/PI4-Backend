import { Request, Response, NextFunction } from 'express';
import { parseIdParam } from '../utils/helpers';
import { AddressService } from '../services/address.service';
import { CreateAddressInput, UpdateAddressInput } from '../validators/address.validator';

const addressService = new AddressService();

export class AddressController {
  async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const addresses = await addressService.getAddresses(req.user.userId);

      res.status(200).json({
        status: 'success',
        data: { addresses },
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(
    req: Request<object, object, CreateAddressInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) throw new Error('User not authenticated');

      const address = await addressService.createAddress(req.user.userId, req.body);

      res.status(201).json({
        status: 'success',
        message: 'Address created successfully',
        data: { address },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(
    req: Request<{ id: string }, object, UpdateAddressInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const addressId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      const address = await addressService.updateAddress(req.user.userId, addressId, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Address updated successfully',
        data: { address },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addressId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      await addressService.deleteAddress(req.user.userId, addressId);

      res.status(200).json({
        status: 'success',
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addressId = parseIdParam(req.params.id);
      if (!req.user) throw new Error('User not authenticated');

      const address = await addressService.setDefaultAddress(req.user.userId, addressId);

      res.status(200).json({
        status: 'success',
        message: 'Default address set successfully',
        data: { address },
      });
    } catch (error) {
      next(error);
    }
  }
}
