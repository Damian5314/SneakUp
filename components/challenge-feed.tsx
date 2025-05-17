"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Clock, Target, ThumbsUp, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getActiveChallenges, type ChallengeWithTarget } from "@/lib/challenge-service"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"

export default function ChallengeFeed() {
  const [challenges, setChallenges] = useState<ChallengeWithTarget[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    setLoading(true)
    try {
      const activeChallenges = await getActiveChallenges()
      setChallenges(activeChallenges)
    } catch (error) {
      console.error("Error loading challenges:", error)
      toast({
        title: "Error",
        description: "Failed to load challenges",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadProof = async (challengeId: string) => {
    // In a real app, you would open a file picker and upload the proof
    // For now, we'll just simulate a successful upload
    setSubmitting(challengeId)

    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mark as completed locally
      setCompletedChallenges((prev) => [...prev, challengeId])

      toast({
        title: "Success",
        description: "Challenge proof submitted successfully!",
        variant: "default",
      })
    } catch (error) {
      console.error("Error submitting proof:", error)
      toast({
        title: "Error",
        description: "Failed to submit proof",
        variant: "destructive",
      })
    } finally {
      setSubmitting(null)
    }
  }

  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const now = new Date()

    if (deadlineDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      // Less than 24 hours
      return formatDistanceToNow(deadlineDate, { addSuffix: true })
    } else {
      return format(deadlineDate, "MMM d, yyyy")
    }
  }

  if (loading) {
    return (
      <div className="container p-4 space-y-6">
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  const completedCount = completedChallenges.length
  const totalCount = challenges.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Active Challenges</h2>
        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          <Clock className="h-3 w-3 mr-1" />
          {challenges.length} active challenges
        </Badge>
      </div>

      <Progress value={progressPercentage} className="h-2 bg-gray-200 dark:bg-gray-700" />
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {completedCount}/{totalCount} challenges completed
      </p>

      {challenges.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No active challenges found</p>
            <Button className="mt-4" onClick={loadChallenges}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className={`${completedChallenges.includes(challenge.id) ? "opacity-70 bg-gray-50 dark:bg-gray-900" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                  >
                    {challenge.points} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {challenge.type === "targeted" && challenge.target && (
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Target:</span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={challenge.target.avatar_url || "/placeholder.svg"}
                        alt={challenge.target.username}
                      />
                      <AvatarFallback>{challenge.target.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{challenge.target.username}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDeadline(challenge.deadline)}
                </div>
              </CardContent>
              <CardFooter>
                {completedChallenges.includes(challenge.id) ? (
                  <div className="flex items-center gap-2 w-full">
                    <Button variant="outline" className="w-full" disabled>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <Button variant="outline" className="w-1/2">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="default"
                      className="w-1/2 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
                      onClick={() => handleUploadProof(challenge.id)}
                      disabled={submitting === challenge.id}
                    >
                      {submitting === challenge.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload Proof
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
