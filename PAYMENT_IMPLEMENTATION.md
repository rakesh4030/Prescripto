# 25% Advance Payment Implementation Guide

## Overview
This document outlines the implementation of a 25% advance payment requirement during doctor appointment booking in the Prescripto application using Razorpay payment gateway.

## Changes Made

### 1. Backend Updates

#### Models
**File: `backend/models/appointmentModel.js`**
- Added payment-related fields to the appointment schema:
  - `doctorFees`: Store the doctor's consultation fee
  - `advancePaymentAmount`: Store 25% of doctor fees
  - `advancePaymentStatus`: Track payment status (pending/completed/failed)
  - `razorpayOrderId`: Store Razorpay order ID
  - `razorpayPaymentId`: Store Razorpay payment ID
  - `paymentDate`: Store payment completion date

#### Controllers
**File: `backend/controllers/userController.js`**
- Integrated Razorpay SDK
- Updated `bookAppointment()` function:
  - Calculates 25% advance payment amount
  - Creates appointment with payment status as 'pending'
  - Returns payment requirement details to frontend
- Added `createPaymentOrder()` function:
  - Creates Razorpay order for the appointment
  - Stores order ID in appointment document
- Added `verifyPayment()` function:
  - Verifies Razorpay payment signature
  - Updates appointment with payment confirmation
  - Marks appointment as confirmed after successful payment

#### Routes
**File: `backend/routes/userRoute.js`**
- Added route: `POST /api/user/create-payment-order`
- Added route: `POST /api/user/verify-payment`

#### Dependencies
**File: `backend/package.json`**
- Added `razorpay: ^2.9.1` package

### 2. Frontend Updates

#### Components
**File: `frontend/src/pages/Appointments.jsx`**
- Added Razorpay script loading in useEffect
- Implemented `processPayment()` function:
  - Calls backend to create payment order
  - Opens Razorpay payment modal
  - Handles payment success/failure
  - Verifies payment on backend
- Updated `bookAppointment()` function:
  - Shows payment processing UI
  - Triggers payment flow after appointment creation
  - Shows 25% payment amount in UI
- Added payment status information display
- Enhanced button with loading state

### 3. Environment Configuration

#### Backend `.env` variables needed:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend `.env` variables needed:
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Step 2: Configure Razorpay

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Get your API keys from Settings → API Keys
3. Add to backend `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. Add to frontend `.env`:
   ```
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

### Step 3: Update Appointment Model in Database
If upgrading from existing database, run a migration to:
- Add new fields to existing appointments
- Set `advancePaymentStatus` to 'completed' for past bookings
- Set `advancePaymentAmount` based on doctor fees

### Step 4: Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Payment Flow

1. **User selects appointment slot and clicks "Book an Appointment"**
   - Frontend validates input
   - Calls `/api/user/book-appointment`

2. **Backend creates appointment with pending payment**
   - Calculates 25% advance payment amount
   - Stores appointment with payment status as 'pending'
   - Returns appointment details and payment requirement

3. **Frontend initiates payment**
   - Shows "Please complete payment to confirm appointment"
   - Calls `/api/user/create-payment-order` to get Razorpay order
   - Opens Razorpay payment modal

4. **User completes payment**
   - Enters payment details in Razorpay modal
   - Razorpay processes payment and returns confirmation

5. **Frontend verifies payment**
   - Calls `/api/user/verify-payment` with payment details
   - Verifies Razorpay signature for security
   - Backend confirms appointment

6. **Appointment confirmed**
   - Shows success message
   - Redirects to "My Appointments"
   - Appointment status shows as 'booked'

## Payment Calculation

For a doctor with consultation fee of ₹500:
- **Full fee**: ₹500
- **Advance payment (25%)**: ₹125
- **Remaining balance**: ₹375 (payable on day of appointment)

## API Endpoints

### Create Payment Order
- **Endpoint**: `POST /api/user/create-payment-order`
- **Auth**: Required (Bearer token)
- **Body**: `{ appointmentId }`
- **Response**: `{ success: true, order: { id, amount, currency } }`

### Verify Payment
- **Endpoint**: `POST /api/user/verify-payment`
- **Auth**: Required (Bearer token)
- **Body**: 
  ```json
  {
    "appointmentId": "...",
    "razorpayPaymentId": "...",
    "razorpayOrderId": "...",
    "razorpaySignature": "..."
  }
  ```
- **Response**: `{ success: true, appointment: {...} }`

## Error Handling

### Payment Failures
- User sees toast notification with error message
- Appointment remains in 'pending' state
- User can retry payment
- Appointment is not confirmed until payment succeeds

### Invalid Signature
- Backend validates Razorpay signature for security
- Returns 400 error if signature doesn't match
- Prevents unauthorized payment confirmation

## Testing with Razorpay

### Test Card Details
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits

### Test OTP
- For most test transactions: 123456

## Security Considerations

1. **Signature Verification**: Every payment is verified using Razorpay's HMAC signature
2. **Token Authentication**: All payment endpoints require JWT token
3. **Amount Validation**: Backend validates payment amount matches appointment
4. **HTTPS**: Ensure production uses HTTPS for secure payment transmission

## Future Enhancements

1. **Remaining Payment**: Add endpoint for remaining 75% payment at appointment confirmation
2. **Refunds**: Implement refund logic for cancelled appointments
3. **Payment History**: Add payment transaction history to user profile
4. **Multiple Payment Methods**: Add support for UPI, Net Banking, wallet
5. **Automated Reminders**: Send payment reminder notifications before appointment

## Troubleshooting

### Razorpay Modal Not Opening
- Check if Razorpay script is loaded: `window.Razorpay` should exist
- Verify API keys are correct in frontend `.env`
- Check browser console for errors

### Payment Verification Failed
- Ensure `RAZORPAY_KEY_SECRET` is correct in backend `.env`
- Check that appointment ID matches
- Verify payment was actually processed in Razorpay dashboard

### Appointment Not Appearing After Payment
- Check MongoDB connection
- Verify appointment update succeeded
- Check backend logs for errors

## Contact & Support

For Razorpay integration issues:
- Visit: https://razorpay.com/docs/
- Support: support@razorpay.com
