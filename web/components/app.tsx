"use client"

import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import { Moon, Sun, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EnrolledContestsComponent } from "./enrolled-contests"
import { AvailableContestsComponent } from "./available-contests"
import { GlobalRankingComponent } from "./global-ranking"
import { ContestPageComponent } from "./contest-page"
import { AdminDashboardComponent } from "./admin-dashboard"

// Placeholder components for each page
const Profile = () => <div>Profile</div>

export function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      setDarkMode(!darkMode)
      document.documentElement.classList.toggle("dark")
    }
  }

  return (
    <Router>
      <div className={`min-h-screen bg-background text-foreground ${darkMode ? "dark" : ""}`}>
        <nav className="border-b">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link to="/" className="text-2xl font-bold">
              CodeContest
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/enrolled" className="text-sm font-medium">
                Enrolled Contests
              </Link>
              <Link to="/available" className="text-sm font-medium">
                Available Contests
              </Link>
              <Link to="/ranking" className="text-sm font-medium">
                Rankings
              </Link>
              <Link to="/admin" className="text-sm font-medium">
                Admin
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={toggleDarkMode}>
                    {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-8 p-4">
          <Routes>
            <Route path="/" element={<EnrolledContestsComponent />} />
            <Route path="/enrolled" element={<EnrolledContestsComponent />} />
            <Route path="/available" element={<AvailableContestsComponent />} />
            <Route path="/ranking" element={<GlobalRankingComponent />} />
            <Route path="/admin" element={<AdminDashboardComponent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contest/:id" element={<ContestPageComponent />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}