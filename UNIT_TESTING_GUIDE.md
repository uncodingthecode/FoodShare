# FoodShare - Unit Testing Guide
**Software Engineering Lab Experiment**  
**Date:** November 7, 2025

---

## System Overview
**Project:** Food Sharing & Surplus Management System  
**Architecture:** Full-stack MERN (MongoDB, Express, React, Node.js)  
**Frontend:** Next.js 16.0, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express.js 4.18, MongoDB 8.2.1  
**Authentication:** JWT-based authentication with role-based access control

---

## Test Users (Pre-seeded in Database)

### 1. Admin User
- **Email:** admin@foodshare.com
- **Password:** admin123
- **Role:** Administrator
- **Access:** Full system access, user management, statistics

### 2. Donor User
- **Email:** john@example.com
- **Password:** donor123
- **Role:** Food Donor
- **Access:** Create, edit, delete donations

### 3. NGO User
- **Email:** ngo1@example.com
- **Password:** ngo123
- **Role:** NGO Organization
- **Access:** View and claim available donations

### 4. Volunteer User
- **Email:** volunteer1@example.com
- **Password:** volunteer123
- **Role:** Volunteer
- **Access:** Accept and manage pickup requests

---

## Functional Modules & Test Cases

### Module 1: Authentication System

#### Test Case 1.1: User Login
**Objective:** Verify user can login with valid credentials  
**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter email: john@example.com
3. Enter password: donor123
4. Click "Sign In" button

**Expected Result:**
- ✅ User redirected to donor dashboard
- ✅ JWT token stored in localStorage
- ✅ User name displayed in header
- ✅ Logout button visible

**Actual Result:** _[To be filled during testing]_

#### Test Case 1.2: Invalid Login
**Objective:** Verify error handling for invalid credentials  
**Steps:**
1. Navigate to login page
2. Enter email: wrong@email.com
3. Enter password: wrongpass
4. Click "Sign In"

**Expected Result:**
- ✅ Error message displayed
- ✅ User remains on login page
- ✅ No token stored

**Actual Result:** _[To be filled during testing]_

#### Test Case 1.3: Logout Functionality
**Objective:** Verify user can logout successfully  
**Steps:**
1. Login as any user
2. Click "Logout" button in header
3. Verify redirect to home page

**Expected Result:**
- ✅ User redirected to home page
- ✅ Auth token removed from localStorage
- ✅ Cannot access dashboard directly

**Actual Result:** _[To be filled during testing]_

---

### Module 2: Donor Operations (CRUD)

#### Test Case 2.1: Create Donation
**Objective:** Verify donor can create new food donation  
**Pre-condition:** Login as donor (john@example.com)  

**Steps:**
1. Click "Add New Donation" button
2. Fill form:
   - Food Type: "Cooked Rice"
   - Quantity: 20
   - Unit: "kg"
   - Expiry Time: Select future date/time
   - Address: "123 Test Street, Mumbai"
   - Description: "Freshly cooked rice"
3. Click "Add Donation"

**Expected Result:**
- ✅ Success message displayed
- ✅ Donation appears in "My Donations" list
- ✅ Status shows "Available"
- ✅ Total donations count increased by 1

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `POST /api/donations`  
**Status Code:** 201 Created

#### Test Case 2.2: Read/View Donations
**Objective:** Verify donor can view all their donations  
**Pre-condition:** Login as donor with existing donations

**Steps:**
1. Navigate to donor dashboard
2. Observe donations list

**Expected Result:**
- ✅ All donor's donations displayed
- ✅ Shows food type, quantity, expiry time
- ✅ Shows status (Available/Claimed)
- ✅ Shows location address

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/donations/my-donations`  
**Status Code:** 200 OK

#### Test Case 2.3: Update/Edit Donation
**Objective:** Verify donor can edit available donations  
**Pre-condition:** Have at least one available donation

**Steps:**
1. Find an available donation (status: Available)
2. Click "Edit" button
3. Modify fields:
   - Change quantity to 25
   - Update description
4. Click "Update Donation"

**Expected Result:**
- ✅ Success message displayed
- ✅ Donation updated in list
- ✅ New values reflected immediately
- ✅ Cannot edit claimed donations

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `PUT /api/donations/:id`  
**Status Code:** 200 OK

#### Test Case 2.4: Delete Donation
**Objective:** Verify donor can delete available donations  
**Pre-condition:** Have at least one available donation

**Steps:**
1. Find an available donation
2. Click "Delete" button
3. Confirm deletion in prompt

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Donation removed from list
- ✅ Success message displayed
- ✅ Cannot delete claimed donations
- ✅ Total count decreased

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `DELETE /api/donations/:id`  
**Status Code:** 200 OK

---

### Module 3: NGO Operations

#### Test Case 3.1: View Available Donations
**Objective:** Verify NGO can view all available donations  
**Pre-condition:** Login as NGO (ngo1@example.com)

**Steps:**
1. Navigate to NGO dashboard
2. View "Available Donations" tab

**Expected Result:**
- ✅ List of all available donations shown
- ✅ Shows donor name/organization
- ✅ Shows expiry time countdown
- ✅ "Claim Donation" button visible

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/donations/available`  
**Status Code:** 200 OK

#### Test Case 3.2: Claim Donation
**Objective:** Verify NGO can claim available donation  
**Pre-condition:** At least one donation available

**Steps:**
1. In "Available Donations" tab
2. Find a donation
3. Click "Claim Donation" button
4. Wait for confirmation

**Expected Result:**
- ✅ Success message displayed
- ✅ Donation removed from available list
- ✅ Donation appears in "My Claims" tab
- ✅ Pickup request created for volunteers

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `POST /api/claims/claim/:donationId`  
**Status Code:** 201 Created

#### Test Case 3.3: View My Claims
**Objective:** Verify NGO can view their claimed donations  
**Pre-condition:** NGO has claimed at least one donation

**Steps:**
1. Click "My Claims" tab
2. Observe claimed donations list

**Expected Result:**
- ✅ All NGO's claims displayed
- ✅ Shows claim date
- ✅ Shows donation details
- ✅ Shows status (Pending/Completed)

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/claims/my-claims`  
**Status Code:** 200 OK

#### Test Case 3.4: Mark Claim as Complete
**Objective:** Verify NGO can mark claim as completed  
**Pre-condition:** Have at least one pending claim

**Steps:**
1. In "My Claims" tab
2. Find a pending claim
3. Click "Mark as Completed" button
4. Confirm action

**Expected Result:**
- ✅ Status updated to "Completed"
- ✅ Success message displayed
- ✅ Green checkmark shown
- ✅ Button disabled after completion

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `PUT /api/claims/:id/status`  
**Status Code:** 200 OK

---

### Module 4: Volunteer Operations

#### Test Case 4.1: View Available Pickups
**Objective:** Verify volunteer can view pickup requests  
**Pre-condition:** Login as volunteer (volunteer1@example.com)

**Steps:**
1. Navigate to volunteer dashboard
2. View available pickup requests

**Expected Result:**
- ✅ List of pickup requests displayed
- ✅ Shows donation details
- ✅ Shows pickup address
- ✅ Shows status (Pending/Accepted/In Transit)

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/pickups/available`  
**Status Code:** 200 OK

#### Test Case 4.2: Accept Pickup Request
**Objective:** Verify volunteer can accept pickup  
**Pre-condition:** At least one pending pickup available

**Steps:**
1. Find a pickup with status "Pending"
2. Click "Accept Pickup" button
3. Confirm acceptance

**Expected Result:**
- ✅ Status changed to "Accepted"
- ✅ Success message displayed
- ✅ "Start Transit" button appears
- ✅ Pickup assigned to volunteer

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `POST /api/pickups/:id/accept`  
**Status Code:** 200 OK

#### Test Case 4.3: Update Pickup Status to In Transit
**Objective:** Verify volunteer can start transit  
**Pre-condition:** Volunteer has accepted a pickup

**Steps:**
1. Find accepted pickup
2. Click "Start Transit" button
3. Confirm action

**Expected Result:**
- ✅ Status updated to "In Transit"
- ✅ Purple status badge shown
- ✅ "Mark as Completed" button appears

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `PUT /api/pickups/:id/status`  
**Body:** `{ "status": "in_transit" }`  
**Status Code:** 200 OK

#### Test Case 4.4: Complete Pickup
**Objective:** Verify volunteer can complete delivery  
**Pre-condition:** Pickup status is "In Transit"

**Steps:**
1. Find in-transit pickup
2. Click "Mark as Completed" button
3. Confirm completion

**Expected Result:**
- ✅ Status updated to "Completed"
- ✅ Green completed badge shown
- ✅ No more action buttons
- ✅ Statistics updated

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `PUT /api/pickups/:id/status`  
**Body:** `{ "status": "completed" }`  
**Status Code:** 200 OK

---

### Module 5: Admin Operations

#### Test Case 5.1: View System Statistics
**Objective:** Verify admin can view dashboard statistics  
**Pre-condition:** Login as admin (admin@foodshare.com)

**Steps:**
1. Navigate to admin dashboard
2. View statistics cards

**Expected Result:**
- ✅ Total Users count displayed
- ✅ Total Donors count shown
- ✅ Total NGOs count shown
- ✅ Total Volunteers count shown
- ✅ Total Donations count shown
- ✅ Available/Claimed breakdown shown

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/admin/stats`  
**Status Code:** 200 OK

#### Test Case 5.2: View All Users
**Objective:** Verify admin can view registered users  
**Pre-condition:** Login as admin

**Steps:**
1. Scroll to "Registered Users" table
2. Observe user list

**Expected Result:**
- ✅ Table shows all users
- ✅ Name, Email, Role displayed
- ✅ Organization shown (for NGO)
- ✅ Join date displayed
- ✅ Role badges colored correctly
  - Orange: Donor
  - Red: NGO
  - Yellow: Volunteer

**Actual Result:** _[To be filled during testing]_

**API Endpoint:** `GET /api/admin/users`  
**Status Code:** 200 OK

---

## Integration Test Scenarios

### Scenario 1: Complete Donation Lifecycle
**Objective:** Test full workflow from donation to delivery

**Steps:**
1. **Donor:** Login and create new donation
2. **NGO:** Login and claim the donation
3. **Volunteer:** Login and accept pickup request
4. **Volunteer:** Start transit
5. **Volunteer:** Complete delivery
6. **NGO:** Mark claim as completed
7. **Admin:** Verify statistics updated

**Expected Result:**
- ✅ Each step completes successfully
- ✅ Status updates reflected in all dashboards
- ✅ No data inconsistencies
- ✅ All notifications sent (if implemented)

**Actual Result:** _[To be filled during testing]_

### Scenario 2: Concurrent Claim Attempts
**Objective:** Test race condition handling

**Steps:**
1. Create one donation as donor
2. Open two NGO browser sessions
3. Both try to claim same donation simultaneously

**Expected Result:**
- ✅ Only one claim succeeds
- ✅ Second attempt shows error
- ✅ No duplicate claims created

**Actual Result:** _[To be filled during testing]_

---

## Validation & Boundary Tests

### Test Case V1: Form Validation
**Module:** Donation Creation  
**Objective:** Verify input validation

**Test Data:**
- Quantity: -5 (negative)
- Quantity: 0 (zero)
- Quantity: "abc" (non-numeric)
- Expiry Time: Past date
- Address: Empty string

**Expected Result:**
- ✅ Negative values rejected
- ✅ Zero values rejected
- ✅ Non-numeric inputs rejected
- ✅ Past dates rejected
- ✅ Required field validation works

**Actual Result:** _[To be filled during testing]_

### Test Case V2: Authorization Tests
**Objective:** Verify role-based access control

**Tests:**
1. Donor trying to access NGO dashboard
2. NGO trying to access Admin dashboard
3. Volunteer trying to delete donations
4. Unauthenticated user accessing protected routes

**Expected Result:**
- ✅ Unauthorized access redirected to login
- ✅ 403 Forbidden responses for wrong roles
- ✅ Token expiry handled gracefully

**Actual Result:** _[To be filled during testing]_

---

## Performance Tests

### Test Case P1: Load Time
**Objective:** Measure dashboard load time

**Steps:**
1. Login as donor
2. Measure time to fully load dashboard
3. Repeat for 10 iterations

**Expected Result:**
- ✅ Average load time < 2 seconds
- ✅ No console errors

**Actual Result:** _[To be filled during testing]_

### Test Case P2: Large Data Sets
**Objective:** Test with many donations

**Pre-condition:** Create 100+ donations

**Steps:**
1. Load donor dashboard
2. Scroll through all donations
3. Search/filter donations

**Expected Result:**
- ✅ UI remains responsive
- ✅ No lag or freezing
- ✅ Pagination works (if implemented)

**Actual Result:** _[To be filled during testing]_

---

## API Testing with Postman

### Collection Setup
1. Import: `FoodShare_API.postman_collection.json`
2. Set environment variable: `baseUrl = http://localhost:5001/api`
3. Set auth token after login

### Test Endpoints

#### Authentication
```
POST {{baseUrl}}/auth/login
Body: {
  "email": "john@example.com",
  "password": "donor123"
}
Expected: 200 OK, returns token
```

#### Donations CRUD
```
GET {{baseUrl}}/donations/my-donations
Headers: Authorization: Bearer <token>
Expected: 200 OK, array of donations

POST {{baseUrl}}/donations
Body: { donation details }
Expected: 201 Created

PUT {{baseUrl}}/donations/:id
Body: { updated fields }
Expected: 200 OK

DELETE {{baseUrl}}/donations/:id
Expected: 200 OK
```

---

## Test Results Summary Template

| Test ID | Module | Test Case | Status | Comments |
|---------|--------|-----------|--------|----------|
| 1.1 | Auth | User Login | ⬜ | |
| 1.2 | Auth | Invalid Login | ⬜ | |
| 1.3 | Auth | Logout | ⬜ | |
| 2.1 | Donor | Create Donation | ⬜ | |
| 2.2 | Donor | View Donations | ⬜ | |
| 2.3 | Donor | Edit Donation | ⬜ | |
| 2.4 | Donor | Delete Donation | ⬜ | |
| 3.1 | NGO | View Available | ⬜ | |
| 3.2 | NGO | Claim Donation | ⬜ | |
| 3.3 | NGO | View Claims | ⬜ | |
| 3.4 | NGO | Mark Complete | ⬜ | |
| 4.1 | Volunteer | View Pickups | ⬜ | |
| 4.2 | Volunteer | Accept Pickup | ⬜ | |
| 4.3 | Volunteer | Start Transit | ⬜ | |
| 4.4 | Volunteer | Complete Delivery | ⬜ | |
| 5.1 | Admin | View Stats | ⬜ | |
| 5.2 | Admin | View Users | ⬜ | |

**Legend:** ⬜ Not Tested | ✅ Pass | ❌ Fail | ⚠️ Partial

---

## Bug Report Template

**Bug ID:** BUG-001  
**Module:** [Module Name]  
**Severity:** Critical / Major / Minor  
**Description:** [Detailed description]  
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]  
**Actual Result:** [What actually happened]  
**Screenshots:** [If applicable]  
**Environment:**
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Date: [Date of testing]

---

## Conclusion & Sign-off

**Tester Name:** _________________  
**Date:** _________________  
**Overall Result:** Pass / Fail / Partial  

**Total Tests Executed:** ___  
**Tests Passed:** ___  
**Tests Failed:** ___  
**Pass Rate:** ____%  

**Critical Issues Found:** ___  
**Recommendations:** [Your observations and suggestions]

---

**Document End**
