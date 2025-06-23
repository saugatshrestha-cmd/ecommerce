import { User } from "./userTypes";
import { ShipmentInfo } from "./shippingTypes";
import { ProductInput, Product } from "./productTypes";
import { Cart, CartInput, CartItem } from "./cartTypes";
import { Order, OrderInput } from "./orderTypes";
import { OrderItemStatus } from "./enumTypes";
import { Seller } from "./sellerTypes";
import { Category } from "./categoryTypes";
import { FileMetadata } from "./fileTypes";
import { Audit } from "./auditTypes";

export interface Repository<T> {
    getAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    add(entity: T): Promise<T>;
    update(id: string, updatedInfo: Partial<T>): Promise<void>;
}

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
}

export interface ShippingRepository extends Repository<ShipmentInfo> {
    deleteShippingById(shippingId: string): Promise<boolean>;
    findFirstByUserId(userId: string): Promise<ShipmentInfo | null>;
    getDefaultShippingAddress(userId: string): Promise<ShipmentInfo | null>;
}

export interface SellerRepository extends Repository<Seller> {
    findByEmail(email: string): Promise<Seller | null>;
}

export interface ProductRepository extends Repository<Product> {
    getAll(limit?: number): Promise<Product[]>;
    getBannerProducts(): Promise<Product[]>;
    getFilteredProducts(query: any): Promise<Product[]>;
    getPriceRange(query: any): Promise<Product[]>;
    newestProduct(limit?: number): Promise<Product[]>;
    featuredProduct(): Promise<Product[]>;
    findByName(name: string): Promise<Product | null>;
    searchByName(query: string): Promise<Product[]>;
    updateMany(filter: object, update: object): Promise<void>;
    getBySellerId(sellerId: string): Promise<Product[]>;
    add(productData: ProductInput): Promise<Product>;
}

export interface OrderRepository extends Repository<Order> {
    getOrdersByUserId(userId: string): Promise<Order[]>;
    getOrderBySellerId(sellerId: string): Promise<Order[]>;
    add(orderData: OrderInput): Promise<Order>;
    updateOrderItemStatus(orderId: string, itemId: string, sellerId: string, newStatus: OrderItemStatus): Promise<void>;
}

export interface CategoryRepository extends Repository<Category> {
    findByName(name: string): Promise<Category | null>;
    searchByName(query: string): Promise<Category[]>;
    deleteCategoryById(categoryId: string): Promise<boolean>;
}

export interface CartRepository extends Repository<Cart> {
    findCartByUserId(userId: string): Promise<Cart | null>;
    findRawCartByUserId(userId: string): Promise<Cart | null>;
    add(cartData: CartInput): Promise<Cart>;
    updateCart(userId: string, updatedItems: CartItem[]): Promise<void>;
    removeCartByUserId(userId: string): Promise<boolean>;
}

export interface FileRepository extends Repository<FileMetadata> {
    updateMetadata(id: string, data: Partial<FileMetadata>): Promise<void>;
    deleteManyByIds(id: string): Promise<void>;
}

export interface AuditRepository {
    getAuditLogs(filter: Partial<Audit>,page: number,limit: number): Promise<{ logs: Audit[]; total: number }>;
    getAuditLogsByUserId(userId: string,page: number,limit: number): Promise<{ logs: Audit[]; total: number }>;
    getAuditLogsByEntityId(entityId: string,page: number,limit: number): Promise<{ logs: Audit[]; total: number }>;
    add(audit: Audit): Promise<void>;
}
