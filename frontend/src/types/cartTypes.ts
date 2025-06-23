export interface CartItem{
    productId: ProductInCart,
    productName: string,
    quantity: number,
    priceAtAddition: number,
    sellerId: string,
}

export interface ProductInCart {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    categoryId: {
        _id: string;
        name: string;
    };
    images: {
        _id: string;
        originalName: string;
        url: string;
    }[];
}

export interface Cart{
    _id: string;
    userId: string,
    items: CartItem[]
}

export interface CreateCart {
    productId: string;
    quantity: number;
}

export interface UpdateCart {
    productId: string;
    quantity: number;
}

export interface CartSummary {
    subtotal: number;
    shipping: number;
    vat: number;
    total: number;
}