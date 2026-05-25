import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const { 
        navigate, 
        backendUrl, 
        cartItems, 
        setCartItems, 
        getCartAmount, 
        delivery_fee, 
        currency 
    } = useContext(ShopContext);

    // Form inputs state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    // Track input variations
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    // Main Submit Action
    const onSubmitHandler = async (event) => {
        event.preventDefault();
       
        try {
            setLoading(true);
            const orderItems = [];

            // ─── EXACT MATCH FLAT ARRAY PARSING USING itemId ───
            if (Array.isArray(cartItems)) {
                cartItems.forEach((item) => {
                    const actualProductId = item.itemId || item.productId || item._id || item.id;
                    const actualQuantity = Number(item.quantity || item.qty || 1);

                    if (actualProductId && actualQuantity > 0) {
                        orderItems.push({
                            productId: actualProductId,
                            name: item.name || "Optical Glasses",
                            price: Number(item.price || item.totalAmount / actualQuantity || 0),
                            image: item.image || '', 
                            quantity: actualQuantity,
                            lens: item.lens || null
                        });
                    } else {
                        console.warn("Item skipped checking out! Check constraints:", { actualProductId, actualQuantity });
                    }
                });
            }

            // Fallback: Sync localStorage cache if state briefly resets
            if (orderItems.length === 0) {
                const fallbackCart = JSON.parse(localStorage.getItem("cart")) || [];
                console.log("Attempting fallback sync with localStorage cache:", fallbackCart);
                
                fallbackCart.forEach((item) => {
                    const actualProductId = item.itemId || item.productId || item._id || item.id;
                    const actualQuantity = Number(item.quantity || item.qty || 1);

                    if (actualProductId && actualQuantity > 0) {
                        orderItems.push({
                            productId: actualProductId,
                            name: item.name || "Optical Glasses",
                            price: Number(item.price || item.totalAmount / actualQuantity || 0),
                            image: item.image || '', 
                            quantity: actualQuantity,
                            lens: item.lens || null
                        });
                    }
                });
            }

            // Final Guard Rail
            if (orderItems.length === 0) {
                toast.error("Your shopping cart is empty!");
                setLoading(false);
                return;
            }

            const totalAmount = getCartAmount() + delivery_fee;

            const orderData = {
                address: formData,
                items: orderItems,
                amount: totalAmount,
                paymentMethod: paymentMethod
            };

            // Process checkout depending on selected toggle action
            if (paymentMethod === 'cod') {
                // 🌟 FIX: Removed custom manual headers object configuration completely.
                // Because axios.defaults.withCredentials = true is globally active in your ShopContext, 
                // your browser naturally carries your secure verification cookies down to this payload path!
                const response = await axios.post(
                    `${backendUrl}/api/order/place`, 
                    orderData
                );

                if (response.data.success) {
                    setCartItems([]); // Clear array context instance cleanly
                    localStorage.setItem("cart", JSON.stringify([])); // Drop cached local storage state
                    toast.success(response.data.message || "Order placed successfully via COD!");
                    navigate('/orders'); // Route directly to status list dashboard
                } else {
                    toast.error(response.data.message || "Something went wrong creating your order.");
                }
            } else if (paymentMethod === 'razorpay') {
                toast.info("Initializing online gateway. Verification pending...");
            }

        } catch (error) {
            console.error("Submission Failure Pipeline Debug log:", error);
            toast.error(error.response?.data?.message || error.message || "Critical connection timeout error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-14 pt-5 sm:pt-14 min-h-[80vh] border-t max-w-6xl mx-auto px-4 mb-20">
            {/* Left Hand Side Block: Shipping Address Form Details */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3 font-medium">
                    <h3>DELIVERY INFORMATION</h3>
                </div>
                <div className="flex gap-3">
                    <input required name="firstName" onChange={onChangeHandler} value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="First name" />
                    <input required name="lastName" onChange={onChangeHandler} value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="Last name" />
                </div>
                <input required name="email" onChange={onChangeHandler} value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="email" placeholder="Email address" />
                <input required name="street" onChange={onChangeHandler} value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="Street/Apartment" />
                <div className="flex gap-3">
                    <input required name="city" onChange={onChangeHandler} value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="City" />
                    <input required name="state" onChange={onChangeHandler} value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="State" />
                </div>
                <div className="flex gap-3">
                    <input required name="zipcode" onChange={onChangeHandler} value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="number" placeholder="Zip code" />
                    <input required name="country" onChange={onChangeHandler} value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="text" placeholder="Country" />
                </div>
                <input required name="phone" onChange={onChangeHandler} value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full outline-none focus:border-gray-900 transition-colors" type="number" placeholder="Phone number" />
            </div>

            {/* Right Hand Side Block: Totals and Payment Selections */}
            <div className="w-full sm:max-w-[500px]">
                <div className="mt-8 min-w-80">
                    <div className="text-xl sm:text-2xl my-3 font-medium">
                        <h3>CART TOTALS</h3>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 text-sm text-gray-700">
                        <div className="flex justify-between border-b pb-2">
                            <p>Subtotal</p>
                            <p>{currency}{getCartAmount()}.00</p>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <p>Shipping Fee</p>
                            <p>{currency}{delivery_fee}.00</p>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                            <p>Total</p>
                            <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="text-xl sm:text-2xl my-3 font-medium">
                        <h3>PAYMENT METHOD</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div onClick={() => setPaymentMethod('razorpay')} className={`flex items-center gap-3 border p-3 px-4 rounded cursor-pointer select-none transition-all ${paymentMethod === 'razorpay' ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-green-600 bg-green-600' : 'border-gray-400'}`}>
                                {paymentMethod === 'razorpay' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                            </span>
                            <p className="text-gray-500 text-sm font-medium tracking-wide">RAZORPAY GATEWAY</p>
                        </div>
                        <div onClick={() => setPaymentMethod('cod')} className={`flex items-center gap-3 border p-3 px-4 rounded cursor-pointer select-none transition-all ${paymentMethod === 'cod' ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <span className={`w-4 h-4 border rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'border-green-600 bg-green-600' : 'border-gray-400'}`}>
                                {paymentMethod === 'cod' && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                            </span>
                            <p className="text-gray-500 text-sm font-medium tracking-wide">CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-black text-white text-xs tracking-widest font-medium px-16 py-3.5 rounded active:bg-gray-800 disabled:bg-gray-400 transition-all shadow-sm w-full sm:w-auto uppercase"
                        >
                            {loading ? "Processing Order..." : "Place Order"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;