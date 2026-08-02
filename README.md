# 🤖 AI Employee Management System

A full-stack Employee Management System built using **Spring Boot, React, SQL Server, JWT Authentication, and AI integration**.

The application allows users to securely manage employee records and interact with employee data using an AI-powered assistant.

## ✨ Features

- 🔐 User Registration and Login
- 🔑 JWT-based Authentication
- 👥 Add, View, Update and Delete Employees
- 🔍 Search Employees
- 📊 Employee Statistics Dashboard
- 🤖 AI Employee Assistant
- 💬 Ask natural-language questions about employee data
- 🛡️ Spring Security
- 📚 REST API documentation using Swagger/OpenAPI
- 💾 SQL Server database integration
- ⚛️ Responsive React frontend

## 🤖 AI Employee Assistant

The system includes an AI assistant that can analyze employee information and answer questions such as:

- Who has the highest salary?
- Who has the lowest salary?
- How many employees are there?
- Which employee works as a developer?
- Give me information about a particular employee.

The backend provides employee data as context to the AI service and returns the generated answer to the React frontend.

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- REST APIs
- Maven
- Swagger / OpenAPI

### Frontend
- React
- JavaScript
- HTML
- CSS
- Vite

### Database
- Microsoft SQL Server

### AI
- AI API integration
- Natural-language employee data queries

## 📁 Project Structure

```text
ai-employee-management-system/
│
├── employee-management/     # Spring Boot Backend
│   ├── src/
│   └── pom.xml
│
├── frontend/                # React Frontend
│   ├── src/
│   └── package.json
│
└── .gitignore
```

## 🔐 Security

The application uses JWT authentication to protect secured API endpoints.

Sensitive information such as database credentials and AI API keys is configured using environment variables and is not committed to the repository.

## 🚀 Running the Project

### Backend

Configure the required environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
GEMINI_API_KEY
```

Then run the Spring Boot application.

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run locally using Vite.

## 📌 Future Improvements

- Role-based authorization
- Employee attendance management
- Department management
- Advanced analytics dashboard
- Improved AI capabilities
- Cloud deployment

## 👨‍💻 Author

**Swapnil Jain**

B.Tech Computer Science & Engineering
