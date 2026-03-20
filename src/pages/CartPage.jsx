import { useEffect, useState } from "react";
import axios from "axios";

const USER_ID = 101;
const API = "http://localhost:8083/ecommerce/carts";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const fetchCart = async () => {
    const res = await axios.get(`${API}/user/${USER_ID}/summary`);
    setCart(res.data);
    setSelectedCoupon(res.data.couponName || null);
  };

  const fetchCoupons = async () => {
    const res = await axios.get(`${API}/coupons`);
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCart();
    fetchCoupons();
  }, []);

  const updateQty = async (productId, qty) => {
    await axios.put(`${API}/${cart.cartId}/items/${productId}/quantity`, {
      quantity: qty,
    });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await axios.delete(`${API}/${cart.cartId}/items/${productId}`);
    fetchCart();
  };

  const applyCoupon = async (coupon) => {
    await axios.put(`${API}/${cart.cartId}/coupon`, {
      couponName: coupon.code,
      discountPercent: coupon.discountPercent,
    });
    setSelectedCoupon(coupon.code);
    fetchCart();
  };

  const clearCoupon = async () => {
    await axios.delete(`${API}/${cart.cartId}/coupon`);
    setSelectedCoupon(null);
    fetchCart();
  };

  if (!cart) return <div className="p-6">Loading...</div>;

  const deliveryFee = cart.subtotal > 499 ? 0 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* HEADING */}
        <h1 className="text-3xl font-bold mb-6 tracking-wide">
          🛒 Your Cart
        </h1>

        {/* ITEMS */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-[60px_2fr_1fr_1fr_1fr_1fr_1fr_80px] gap-2 items-center bg-white/10 backdrop-blur-md p-3 rounded-xl hover:scale-[1.01] transition"
            >
              <div className="w-[50px] h-[50px] bg-blue-200/30 rounded-lg flex items-center justify-center text-xs">
                Img
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  {item.productName}
                </h2>
                <p className="text-[10px] text-gray-200">
                  Premium product description
                </p>
              </div>

              {/* QTY */}
              <div className="flex justify-center gap-1">
                <button
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="text-center">₹{item.unitPrice}</div>
              <div className="text-center">₹{item.lineSubtotal}</div>

              {/* DISCOUNT */}
              <div className="text-center text-green-300">
                {cart.discountPercent > 0 ? `-₹${item.lineDiscount}` : ""}
              </div>

              <div className="text-center font-semibold text-blue-200">
                ₹{item.lineTotal}
              </div>

              <div className="text-right">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-300 hover:text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COUPONS */}
        <div className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-xl">
          <h2 className="text-lg font-semibold mb-3">🎟 Available Coupons</h2>

          <div className="flex gap-3 flex-wrap">
            {coupons.map((c) => {
              const now = new Date();
              const isExpired = new Date(c.expiryDate) < now;

              const eligible =
                cart.subtotal >= c.minCartValue &&
                !isExpired &&
                c.status === "ACTIVE";

              const isSelected = selectedCoupon === c.code;

              return (
                <div
                  key={c.id}
                  onClick={() => eligible && applyCoupon(c)}
                  className={`p-3 rounded-xl text-xs w-[180px] border transition cursor-pointer relative
                  ${
                    isSelected
                      ? "bg-green-400 text-black scale-105"
                      : eligible
                      ? "bg-blue-400/20 hover:bg-blue-400/40 border-blue-300"
                      : "bg-gray-400/20 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <p className="font-bold">{c.code}</p>
                  <p>{c.description}</p>
                  <p>{c.discountPercent}% OFF</p>

                  {!eligible && (
                    <p className="text-[10px] mt-1 text-red-300">
                      Add ₹{c.minCartValue - cart.subtotal} more
                    </p>
                  )}
                </div>
              );
            })}

            {cart.discountPercent > 0 && (
              <button
                onClick={clearCoupon}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-xs"
              >
                Clear Coupon
              </button>
            )}
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mt-4">
          {deliveryFee === 0 ? (
            <p className="text-green-300 font-semibold">
              🎉 Free Delivery Unlocked!
            </p>
          ) : (
            <p className="text-gray-200">Delivery Fee: ₹50</p>
          )}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 bg-white/10 backdrop-blur-md p-5 rounded-xl flex justify-between items-center">
          <div>
            <p>Subtotal: ₹{cart.subtotal}</p>
            <p className="text-green-300">Discount: ₹{cart.discountAmount}</p>
            <p>Delivery: ₹{deliveryFee}</p>
            <p className="text-xl font-bold text-blue-200">
              Total: ₹{cart.total + deliveryFee}
            </p>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg">
            Checkout →
          </button>
        </div>

      </div>
    </div>
  );
}