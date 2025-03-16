# 1️⃣ Clone the repository
git clone https://github.com/your-username/github-crm.git
cd github-crm

# 2️⃣ Copy environment variables for the backend
cp backend/.env.example backend/.env

# 3️⃣ Configure environment variables
# Open backend/.env and set the required values

# 4️⃣ Build and start the project
docker-compose up --build

# 5️⃣ Access the application
# Backend: http://localhost:5001
# Frontend: http://localhost:5173 (or the port set in Vite)
