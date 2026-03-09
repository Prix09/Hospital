# MediSync — Modern Healthcare Platform 🏥

MediSync is a comprehensive Hospital Management System designed to connect patients and doctors seamlessly. It features real-time video consultations, smart auto-prescription generation, and secure medical record management.

## ✨ Key Features

- **🎥 Video Consultation**: High-performance, peer-to-peer video calls using WebRTC.
- **📄 Smart Auto-Prescription**: Automatically generates prescriptions based on appointment reasons (Fever, Cold, Cough, etc.).
- **📅 Easy Booking**: Streamlined appointment scheduling with diverse doctor specializations.
- **📁 Medical Records**: Secure storage and access for patient health documents and prescriptions.
- **👤 Role-Based Access**: Dedicated dashboards for Patients and Doctors.
- **🎨 Modern UI**: Responsive design built with React, featuring a clean and professional aesthetic.

## 🛠️ Technology Stack

### Backend
- **Java 17** & **Spring Boot 3**
- **Spring Security** (JWT Authentication)
- **Hibernate / JPA**
- **PostgreSQL** Database
- **WebRTC** Signaling (WebSocket)

### Frontend
- **React.js**
- **Vanilla CSS** (Custom Design System)
- **WebRTC** (BroadcastChannel Signaling)

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL

### Installation & Setup

1. **Database Setup**:
   - Create a database named `hospital` in PostgreSQL.
   - Update `hospital-backend/src/main/resources/application.properties` with your credentials.

2. **Run Backend**:
   ```bash
   cd hospital-backend
   mvn spring-boot:run
   ```

3. **Run Frontend**:
   ```bash
   cd hospital-frontend-final
   npm install
   npm start
   ```

## 👨‍⚕️ Sample Credentials

| Role | Username | Password |
|---|---|---|
| **Doctor** | `DrSmith` | `doctor123` |
| **Patient** | `Priya` | `patient123` |

---
*Developed with focus on accessibility and modern healthcare standards.*
