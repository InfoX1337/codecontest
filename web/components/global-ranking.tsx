'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Participant {
  id: string
  rank: number
  name: string
  score: number
  organization: string
  city: string
}

export function GlobalRankingComponent() {
  const [rankingType, setRankingType] = useState<"global" | "city" | "organization">("global")
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", rank: 1, name: "Alice Johnson", score: 2500, organization: "Tech University", city: "New York" },
    { id: "2", rank: 2, name: "Bob Smith", score: 2400, organization: "Code Academy", city: "San Francisco" },
    { id: "3", rank: 3, name: "Charlie Brown", score: 2300, organization: "Dev Corp", city: "London" },
    { id: "4", rank: 4, name: "Diana Lee", score: 2200, organization: "Tech University", city: "New York" },
    { id: "5", rank: 5, name: "Ethan Hunt", score: 2100, organization: "Code Academy", city: "San Francisco" },
  ])

  const filteredParticipants = participants.filter((participant) => {
    if (rankingType === "global") return true
    if (rankingType === "city") return participant.city === "New York" // Replace with actual user's city
    if (rankingType === "organization") return participant.organization === "Tech University" // Replace with actual user's organization
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rankings</h1>
        <Select value={rankingType} onValueChange={(value: "global" | "city" | "organization") => setRankingType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select ranking type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="global">Global</SelectItem>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="organization">Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredParticipants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="font-medium">{participant.rank}</TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.score}</TableCell>
              <TableCell>{participant.organization}</TableCell>
              <TableCell>{participant.city}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}