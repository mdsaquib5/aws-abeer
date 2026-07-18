import { create } from 'zustand';

const initialFormData = {
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
};

const useCheckoutStore = create((set) => ({
    activeStep: 1,
    promoCode: '',
    appliedCoupon: null,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    formData: initialFormData,
    validationError: '',

    setActiveStep: (step) => set({ activeStep: step }),
    setPromoCode: (code) => set({ promoCode: code }),
    setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
    setShippingMethod: (method) => set({ shippingMethod: method }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
    })),
    setValidationError: (error) => set({ validationError: error }),
    
    resetCheckout: () => set({
        activeStep: 1,
        promoCode: '',
        appliedCoupon: null,
        shippingMethod: 'standard',
        paymentMethod: 'cod',
        formData: initialFormData,
        validationError: ''
    })
}));

export default useCheckoutStore;
