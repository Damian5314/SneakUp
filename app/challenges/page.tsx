"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChallengeFeed from "@/components/challenge-feed"
import CreateChallenge from "@/components/create-challenge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("feed")

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b">
          <div className="container flex items-center justify-between h-16 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">
              Challenges
            </h1>
            {activeTab === "feed" ? (
              <Button
                onClick={() => setActiveTab("create")}
                className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Challenge
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setActiveTab("feed")}>
                Cancel
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="p-0 border-none">
              <ChallengeFeed />
            </TabsContent>

            <TabsContent value="create" className="p-0 border-none">
              <CreateChallenge />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
