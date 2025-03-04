# Setup Script for CloudSync Dashboard

# Ensure we're in the correct directory
Set-Location -Path "D:\Junior\MVP\cloudsync-directory"

# Create a React project with Vite
Write-Host "Creating React application with Vite in dashboard directory..." -ForegroundColor Green
npm create vite@latest dashboard -- --template react-ts

# Navigate to the dashboard directory
Set-Location -Path "dashboard"

# Install necessary dependencies
Write-Host "Installing core dependencies..." -ForegroundColor Green
npm install

# Install routing dependencies
Write-Host "Installing routing dependencies..." -ForegroundColor Green
npm install react-router-dom@7 @tanstack/react-query axios

# Install UI dependencies with shadcn/ui
Write-Host "Installing UI dependencies..." -ForegroundColor Green
npm install tailwindcss postcss autoprefixer
npm install -D @types/node
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-toast @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-avatar

# Install visualization library - Apache ECharts
Write-Host "Installing data visualization dependencies..." -ForegroundColor Green
npm install echarts echarts-for-react

# Initialize Tailwind CSS
Write-Host "Initializing Tailwind CSS..." -ForegroundColor Green
npx tailwindcss init -p

# Create the tailwind.config.js file
Write-Host "Configuring Tailwind CSS..." -ForegroundColor Green
$tailwindContent = @"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
"@

Set-Content -Path "tailwind.config.js" -Value $tailwindContent

# Create base CSS file
$cssContent = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
 
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
 
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
 
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
 
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
"@

Set-Content -Path "app/app.css" -Value $cssContent

# Install tailwindcss-animate plugin
npm install -D tailwindcss-animate

# Return to the main directory
Set-Location -Path ".."

Write-Host "Dashboard setup complete!" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Update dashboard app routes as needed"
Write-Host "2. Create additional dashboard components and pages"
Write-Host "3. Run 'cd dashboard && npm run dev' to start the dashboard in development mode"
