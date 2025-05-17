"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChallengeFeed from "@/components/challenge-feed"
import MapView from "@/components/map-view"
import Scoreboard from "@/components/scoreboard"
import NotificationsView from "@/components/notifications-view"
import { Bell, MapPin, Trophy, LightbulbIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
              Sneaky
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/challenges">
              <Button variant="ghost" size="icon" className="relative">
                <LightbulbIcon className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </Link>
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid grid-cols-4 w-full rounded-none border-b">
            <TabsTrigger
              value="challenges"
              className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-gray-800"
            >
              Challenges
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-gray-800">
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </TabsTrigger>
            <TabsTrigger
              value="scoreboard"
              className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-gray-800"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Scores
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-gray-800"
            >
              <Bell className="h-4 w-4 mr-1" />
              Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="challenges" className="p-0 border-none">
            <ChallengeFeed />
          </TabsContent>
          <TabsContent value="map" className="p-0 border-none">
            <MapView />
          </TabsContent>
          <TabsContent value="scoreboard" className="p-0 border-none">
            <Scoreboard />
          </TabsContent>
          <TabsContent value="notifications" className="p-0 border-none">
            <NotificationsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
