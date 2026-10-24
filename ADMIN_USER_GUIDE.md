# 📖 Mzingo Point – Owner & Staff Admin User Guide

**Mzingo Point Storage Ltd**  
*Moi Avenue, Opposite Mombasa Tusks, Mombasa, Kenya*  
*Contact / WhatsApp:* +254 712 345 678 | *Email:* info@mzingopoint.co.ke  
*Operating Hours:* 6:30 AM to 8:30 PM Daily (Monday – Sunday)

---

## 1. System Overview

**Mzingo Point** is a secure luggage and belongings storage service operating in Mombasa CBD. The system consists of:
1. **A Mobile-First Public Portal:** Customers can view prices in Kenya Shillings (KES), calculate storage fees, book online with M-Pesa STK push or counter drop-off, track their luggage live, toggle between English and Swahili, and open direct WhatsApp inquiries.
2. **An Owner & Staff Management Dashboard:** Counter attendants and business owners manage luggage intake, assign shelf/bin racks, issue QR-coded receipts and tear-off baggage tags, record cash/M-Pesa payments, capture digital collection signatures, monitor overdue items, and reconcile daily revenue.

---

## 2. Staff & Owner Login Credentials

Access the management desk by visiting:  
**`http://localhost:5000/`** and clicking **Staff / Owner Login** in the navigation bar.

### Default System Accounts:

| Role | Email / Phone | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Business Owner (Admin)** | `owner@mzingopoint.co.ke` | `admin123` | Full access: Daily/weekly/monthly revenue, financial reports, pricing configuration, capacity limits, adding/disabling staff accounts. |
| **Desk Attendant (Staff)** | `attendant@mzingopoint.co.ke` | `staff123` | Counter operations: Walk-in check-in, shelf assignment, luggage tag printing, payment receipt logging, collection signature verification. *Cannot alter pricing or view financial turnover.* |

> [!TIP]
> On the login page, you can use the **⚡ Quick Demo Accounts** buttons for instant one-click switching between Owner and Staff roles during testing.

---

## 3. Daily Counter Operations Walkthrough

### Step A: Receiving a Walk-in Customer (Intake)
1. In the top bar of the dashboard, click **`+ New Walk-In Booking`**.
2. Enter the customer's:
   - **Full Name** (e.g. *Kiprono Cheruiyot*)
   - **Mobile Phone Number** (e.g. *0719 234 567*)
   - **National ID / Passport Number** *(Mandatory for security and collection verification)*
3. Select item size (**Small**, **Medium**, **Large**, or **Extra Large**), quantity, and expected pick-up date.
4. Assign a physical **Shelf / Bay Number** (e.g. `Shelf A-03`, `Locker S-02`, `Bay C-01`).
5. Choose payment method:
   - **Cash:** Customer pays cash at the counter.
   - **M-Pesa Counter:** Customer pays via Safaricom Till Number / Paybill and you input their M-Pesa receipt code.
6. Click **`Register Walk-In & Print Tag`**.

### Step B: Printing Luggage Tags & Receipts
- The system immediately displays the **Print Preview**.
- Click **`Print Now`** (or press `Ctrl+P`).
- **Receipt Section (Top):** Hand to the customer. Contains the booking reference, QR code, fees paid, and collection instructions.
- **Tear-off Baggage Tag (Bottom):** Tear along the dotted line and staple or tie around the luggage handle. Shows the shelf location and QR code for scanning upon return.

### Step C: Processing Luggage Collection (Checkout & Release)
1. When the customer returns, ask for their **Booking Reference** (e.g. `MZP-2026-0001`) or scan their digital QR code from their phone.
2. In the Bookings table, click on the booking row or the **Eye icon** (`👁`).
3. Verify the customer's **Original National ID / Passport** against the recorded ID number on screen.
4. Check if there is an outstanding balance:
   - If balance > 0, click **`Record Payment`** to log the remaining KES before release.
5. Click **`✓ Mark Collected`**:
   - Confirm the Collector's Name and National ID.
   - Have the customer draw their signature on the **HTML5 Digital Signature Pad**.
   - Click **`Release Belongings`**.
6. The booking is marked as **Collected** with a timestamped audit trail.

---

## 4. Online Bookings & M-Pesa STK Push

1. When a customer books on the website, they receive a reference like `MZP-2026-XXXX`.
2. If they selected **Pay with M-Pesa STK Push**, an instant prompt appears on their Safaricom line requesting their M-Pesa PIN.
3. The booking automatically appears on the dashboard with status **Booked** (if pending dropoff) or **In Storage** (once dropped off).
4. When the customer arrives at Moi Avenue to drop off their items, open their booking, assign their shelf number (e.g. `Shelf B-04`), and click **`In Storage`**.

---

## 5. Overdue Items & Late Fee Management

- If an item is not collected by the **Expected Pick-up Date**, the system automatically flags it as **`OVERDUE`**.
- A late fee of **KES 100 per day** is automatically calculated and added to the customer's outstanding balance.
- **Sending Instant WhatsApp Alerts:**
  - In the **Alerts & Overdue** section, click **`WhatsApp Notice`**.
  - A pre-formatted polite notice opens in WhatsApp with the customer's name, reference number, and outstanding balance ready to send with one click.

---

## 6. Unclaimed Belongings & Kenyan Legal Compliance

Under the **Kenya Disposal of Uncollected Goods Act (Cap. 38)**:
- Any goods remaining in storage for more than **30 days** without customer communication are flagged under **Statutory Disposal Notices**.
- The dashboard highlights these items in the **Alerts** tab.
- Click **`Send Disposal Notice`** to issue a registered 14-day formal reminder prior to initiating statutory disposal or public auction to recover storage expenses.

---

## 7. Daily Reconciliation (Cash & M-Pesa Audit)

At the close of business (8:30 PM):
1. Navigate to the **Payments & M-Pesa** section.
2. Click **`Daily Reconciliation`**.
3. The dashboard aggregates:
   - **Total Physical Cash in Drawer:** Count physical banknotes against this figure.
   - **Total M-Pesa Collections:** Reconcile against your Safaricom Daraja Till / Paybill balance.
   - **Total Daily Revenue:** Combined turnover for the day.

---

## 8. Owner Settings (Configuring Rates & Staff)

*Restricted to accounts with Owner privileges:*
1. Navigate to **Settings & Rates**.
2. **Price Editor:** Update daily, weekly, or monthly charges for Small, Medium, Large, and Extra Large items. New rates apply immediately across the public website and price calculator.
3. **Late Fees:** Modify the standard overdue rate per day (default: KES 100).
4. **Online Bookings Toggle:** When storage racks reach 100% capacity, toggle **Online Bookings PAUSED** to prevent new drop-offs until space clears.
5. **Staff Management:** Click **`Add Staff Member`** to create logins for new attendants with limited view permissions.

---

## 9. Kenya Data Protection Act (ODPC) Standards

- Customer National ID numbers and phone numbers are encrypted in the local SQLite database (`server/mzingo.db`).
- Staff must only use customer phone numbers for legitimate storage-related communications (booking confirmations, pickup reminders, receipts).
- Never share the physical collection registry or digital customer phone list with third parties.

---

*For technical maintenance or database backups, copy the file `server/mzingo.db` to a secure external backup location weekly.*
