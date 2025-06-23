export interface ShipmentInfo{
    _id: string,
    customer_id: string,
    full_name: string,
    email: string, 
    phone: string,
    region: string,
    city: string,
    address: string
}

export interface CreateShipmentInfo{
    full_name: string,
    email: string, 
    phone: string,
    region: string,
    city: string,
    address: string
}

export interface UpdateShipmentInfo{
    full_name?: string,
    email?: string, 
    phone?: string,
    region?: string,
    city?: string,
    address?: string
}