'use client'

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Admin {
  id: string
  name: string
  email: string
}

interface Moderator {
  id: string
  name: string
  email: string
}

export function AdminDashboardComponent() {
  const [organizationName, setOrganizationName] = useState("Tech University")
  const [admins, setAdmins] = useState<Admin[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ])
  const [moderators, setModerators] = useState<Moderator[]>([
    { id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "2", name: "Bob Brown", email: "bob@example.com" },
  ])

  const handleAddAdmin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    setAdmins([...admins, { id: Date.now().toString(), name, email }])
    event.currentTarget.reset()
  }

  const handleAddModerator = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    setModerators([...moderators, { id: Date.now().toString(), name, email }])
    event.currentTarget.reset()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="organization">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="moderators">Moderators</TabsTrigger>
          <TabsTrigger value="contests">Contests</TabsTrigger>
        </TabsList>
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Manage your organization's details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Manage Admins</CardTitle>
              <CardDescription>Add or remove organization admins</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Name</Label>
                  <Input id="admin-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" name="email" type="email" required />
                </div>
                <Button type="submit">Add Admin</Button>
              </form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Current Admins</h3>
                <ul className="space-y-2">
                  {admins.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center">
                      <span>{admin.name} ({admin.email})</span>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="moderators">
          <Card>
            <CardHeader>
              <CardTitle>Manage Moderators</CardTitle>
              <CardDescription>Add or remove organization moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddModerator} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moderator-name">Name</Label>
                  <Input id="moderator-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moderator-email">Email</Label>
                  <Input id="moderator-email" name="email" type="email" required />
                </div>
                <Button type="submit">Add Moderator</Button>
              </form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Current Moderators</h3>
                <ul className="space-y-2">
                  {moderators.map((moderator) => (
                    <li key={moderator.id} className="flex justify-between items-center">
                      <span>{moderator.name} ({moderator.email})</span>
                      <Button variant="destructive" size="sm">Remove</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contests">
          <Card>
            <CardHeader>
              <CardTitle>Manage Contests</CardTitle>
              <CardDescription>Create and manage coding contests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Create New Contest</Button>
              {/* Add a list of existing contests here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}