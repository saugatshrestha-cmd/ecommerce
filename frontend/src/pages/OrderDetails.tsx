import { useParams, Link } from 'react-router-dom';
import { useOrderById } from '@/hooks/useOrder';
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrderById(orderId!);

  if (isLoading) return <div className="p-4">Loading order details...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load order details.</div>;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We'll send you updates about your delivery.
            </p>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{order?.data._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium">${order?.data.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <div className="flex items-center space-x-2">
                    {order?.data.payment.method === 'cod' ? (
                      <>
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Cash on Delivery</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Card Payment</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{order?.data.shippingId.full_name}</p>
                <p className="text-gray-600 mt-1">
                  {order?.data.shippingId.address}, {order?.data.shippingId.city}, {order?.data.shippingId.region}
                </p>
                <p className="text-gray-600">
                  {order?.data.shippingId.phone} • {order?.data.shippingId.email}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order?.data.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${order?.data.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• We'll notify you when your order is being prepared</li>
                <li>• Track your order status in your account</li>
                {order?.data.payment.method === 'cod' && (
                  <li>• Have your payment ready for delivery</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;