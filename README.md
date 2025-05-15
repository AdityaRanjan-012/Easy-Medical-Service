
📦 Features
User Authentication (OAuth for Admin & Customer)

Real-time Ambulance Booking and Tracking (via Socket.IO)

Location-based Hospital & Ambulance Discovery (using Haversine formula)

Admin Dashboard for Managing Hospitals and Ambulances

Customer Portal for Booking and Notifications

REST APIs and MongoDB for data handling

🛠️ How to Clone and Run the Project Locally
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/AdityaRanjan-012/Easy-Medical-Service
cd your-repo-name
2. Install Dependencies
For Backend
bash
Copy
Edit
cd backend
npm install
For Frontend
bash
Copy
Edit
cd ../frontend
npm install
3. Create Environment Variables
Create a .env file in the backend/ directory and add:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
4. Run Backend Server
bash
Copy
Edit
cd backend
npm start
5. Run Frontend Server
bash
Copy
Edit
cd frontend
npm start
Frontend: http://localhost:3000
Backend API: http://localhost:5000

🧪 Tech Stack
Frontend: React.js, TailwindCSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: OAuth / JWT

Real-time: Socket.IO

Location-based Services: Haversine Formula

