Rental Management System
Overview
The Rental Management System is a web application designed to manage bike rentals. It allows users to rent bikes, return them, and view their rental history. The application uses a Node.js and Express backend with MongoDB as the database.

Features
User authentication and authorization
CRUD operations for bikes
Bike rental and return functionality
View rental history for authenticated users
Global error handling and custom error responses

Technologies Used
Node.js
Express.js
TypeScript
MongoDB
Mongoose
JWT for authentication
Cors for handling cross-origin requests
Getting Started
Prerequisites
Node.js (>=14.x)
MongoDB

Installation

Clone the repository:

bash
git clone https://github.com/rajuh301/Level-2-assignment-3/edit/main
cd rental-management-system
Install dependencies:

bash
npm install
Environment variables:
Create a .env file in the root directory and add the following variables:

plaintext
DATABASE_URL=<your-mongodb-url>
PORT=5000
JWT_SECRET=<your-jwt-secret>
Run the application:

bash
npm start


API Endpoints
Authentication

POST /api/auth/register - Register a new user
POST /api/auth/login - User login
Bike Management

POST /api/bikes - Create a new bike (admin only)
GET /api/bikes - Get all bikes
GET /api/bikes/:id - Get a bike by ID
PUT /api/bikes/:id - Update a bike by ID (admin only)
DELETE /api/bikes/:id - Delete a bike by ID (admin only)
Rental Management

POST /api/rentals - Rent a bike
PUT /api/rentals/:id/return - Return a rented bike
GET /api/rentals - Get all rentals for the authenticated user
