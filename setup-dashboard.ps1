# Setup Script for CloudSync Dashboard

# Ensure we're in the correct directory
Set-Location -Path "C:\Users\ASUS\CascadeProjects\cloudsync-directory"

# Create React App with TypeScript
Write-Host "Creating React application in dashboard directory..." -ForegroundColor Green
npx create-react-app dashboard --template typescript

# Navigate to the dashboard directory
Set-Location -Path "dashboard"

# Install necessary dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install --save react-router-dom @tanstack/react-query axios
npm install --save @headlessui/react @heroicons/react
npm install --save tailwindcss postcss autoprefixer
npm install --save recharts @tremor/react
npm install --save-dev @types/react-router-dom

# Initialize Tailwind CSS
Write-Host "Initializing Tailwind CSS..." -ForegroundColor Green
npx tailwindcss init -p

# Return to the main directory
Set-Location -Path ".."

Write-Host "Dashboard setup complete!" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Configure TailwindCSS in dashboard/tailwind.config.js"
Write-Host "2. Update CSS imports in dashboard/src/index.css"
Write-Host "3. Run 'cd dashboard && npm start' to start the dashboard in development mode"
