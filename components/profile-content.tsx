"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { signOut } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import FirebaseSupabaseTest from "@/components/firebase-supabase-test"
import {
  ArrowLeft,
  Award,
  Camera,
  Clock,
  Crown,
  Edit,
  Eye,
  LogOut,
  Medal,
  Settings,
  Target,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProfileContent() {
  const [notifications, setNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      // Remove token from localStorage or cookies
      localStorage.removeItem("authToken")

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        variant: "default",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b">
        <div className="container flex items-center h-16 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-xl font-bold">Profile</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container p-4">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-purple-500">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Your profile" />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <h1 className="mt-4 text-2xl font-bold">{user?.email?.split("@")[0] || "User"}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{user?.email?.split("@")[0]?.toLowerCase() || "user"}</p>

            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">210</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">3rd</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Wins</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-1" />
                Trophies
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="h-4 w-4 mr-1" />
                History
              </TabsTrigger>
              <TabsTrigger value="friends">
                <Users className="h-4 w-4 mr-1" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Champion Titles
                  </CardTitle>
                  <CardDescription>Your weekly champion achievements</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Crown className="h-8 w-8 text-yellow-500 mb-2" />
                    <p className="font-medium">Week 2 Champion</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">320 points</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Next title pending...</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-purple-500" />
                    Badges & Achievements
                  </CardTitle>
                  <CardDescription>Special accomplishments and skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Camera className="h-6 w-6 text-purple-500 mb-1" />
                      <p className="text-xs font-medium text-center">Sneaky Photographer</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Target className="h-6 w-6 text-orange-500 mb-1" />
                      <p className="text-xs font-medium text-center">Master Targeter</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Eye className="h-6 w-6 text-blue-500 mb-1" />
                      <p className="text-xs font-medium text-center">Stealth Expert</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Award className="h-6 w-6 text-green-500 mb-1" />
                      <p className="text-xs font-medium text-center">First Victory</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Locked</p>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-dashed">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Locked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge History</CardTitle>
                  <CardDescription>Your recent challenge activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <Camera className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Stealth Photo</p>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                          >
                            +50 pts
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          You took a photo of Mark without being seen
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                        <Target className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Water Surprise</p>
                          <Badge
                            variant="outline"
                            className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                          >
                            Failed
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          You were caught trying to spray Lisa with water
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">4 days ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <Camera className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Coffee Swap</p>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                          >
                            +40 pts
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">You replaced Sarah's coffee with tea</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">1 week ago</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                        <Camera className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Sock Thief</p>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                          >
                            +30 pts
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          You stole Tom's sock without him noticing
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 weeks ago</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Load More History
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Friends Tab */}
            <TabsContent value="friends" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Friends</CardTitle>
                    <Button size="sm" variant="outline" className="gap-1">
                      <UserPlus className="h-4 w-4" />
                      Add Friend
                    </Button>
                  </div>
                  <CardDescription>People you're playing with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                        <AvatarFallback>SR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Sarah Johnson</p>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            Champion
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">320 points • 8 challenges</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mark" />
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Mark Wilson</p>
                          <Badge variant="outline">2nd Place</Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">280 points • 7 challenges</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Lisa" />
                        <AvatarFallback>LS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Lisa Brown</p>
                          <Badge variant="outline">4th Place</Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">180 points • 4 challenges</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Tom" />
                        <AvatarFallback>TM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Tom Davis</p>
                          <Badge variant="outline">5th Place</Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">120 points • 3 challenges</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Invite More Friends
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>App Settings</CardTitle>
                  <CardDescription>Manage your app preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive alerts for new challenges and activities
                      </p>
                    </div>
                    <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location">Location Sharing</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow friends to see your location on the map
                      </p>
                    </div>
                    <Switch id="location" checked={locationSharing} onCheckedChange={setLocationSharing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkmode">Dark Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
                    </div>
                    <Switch id="darkmode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Privacy Settings
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full" onClick={() => setShowLogoutConfirm(true)}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Debug Tab */}
            <TabsContent value="debug">
              <FirebaseSupabaseTest />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to log in again to access your account and challenges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, stay logged in</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Yes, log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
