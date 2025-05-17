"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Camera, Clock, Target, Trophy } from "lucide-react"

export default function NotificationsView() {
  const notifications = [
    {
      id: 1,
      type: "target",
      message: "You are now the target of a new challenge!",
      time: "Just now",
      read: false,
      icon: <Target className="h-4 w-4 text-red-500" />,
      user: {
        name: "Mark",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MK",
      },
    },
    {
      id: 2,
      type: "completed",
      message: "Lisa has completed a challenge against you 😈",
      time: "2 hours ago",
      read: false,
      icon: <Camera className="h-4 w-4 text-purple-500" />,
      user: {
        name: "Lisa",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LS",
      },
    },
    {
      id: 3,
      type: "new",
      message: "New challenges are available!",
      time: "Yesterday",
      read: true,
      icon: <Bell className="h-4 w-4 text-orange-500" />,
    },
    {
      id: 4,
      type: "winner",
      message: "Sarah is the new champion of the week!",
      time: "1 week ago",
      read: true,
      icon: <Trophy className="h-4 w-4 text-yellow-500" />,
      user: {
        name: "Sarah",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SR",
      },
    },
  ]

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Notifications</h2>
        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
          2 new
        </Badge>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-purple-500" : ""}`}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {notification.user ? (
                  <Avatar>
                    <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.initials}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {notification.icon}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{notification.message}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {notification.time}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
