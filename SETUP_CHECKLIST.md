# Quick Setup Checklist - 25% Advance Payment Feature

## ✅ Implementation Complete

### Backend Changes
- [x] Updated Appointment Model with payment fields
- [x] Updated userController.js with payment logic
- [x] Added payment routes
- [x] Integrated Razorpay SDK
- [x] Added package dependency (razorpay)

### Frontend Changes
- [x] Updated Appointments.jsx with payment flow
- [x] Updated MyAppointments.jsx with payment status display
- [x] Added Razorpay script loading
- [x] Added payment UI improvements

### Documentation
- [x] Created PAYMENT_IMPLEMENTATION.md
- [x] Created .env.example files

---

## 🚀 Next Steps to Get Running

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Get Razorpay Credentials
1. Go to https://dashboard.razorpay.com
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your Key ID and Key Secret

### 3. Configure Environment Variables

**Backend (.env)**
```
PORT=4000
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# NEW - Razorpay Config
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

**Frontend (.env)**
```
REACT_APP_BACKEND_URL=http://localhost:4000

# NEW - Razorpay Config
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 4. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Test the Payment Flow
1. Navigate to a doctor's appointment page
2. Select a date and time slot
3. Click "Book an Appointment"
4. Complete Razorpay payment with test card:
   - Card: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
5. Check "My Appointments" to see payment status

---

## 💡 Key Features Implemented


✅ **Razorpay Integration**: Secure payment processing with signature verification

✅ **Payment Status Tracking**: 
- Pending (awaiting payment)
- Completed (payment successful)
- Failed (payment failed)

✅ **Payment Information Display**:
- Shows advance payment amount during booking
- Displays payment status in "My Appointments"
- Shows remaining balance to be paid

✅ **Security**:
- HMAC signature verification
- JWT token authentication
- Secure payment data handling

---

## 📊 Payment Calculation Example

For a doctor with consultation fee of **₹500**:
- **Total Fee**: ₹500
- **Advance Payment (25%)**: ₹125
- **Remaining Balance**: ₹375 (payable at appointment)

---

## 🔧 API Endpoints Added

```
POST /api/user/book-appointment
- Creates appointment with payment pending status
- Returns: appointment details + payment requirement

POST /api/user/create-payment-order
- Creates Razorpay order for advance payment
- Returns: Razorpay order ID

POST /api/user/verify-payment
- Verifies Razorpay payment signature
- Confirms appointment on successful payment
- Returns: confirmed appointment details
```

---

## 📋 Database Fields Added

**Appointments Collection - New Fields:**
- `doctorFees` - Doctor's consultation fee
- `advancePaymentAmount` - 25% of doctor fees
- `advancePaymentStatus` - Payment status (pending/completed/failed)
- `razorpayOrderId` - Razorpay order identifier
- `razorpayPaymentId` - Razorpay payment identifier
- `paymentDate` - When payment was completed

---

## 🐛 Troubleshooting

**Issue**: Razorpay modal not opening
- **Solution**: Verify Razorpay script is loaded and API key is correct in .env

**Issue**: Payment verification failed
- **Solution**: Check RAZORPAY_KEY_SECRET is correct and payment was processed

**Issue**: Appointment not confirming after payment
- **Solution**: Check MongoDB connection and backend logs

---

## 📚 Additional Resources

- Razorpay Documentation: https://razorpay.com/docs/
- Implementation Guide: See PAYMENT_IMPLEMENTATION.md
- Test Credentials: Use test API keys from Razorpay dashboard

---

## ✨ Ready to Use!

Your Prescripto application now has a complete payment system. Patients will be asked to pay 25% advance during booking, and their payment status will be tracked throughout the appointment lifecycle.
