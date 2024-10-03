'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Contest {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  organization: string
  isPublic: boolean
}

export function AvailableContestsComponent() {
  const [contests, setContests] = useState<Contest[]>([
    {
      id: "1",
      name: "React Hackathon",
      description: "Build an innovative React application in 48 hours!",
      startTime: "2023-06-15T00:00:00Z",
      endTime: "2023-06-17T00:00:00Z",
      organization: "React Devs",
      isPublic: true,
    },
    {
      id: "2",
      name: "Data Structures Deep Dive",
      description: "Test your knowledge of advanced data structures.",
      startTime: "2023-07-01T09:00:00Z",
      endTime: "2023-07-01T17:00:00Z",
      organization: "CS Academy",
      isPublic: false,
    },
    {
      id: "3",
      name: "Machine Learning Challenge",
      description: "Solve real-world problems using machine learning techniques.",
      startTime: "2023-08-01T00:00:00Z",
      endTime: "2023-08-07T23:59:59Z",
      organization: "AI Research Group",
      isPublic: true,
    },
  ])

  const handleEnroll = (contestId: string) => {
    // Implement enrollment logic here
    console.log(`Enrolled in contest with ID: ${contestId}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Available Contests</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contests.map((contest) => (
          <Card key={contest.id}>
            <CardHeader>
              <CardTitle>{contest.name}</CardTitle>
              <CardDescription>{contest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Badge variant={contest.isPublic ? "default" : "secondary"}>
                  {contest.isPublic ? "Public" : "Private"}
                </Badge>
                <span className="text-sm text-muted-foreground">{contest.organization}</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                <p>Start: {new Date(contest.startTime).toLocaleString()}</p>
                <p>End: {new Date(contest.endTime).toLocaleString()}</p>
              </div>
              <Button onClick={() => handleEnroll(contest.id)} className="w-full">
                Enroll
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}