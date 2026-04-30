import { Request, Response, NextFunction } from 'express';
import { parseIdParam } from '../utils/helpers';
import { ProductService } from '../services/product.service';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../validators/product.validator';

const productService = new ProductService();

export class ProductController {
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await productService.getProducts(req.query as unknown as GetProductsQuery);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseIdParam(req.params.id);
      const product = await productService.getProductById(productId);

      res.status(200).json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request<object, object, CreateProductInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request<{ id: string }, object, UpdateProductInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productId = parseIdParam(req.params.id);
      const product = await productService.updateProduct(productId, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseIdParam(req.params.id);
      await productService.deleteProduct(productId);

      res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
