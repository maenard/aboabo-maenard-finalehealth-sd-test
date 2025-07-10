# Patient and Visit Management System

This is a full-stack application built with:

- **Frontend:** Angular (Standalone API)
- **Backend:** NestJS (with Mongoose for MongoDB)

---

## 🛠️ Prerequisites

Make sure you have the following installed globally:

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli)  
  ```bash
  npm install -g @angular/cli
  ```
- [NestJS CLI](https://docs.nestjs.com/cli/overview)  
  ```bash
  npm install -g @nestjs/cli
  ```
- [MongoDB](https://www.mongodb.com/try/download/community) (or MongoDB Atlas)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aboabo-maenard-finalehealth-sd-test.git
cd aboabo-maenard-finalehealth-sd-test
```

### 2. Install Dependencies

#### Backend (NestJS)
```bash
cd backend
npm install
```

#### Frontend (Angular)
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the **root folder** based on the `.env.example` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/patient-visit
FRONTEND_URL=http://localhost:4200
```

These environment variables are used for:
- Connecting to MongoDB
- Enabling CORS for the frontend

---

## 🚀 Running the Application

### 1. Run the Backend Server

```bash
cd backend
nest start --watch
```

Server will be running at: `http://localhost:3000`

### 2. Run the Frontend App

```bash
cd ../frontend
npm start
```

App will be available at: `http://localhost:4200`

> The Angular app should be configured to call the API at `http://localhost:3000`. If not, update the environment file in `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

---

## 📁 Project Structure

```
frontend/    → Angular 17 app
backend/     → NestJS app
```

---

## 🧪 API Test

You can test the backend endpoint:

```
GET http://localhost:3000/stats
```

Should return:

```json
{
  "totalPatients": 12,
  "totalVisitsToday": 3,
  "totalVisits": 45
}
```

---

## 🧩 Technologies Used

- Angular 17+
- Bootstrap 5
- NestJS
- Mongoose & MongoDB
- RxJS & HttpClient
