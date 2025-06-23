import { container } from "@config/diContainer";
import express from 'express';
import { ProductController } from '@controller/productController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { createProductSchema, updateProductSchema } from "@validation/productValidation";
import { validateImage } from "@middleware/fileMiddleware";
import multer from 'multer';
const upload = multer();

const router = express.Router();
const controller = container.resolve(ProductController);

router.get('/', controller.getAllProducts.bind(controller));
router.get('/banners', controller.getBannerProducts.bind(controller));
router.get('/new', controller.newestProducts.bind(controller));
router.get('/featured', controller.featuredProducts.bind(controller));
router.get('/search', controller.searchProducts.bind(controller));
router.get('/view/:id', controller.getProductById.bind(controller));
router.get("/filter", controller.getFilteredProducts.bind(controller));
router.get("/price-range", controller.getPriceRange.bind(controller));

router.use(AuthMiddleware.verifyToken);

router.get('/seller', RoleMiddleware.hasRole('seller'), controller.getProductBySeller.bind(controller));
router.post('/', new Validator(createProductSchema).validate(), RoleMiddleware.hasRole('seller'), upload.array('images', 5), validateImage, controller.createProduct.bind(controller));
router.put('/seller/:id', RoleMiddleware.hasRole('seller'), new Validator(updateProductSchema).validate(), upload.fields([{name:'newFiles', maxCount:5}, { name: 'bannerImage', maxCount: 1 }]), validateImage, controller.updateProduct.bind(controller));
router.delete('/delete/:id', RoleMiddleware.hasRole('seller'), controller.deleteProduct.bind(controller));

router.get('/all', RoleMiddleware.hasRole('admin'), controller.getAllProducts.bind(controller));
router.get('/product/:id', RoleMiddleware.hasRole('admin'), controller.getProductById.bind(controller));
router.put('/product/:id', RoleMiddleware.hasRole('admin'), new Validator(updateProductSchema).validate(), controller.adminUpdateProduct.bind(controller));
router.patch(
  '/:id/banner-status',
  RoleMiddleware.hasRole('admin'),
  controller.updateBannerStatus.bind(controller)
);

router.patch(
  '/:id/active-status',
  RoleMiddleware.hasRole('admin'),
  controller.updateActiveStatus.bind(controller)
);
router.delete('/product/:id', RoleMiddleware.hasRole('admin'), controller.adminDeleteProduct.bind(controller));


export default router;
