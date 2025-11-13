# 🚀 Quick Reference - Button Testing Guide

## Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Access: http://localhost:3000

---

## 👤 Test Users

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@foodshare.com | admin123 |
| **Donor** | john@example.com | donor123 |
| **NGO** | ngo1@example.com | ngo123 |
| **Volunteer** | volunteer1@example.com | volunteer123 |

---

## 🔵 DONOR Buttons to Test

### Dashboard: http://localhost:3000/donor/dashboard

| Button | Action | Test |
|--------|--------|------|
| **Add New Donation** | Opens form | Fill and submit |
| **Edit** (blue) | Edit donation | Modify and save |
| **Delete** (red) | Delete donation | Confirm deletion |

**CRUD Test Flow:**
1. Click "Add New Donation" → Create
2. View in list → Read
3. Click "Edit" → Update
4. Click "Delete" → Delete

---

## 🔴 NGO Buttons to Test

### Dashboard: http://localhost:3000/ngo/dashboard

**Available Donations Tab:**
| Button | Action |
|--------|--------|
| **Claim Donation** | Claim for NGO |

**My Claims Tab:**
| Button | Action |
|--------|--------|
| **Mark as Completed** | Complete claim |

**Test Flow:**
1. Go to "Available Donations"
2. Click "Claim Donation"
3. Go to "My Claims"
4. Click "Mark as Completed"

---

## 🟡 VOLUNTEER Buttons to Test

### Dashboard: http://localhost:3000/volunteer/dashboard

| Button | Status | Action |
|--------|--------|--------|
| **Accept Pickup** | Pending | Accept request |
| **Start Transit** | Accepted | Begin delivery |
| **Mark as Completed** | In Transit | Finish delivery |

**Test Flow:**
1. Find "Pending" pickup
2. Click "Accept Pickup"
3. Click "Start Transit"
4. Click "Mark as Completed"

---

## 🟠 ADMIN Dashboard

### Dashboard: http://localhost:3000/admin/dashboard

**Auto-loads:**
- Statistics cards
- User table with colored badges

**No buttons - View only**

---

## ✅ Complete Workflow Test (All Roles)

### Step-by-Step Integration Test:

```
1. DONOR Login (john@example.com / donor123)
   → Click "Add New Donation"
   → Fill form and submit
   → Logout

2. NGO Login (ngo1@example.com / ngo123)
   → Go to "Available Donations"
   → Click "Claim Donation" on the donation you created
   → Logout

3. VOLUNTEER Login (volunteer1@example.com / volunteer123)
   → Find the pickup request
   → Click "Accept Pickup"
   → Click "Start Transit"
   → Click "Mark as Completed"
   → Logout

4. NGO Login again
   → Go to "My Claims"
   → Click "Mark as Completed"
   → Logout

5. ADMIN Login (admin@foodshare.com / admin123)
   → Verify statistics updated
   → Check user table
```

---

## 🧪 What to Test for Each Button

### For ALL Buttons:
- ✅ Click works
- ✅ Shows loading state
- ✅ Success message appears
- ✅ Data updates in list
- ✅ Page refreshes data
- ✅ Error handling works

### For Forms:
- ✅ Validation works
- ✅ Required fields checked
- ✅ Submit button works
- ✅ Cancel button works

---

## 📊 Quick Test Checklist

**Donor (4 operations):**
- [ ] Create donation
- [ ] View donations
- [ ] Edit donation
- [ ] Delete donation

**NGO (2 operations):**
- [ ] Claim donation
- [ ] Mark claim complete

**Volunteer (3 operations):**
- [ ] Accept pickup
- [ ] Start transit
- [ ] Complete delivery

**Admin (2 views):**
- [ ] View statistics
- [ ] View users

**Auth (2 operations):**
- [ ] Login
- [ ] Logout

**Total: 13 Core Functions**

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property..."
**Solution:** Refresh page or re-login

### Issue: Button not working
**Solution:** Check browser console for errors

### Issue: Data not loading
**Solution:** Verify backend is running on port 5001

### Issue: Unauthorized error
**Solution:** Logout and login again

---

## 📸 Expected Results

### After Creating Donation:
- Alert: "Donation added successfully!"
- Appears in "My Donations" list
- Status badge: Green "Available"

### After Claiming:
- Alert: "Donation claimed successfully!"
- Removed from Available
- Appears in My Claims

### After Accepting Pickup:
- Alert: "Pickup accepted successfully!"
- Status: Blue "Accepted"
- Shows "Start Transit" button

### After Completing:
- Alert: "Pickup status updated!"
- Status: Green "Completed"
- Shows green checkmark

---

## 💡 Testing Tips

1. **Test in Order:** Donor → NGO → Volunteer → Admin
2. **Use Different Browsers** for simultaneous logins
3. **Check Console** for errors (F12)
4. **Take Screenshots** of results
5. **Note Down** any bugs in format:
   ```
   Button: [Button Name]
   Expected: [What should happen]
   Actual: [What happened]
   ```

---

## 📝 Record Your Results

Use this format:

```
Test: Create Donation
Date: _______
Result: ✅ Pass / ❌ Fail
Notes: _________________
```

---

**Happy Testing! 🎉**

All features are implemented and ready for your unit testing experiment.
