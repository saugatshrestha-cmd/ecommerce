import { useState, useEffect } from "react";
import { X, Plus, MapPin, Phone, Edit } from "lucide-react";
import type { ShipmentInfo } from "@/types/shippingTypes";
import ShippingForm from "./ShippingForm";
import { useShipping, useDeleteShipping } from "@/hooks/useShipping";

interface AddressSelectionProps {
    selectedAddressId: string | null;
    setSelectedAddressId: (id: string | null) => void;
}

const ShippingSelection = ({ selectedAddressId, setSelectedAddressId }: AddressSelectionProps) => {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<ShipmentInfo | null>(null);
    const { data: initialAddresses, isLoading } = useShipping();
    const { mutate: deleteShipping } = useDeleteShipping();
    const [addresses, setAddresses] = useState<ShipmentInfo[]>([]);
    
    useEffect(() => {
        if (initialAddresses) {
            setAddresses(initialAddresses);
        }
    }, [initialAddresses]);

    const handleEdit = (address: ShipmentInfo) => {
        setEditingAddress(address);
        setShowForm(true);
    };
    const handleDelete = (id: string) => {
        deleteShipping(id);
        if (selectedAddressId === id) setSelectedAddressId(null);
    };

    const handleNewAddress = (newAddress: ShipmentInfo) => {
        if (editingAddress) {
            // Update existing address in the list
            setAddresses(prev => prev.map(addr => 
                addr._id === editingAddress._id ? newAddress : addr
            ));
        } else {
            // Add new address
            setAddresses(prev => [newAddress, ...prev]);
        }
        setSelectedAddressId(newAddress._id);
        setShowForm(false);
        setEditingAddress(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-slate-600 font-medium">Loading addresses...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {(!addresses || addresses.length === 0 || showForm) ? (
                <ShippingForm onClose={() => {setShowForm(false); setEditingAddress(null); }} onSuccess={handleNewAddress} initialData={editingAddress}/>
            ) : (
                <>
                    <div className="space-y-4">
                        {addresses.map((address: ShipmentInfo) => (
                            <div
                                key={address._id}
                                className={`group relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                                    selectedAddressId === address._id
                                        ? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10 shadow-lg"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md"
                                }`}
                                onClick={() => setSelectedAddressId(address._id)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                selectedAddressId === address._id
                                                    ? "border-blue-500 bg-blue-500 shadow-md"
                                                    : "border-slate-300 group-hover:border-slate-400"
                                            }`}
                                        >
                                            {selectedAddressId === address._id && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <h3 className="text-lg font-semibold text-slate-900">
                                                        {address.full_name}
                                                    </h3>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-start space-x-2">
                                                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-slate-700 leading-relaxed">
                                                            {address.address}, {address.city}, {address.region}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Phone className="w-4 h-4 text-slate-500" />
                                                            <span className="text-sm text-slate-600">{address.phone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-1">
                                            <button
                                                className="flex-shrink-0 p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(address);
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            
                                            <button
                                                className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(address._id);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full group border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300"
                        onClick={() => setShowForm(true)}
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-base font-semibold text-slate-700 block">Add New Address</span>
                                <span className="text-sm text-slate-500 mt-1">Deliver to a different location</span>
                            </div>
                        </div>
                    </button>
                </>
            )}
        </div>
    );
};

export default ShippingSelection;