# SellerSmart MongoDB Database Schema

## Overview
This document describes the MongoDB collections and schemas used across SellerSmart services.

## Database Structure

### Shared Database: sellersmart_main
Collections used by multiple services:
- users
- authentication
- permissions

### Service Databases
Each service maintains its own database:
- sellersmart_brandscan
- sellersmart_invorders
- sellersmart_rivalradar
- sellersmart_wholesale
- sellersmart_monitor

## Collection Schemas

### users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  company: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Note
Detailed schemas will be documented after MongoDB Atlas tool analysis.
