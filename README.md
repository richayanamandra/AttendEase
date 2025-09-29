# AttendEase 🎓

*Smart Attendance & Midday Meal Tracking System for Rural Schools*

---

## 🚀 Overview

**AttendEase** is a web-based attendance automation platform designed for rural schools working on a 100% serverless and scalable AWS backend. It replaces manual registers with a **face recognition-based system** and also integrates **midday meal tracking** with complaint portal, ensuring transparent and efficient school operations.

---

## ✨ Features

* 👤 Face recognition–based attendance
* 🍴 Midday meal attendance tracking
* 📊 Student dashboard with profiles
* 📱 Scan-based attendance
* 📝 Complaint registration system
* ☁️ Fully serverless AWS backend

---

## 🏗️ Architecture

<img width="2000" height="1414" alt="AttendEase Architecture" src="https://github.com/user-attachments/assets/5e657ccb-2890-42ec-9b8b-faad553fafa3" />


**Frontend:** React + Tailwind + Parcel
**Backend:** AWS (API Gateway, Lambda, DynamoDB, S3, Rekognition, SNS, Cognito)

---

## 📂 Project Structure

```
AttendEase/
├── frontend/           # React + Tailwind app
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── utils/
│   │   └── App.js
│   ├── index.html
│   ├── index.css
│   └── package.json
└── backend/            # AWS Lambda functions
    ├── auth/
    ├── attendance/
    ├── complaints/
    └── ...
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/richayanamandra/AttendEase.git
cd AttendEase/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🔑 Environment Variables

Create a `.env` file in the frontend folder:

```bash
REACT_APP_API_URL=https://your-api-gateway-url
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

⚠️ **Never commit `.env` to GitHub!**

You can provide a `.env.example` in the repo.

---

## 📜 License

This project is licensed under the **MIT License** – feel free to use and modify.

---
