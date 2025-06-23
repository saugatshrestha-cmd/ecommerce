export interface ShipmentInfo{
    _id: string,
    customer_id: string,
    full_name: string,
    email: string, 
    phone: Number,
    region: string,
    city: string,
    isDefault: boolean;
    address: string
}

export interface ShipmentInputInfo{
    customer_id: string,
    full_name: string,
    email: string, 
    phone: Number,
    region: string,
    city: string,
    isDefault?: boolean;
    address: string
}