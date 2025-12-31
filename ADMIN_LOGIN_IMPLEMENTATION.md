# Admin Login Implementation

## Overview

A separate admin login/registration system has been implemented for the admin panel, accessible at `/admin/login`. This is completely separate from the end-user login system.

## Features

### 1. Admin Login Page
**Location:** `/admin/login`
**File:** `src/modules/admin/pages/AdminLogin.tsx`

**Features:**
- Separate admin login form (not shared with end-users)
- Login and Registration modes (toggleable)
- OTP-based authentication (same as end-users)
- Role validation - Only users with ADMIN or SUPER_ADMIN roles can access
- Automatic redirect to admin dashboard after successful login
- Form validation for email and OTP
- Clear error messages

**UI Elements:**
- Professional admin-themed design
- Email input field
- OTP verification code input
- Toggle between Login and Register modes
- Error messages display
- Loading states

### 2. Protected Admin Routes
**File:** `src/modules/admin/components/AdminLayout.tsx`

**Protection Features:**
- Authentication check on mount
- Role validation (ADMIN or SUPER_ADMIN required)
- Automatic redirect to `/admin/login` if not authenticated
- Redirect back to requested page after login
- Logout functionality in sidebar

### 3. Route Configuration
**File:** `src/App.tsx`

**Routes:**
- `/admin/login` - Admin login/registration page (public)
- `/admin/*` - All other admin routes (protected, require authentication)

### 4. Backend Updates

**AuthResponse includes role:**
- Updated `AuthResponse.UserDto` to include `role` field
- Role is now returned in all authentication responses
- Enables frontend to validate admin access

## Usage

### For New Admin Users:

1. **Navigate to Admin Login:**
   - Go to `http://localhost:5173/admin/login`
   - Or navigate to `/admin` (will redirect to login if not authenticated)

2. **Register New Admin:**
   - Click "Register" tab
   - Enter your email address
   - Click "Send Verification Code"
   - Enter the 6-digit OTP code sent to your email
   - Click "Register"
   - **Important:** New users are created with `USER` role by default
   - **After registration:** You need to manually update the user's role to `ADMIN` or `SUPER_ADMIN` in the database (see below)

3. **Login as Existing Admin:**
   - Click "Login" tab (default)
   - Enter your email address (must have ADMIN or SUPER_ADMIN role)
   - Click "Send Verification Code"
   - Enter the 6-digit OTP code
   - Click "Login"
   - You'll be redirected to the admin dashboard

### Granting Admin Access to a User:

After a user registers through the admin login page, update their role in the database:

```sql
-- Update user to ADMIN role
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'user@example.com';

-- Or update to SUPER_ADMIN role
UPDATE users 
SET role = 'SUPER_ADMIN' 
WHERE email = 'user@example.com';
```

Then the user needs to:
1. Log out (if logged in)
2. Log in again at `/admin/login`
3. This generates a new JWT token with the updated role

## Authentication Flow

1. **User visits `/admin`**:
   - `AdminLayout` checks authentication
   - If not authenticated → redirect to `/admin/login`
   - If authenticated but not admin → redirect to `/admin/login` with error
   - If authenticated and admin → show admin panel

2. **User logs in at `/admin/login`**:
   - Enters email and requests OTP
   - Verifies OTP
   - Backend returns JWT token and user data (including role)
   - Frontend checks if role is ADMIN or SUPER_ADMIN
   - If not admin → show error message
   - If admin → store token and redirect to `/admin/dashboard`

3. **Subsequent Admin Requests**:
   - JWT token sent in `Authorization: Bearer <token>` header
   - Backend validates token and extracts role
   - `@PreAuthorize` annotations check role
   - Access granted or denied accordingly

## Security Features

1. **Role-Based Access Control:**
   - Only ADMIN and SUPER_ADMIN roles can access admin endpoints
   - Validated both on frontend and backend

2. **JWT Token Security:**
   - Tokens include user role
   - Backend validates tokens on every request
   - Frontend checks role before allowing access

3. **Protected Routes:**
   - All admin routes (except `/admin/login`) require authentication
   - Automatic redirect if not authenticated
   - Proper error messages for unauthorized access

## Files Created/Modified

### Frontend:
- ✅ `src/modules/admin/pages/AdminLogin.tsx` - New admin login page
- ✅ `src/modules/admin/components/AdminLayout.tsx` - Added authentication check
- ✅ `src/App.tsx` - Added admin login route
- ✅ `src/modules/auth/services/auth.service.ts` - Added `purpose` field support

### Backend:
- ✅ `src/main/java/com/tiktel/ttelgo/auth/api/dto/AuthResponse.java` - Added `role` field
- ✅ `src/main/java/com/tiktel/ttelgo/auth/application/AuthService.java` - Include role in responses

## Testing

1. **Test Admin Login:**
   - Navigate to `/admin/login`
   - Try logging in with a non-admin user → Should show access denied
   - Try logging in with an admin user → Should redirect to dashboard

2. **Test Admin Registration:**
   - Navigate to `/admin/login`
   - Switch to "Register" tab
   - Register a new user
   - Verify user is created in database with USER role
   - Update role to ADMIN in database
   - Log in again → Should work

3. **Test Protected Routes:**
   - Try accessing `/admin/dashboard` without logging in → Should redirect to login
   - Try accessing `/admin/dashboard` as non-admin → Should redirect to login with error
   - Try accessing `/admin/dashboard` as admin → Should show dashboard

## Notes

- Admin login uses the same OTP-based authentication as end-users
- Admin login is completely separate from end-user login at `/login`
- Users must have ADMIN or SUPER_ADMIN role to access admin panel
- New registrations create users with USER role by default (must be updated manually)
- JWT tokens are stored in `localStorage` as `auth_token`
- User data is stored in `localStorage` as `user` (JSON string)

