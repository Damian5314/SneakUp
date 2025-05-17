"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal } from "lucide-react"

export default function Scoreboard() {
  const players = [
    {
      id: 1,
      name: "Sarah",
      points: 320,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SR",
      completedChallenges: 8,
      rank: 1,
      isKing: true,
    },
    {
      id: 2,
      name: "Mark",
      points: 280,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MK",
      completedChallenges: 7,
      rank: 2,
    },
    {
      id: 3,
      name: "You",
      points: 210,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "YO",
      completedChallenges: 5,
      rank: 3,
    },
    {
      id: 4,
      name: "Lisa",
      points: 180,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "LS",
      completedChallenges: 4,
      rank: 4,
    },
    {
      id: 5,
      name: "Tom",
      points: 120,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TM",
      completedChallenges: 3,
      rank: 5,
    },
  ]

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Weekly Scoreboard</h2>
        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          2 days left
        </Badge>
      </div>

      <Card className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Current Champion
            <Crown className="h-5 w-5 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Avatar className="h-20 w-20 border-4 border-yellow-400">
            <AvatarImage src={players[0].avatar || "/placeholder.svg"} alt={players[0].name} />
            <AvatarFallback>{players[0].initials}</AvatarFallback>
          </Avatar>
          <h3 className="mt-2 text-xl font-bold">{players[0].name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
            >
              {players[0].points} points
            </Badge>
            <Badge variant="outline" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
              {players[0].completedChallenges} challenges
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {players.slice(1).map((player) => (
          <Card key={player.id} className={player.name === "You" ? "border-purple-200 dark:border-purple-800" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold">
                  {player.rank}
                </div>
                <Avatar>
                  <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                  <AvatarFallback>{player.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{player.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {player.completedChallenges} challenges completed
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                >
                  {player.points} pts
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm">Previous Champions</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-yellow-400">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Mark" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <p className="mt-1 text-sm font-medium">Mark</p>
              <div className="flex items-center mt-1">
                <Medal className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs">Week 3</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-yellow-400">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <p className="mt-1 text-sm font-medium">You</p>
              <div className="flex items-center mt-1">
                <Medal className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs">Week 2</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12 border-2 border-yellow-400">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Lisa" />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
              <p className="mt-1 text-sm font-medium">Lisa</p>
              <div className="flex items-center mt-1">
                <Medal className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs">Week 1</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
