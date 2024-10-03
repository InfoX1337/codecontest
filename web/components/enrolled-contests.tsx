'use client'

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Contest {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  status: "upcoming" | "ongoing" | "completed"
}

export function EnrolledContestsComponent() {
  const [contests, setContests] = useState<Contest[]>([
    {
      id: "1",
      name: "JavaScript Challenge",
      description: "Test your JavaScript skills with this exciting challenge!",
      startTime: "2023-06-01T10:00:00Z",
      endTime: "2023-06-01T12:00:00Z",
      status: "upcoming",
    },
    {
      id: "2",
      name: "Python Coding Marathon",
      description: "A 24-hour coding marathon for Python enthusiasts.",
      startTime: "2023-05-15T00:00:00Z",
      endTime: "2023-05-16T00:00:00Z",
      status: "ongoing",
    },
    {
      id: "3",
      name: "Web Development Showdown",
      description: "Showcase your web development skills in this intense competition.",
      startTime: "2023-05-01T09:00:00Z",
      endTime: "2023-05-01T17:00:00Z",
      status: "completed",
    },
  ])

  const getStatusColor = (status: Contest["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500"
      case "ongoing":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Enrolled Contests</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <Card key={contest.id}>
            <CardHeader>
              <CardTitle>{contest.name}</CardTitle>
              <CardDescription>{contest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(contest.status)}>{contest.status}</Badge>
                <Link
                  to={`/contest/${contest.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Contest
                </Link>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Start: {new Date(contest.startTime).toLocaleString()}</p>
                <p>End: {new Date(contest.endTime).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}