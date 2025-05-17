"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createChallenge } from "@/lib/challenge-service"
import { useToast } from "@/hooks/use-toast"
import { addDays, format } from "date-fns"
import { refreshAuthToken } from "@/lib/auth-service"

export default function CreateChallenge() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [points, setPoints] = useState(50)
  const [type, setType] = useState<"general" | "targeted">("general")
  const [targetUid, setTargetUid] = useState("")
  const [deadline, setDeadline] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Refresh the token before creating the challenge
      await refreshAuthToken()

      const challenge = {
        title,
        description,
        points,
        type,
        target_uid: type === "targeted" ? targetUid : undefined,
        deadline: new Date(deadline).toISOString(),
      }

      const result = await createChallenge(challenge)

      if (result) {
        toast({
          title: "Success",
          description: "Challenge created successfully!",
          variant: "default",
        })

        // Reset form
        setTitle("")
        setDescription("")
        setPoints(50)
        setType("general")
        setTargetUid("")
        setDeadline(format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"))

        // Navigate back to challenges
        router.push("/challenges")
      } else {
        toast({
          title: "Error",
          description: "Failed to create challenge",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating challenge:", error)
      setError(error.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Challenge</CardTitle>
          <CardDescription>Set up a new challenge for your friends</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                placeholder="e.g., Stealth Photo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what needs to be done"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min={10}
                max={100}
                step={10}
                value={points}
                onChange={(e) => setPoints(Number.parseInt(e.target.value))}
                required
              />
              <p className="text-xs text-gray-500">Between 10 and 100 points</p>
            </div>

            <div className="space-y-2">
              <Label>Challenge Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as "general" | "targeted")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general">General (anyone can complete)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="targeted" id="targeted" />
                  <Label htmlFor="targeted">Targeted (specific person)</Label>
                </div>
              </RadioGroup>
            </div>

            {type === "targeted" && (
              <div className="space-y-2">
                <Label htmlFor="target">Target Person</Label>
                <Select value={targetUid} onValueChange={setTargetUid} required={type === "targeted"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a target" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* In a real app, you would fetch this list from your database */}
                    <SelectItem value="user1">Sarah Johnson</SelectItem>
                    <SelectItem value="user2">Mark Wilson</SelectItem>
                    <SelectItem value="user3">Lisa Brown</SelectItem>
                    <SelectItem value="user4">Tom Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Challenge"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
