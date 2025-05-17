"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff } from "lucide-react"

export default function MapView() {
  const [stealthMode, setStealthMode] = useState(false)
  const [stealthAvailable, setStealthAvailable] = useState(true)

  const toggleStealthMode = () => {
    if (stealthAvailable) {
      setStealthMode(!stealthMode)
      if (!stealthMode) {
        setStealthAvailable(false)
        // In a real app, we would start a timer to re-enable stealth mode
        setTimeout(() => setStealthAvailable(true), 10000) // Just for demo, 10 seconds instead of 1 hour
      }
    }
  }

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Friend Locations</h2>
        <Button
          variant={stealthMode ? "destructive" : "outline"}
          size="sm"
          onClick={toggleStealthMode}
          disabled={!stealthAvailable && !stealthMode}
        >
          {stealthMode ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Exit Stealth
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Stealth Mode
            </>
          )}
        </Button>
      </div>

      {stealthMode && (
        <Badge
          variant="outline"
          className="w-full py-2 justify-center bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
        >
          You are invisible to others for 60 minutes
        </Badge>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
            {/* This would be a real map in a production app */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 relative">
                <img
                  src="/placeholder.svg?height=400&width=400&text=Map+View"
                  alt="Map"
                  className="w-full h-full object-cover"
                />

                {/* Friend avatars on the map */}
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Lisa" />
                    <AvatarFallback>LS</AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute top-2/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Mark" />
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute bottom-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Sarah" />
                    <AvatarFallback>SR</AvatarFallback>
                  </Avatar>
                </div>

                {/* Your location */}
                {!stealthMode && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Avatar className="h-12 w-12 border-2 border-purple-500">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt="You" />
                      <AvatarFallback>YOU</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Lisa" />
                <AvatarFallback>LS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Lisa</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">500m away</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mark" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Mark</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1.2km away</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                <AvatarFallback>SR</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Sarah</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">800m away</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Tom" />
                <AvatarFallback>TM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Tom</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
