# Feature Spec: Change Password/Email (Logged In)

## Overview
A unified multi-step security flow for logged-in users to update their email address or password. Both actions share the same verification logic using a 6-digit code sent via email.

---

## Implementation Status & TODO List

### Frontend Tasks (Vue 3 / TypeScript)
- [x] **API Integration**
    - [x] Define endpoints in `src/lib/api.ts`.
    - [x] Add service methods in `src/features/auth/AuthServices.ts`.
- [x] **Logic & State Management**
    - [x] Create `useSecurityActionModal.ts` composable.
    - [x] Implement 6-digit code validation logic.
    - [x] Implement resend cooldown (rate limiting).
    - [x] Handle automatic logout after successful update.
- [x] **UI Components**
    - [x] Create `SecurityActionModal.vue` container.
    - [x] Implement `RequestCodeView.vue`.
    - [x] Implement `VerifyCodeView.vue`.
    - [x] Implement `UpdateFieldView.vue` (handles both email and password inputs).
    - [x] Implement `SecuritySuccessView.vue`.
- [x] **Settings Integration**
    - [x] Integrate "Change Email" button in Profile section of `SettingsView.vue`.
    - [x] Update "Change Password" button in Security section of `SettingsView.vue`.

### Backend Tasks (API Endpoints)
- [ ] **Endpoint 1: Request Security Code** (`POST /auth/request-code`)
    - [ ] Receive `type` ('password' | 'email').
    - [ ] Generate 6-digit `SecurityToken`.
    - [ ] Set `SecurityTokenExpireTime` (10 minutes).
    - [ ] Send email with the code.
- [ ] **Endpoint 2: Verify Security Code** (`POST /auth/verify-code`)
    - [ ] Receive `type` and `code`.
    - [ ] Validate `code` against stored token.
    - [ ] Check if token is expired.
    - [ ] Return `valid: true` or error message.
- [ ] **Endpoint 3: Update Security Field** (`POST /auth/update-field`)
    - [ ] Receive `type`, `value` (new password/email), and `code`.
    - [ ] Final verification of the `code`.
    - [ ] **If Password:**
        - [ ] Verify new password is not the same as current.
        - [ ] Hash and save new password.
    - [ ] **If Email:**
        - [ ] Update user's email address.
    - [ ] Invalidate the session (force logout).

---

## Technical Details & Requirements

### 1. Code Request (`backend1` & `backend1.1`)
- **Trigger:** Click "Send Code" or "Resend Code".
- **Action:** Set `ResetPasswordToken/Email` and `ResetPasswordTokenExpireTime/Email` (10 mins).
- **Email:** Send the generated code to the user's current email.

### 2. Verification (`backend2`)
- **Input:** 6-digit numeric code.
- **Validation:** Check if code matches and is not expired.
- **Error Handling:** Return `'invalid or expired token, request new token'` on failure.

### 3. Final Update (`backend3`)
- **Validation:** 
    - New password must meet complexity requirements.
    - New password must not match the current password.
- **Success Actions:**
    - Update the database record.
    - Terminate current session (log user out).
    - Backend should return error `'cannot use past password'` if applicable.
