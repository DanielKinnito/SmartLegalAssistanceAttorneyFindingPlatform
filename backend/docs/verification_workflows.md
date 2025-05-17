# User Verification Workflows

This document outlines the verification workflows for different user types in the Smart Legal Assistance platform.

## Client Verification

Clients can register and be in one of three verification states:

1. **Regular Client (Verified Automatically)**
   - When a client registers without requesting pro bono service
   - Email verification is still required
   - Verification status is set to 'VERIFIED' automatically

2. **Pro Bono Client (Pending Verification)**
   - When a client registers and requests pro bono service
   - Must provide supporting documentation (income proof, etc.)
   - Administrator must review and approve the pro bono request
   - Verification status starts as 'PENDING' and must be changed to 'VERIFIED' by an admin

3. **Rejected Client**
   - When an administrator rejects a pro bono request
   - Verification status is set to 'REJECTED'
   - Client can still use the platform but not as a pro bono client

### Pro Bono Request Fields

- `probono_requested`: Boolean field indicating whether the client is requesting pro bono service
- `probono_reason`: Text field for the client to explain why they need pro bono service
- `income_level`: String field for client to specify their income level
- `probono_document`: File upload field for supporting documentation

## Attorney Verification

All attorneys must go through a verification process before they can use the platform:

1. **Newly Registered Attorney (Pending Verification)**
   - When an attorney registers, they must provide:
     - Bar number
     - License document
     - Degree document
   - Verification status starts as 'PENDING'

2. **Verified Attorney**
   - Administrator verifies the attorney's credentials and documents
   - Changes verification status to 'VERIFIED'
   - Attorney can now provide services on the platform

3. **Rejected Attorney**
   - When an administrator rejects an attorney's verification
   - Verification status is set to 'REJECTED'
   - Attorney cannot provide services on the platform

### Attorney Document Fields

- `license_document`: File upload for legal license or bar membership proof
- `degree_document`: File upload for law degree or equivalent qualification

## Administrator Verification Interface

Administrators can review and manage verifications through the Django admin interface:

1. **Viewing Pending Verifications**
   - Filter users by `verification_status=PENDING`
   - Review uploaded documents and client/attorney information

2. **Approving Verifications**
   - Select users to approve
   - Use the "Approve selected users' verification" action
   - Add verification notes if needed

3. **Rejecting Verifications**
   - Select users to reject
   - Use the "Reject selected users' verification" action
   - Add verification notes explaining the rejection reason

## Email Notifications

The system sends various email notifications during the verification process:

1. **Registration Confirmation**
   - Sent to all users upon registration
   - Contains email verification link
   - Informs about verification status

2. **Verification Status Updates**
   - Sent when an administrator changes a user's verification status
   - Informs user of approval or rejection

## API Endpoints

### User Profile Endpoint

The user profile endpoint returns the user's verification status:

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "CLIENT",
  "verification_status": "PENDING",
  "email_verified": true,
  "client_profile": {
    "probono_requested": true,
    "probono_reason": "Low income, need help with legal issues",
    "income_level": "Below 30k"
  }
}
```

### Document Upload

Documents are uploaded during registration through multipart/form-data requests. Frontend should use proper file upload fields for:

- Client pro bono documents
- Attorney license and degree documents 