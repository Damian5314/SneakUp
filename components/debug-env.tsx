"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DebugEnv() {
  const [showVars, setShowVars] = useState(false)

  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      ? `Set (${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5)}...)`
      : "Not set",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Not set",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "Set" : "Not set",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "Set" : "Not set",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Environment Variables Debug</CardTitle>
        <CardDescription>Check if your environment variables are loaded correctly</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setShowVars(!showVars)} variant="outline" className="mb-4">
          {showVars ? "Hide Variables" : "Show Variables Status"}
        </Button>

        {showVars && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <pre className="text-xs overflow-auto">{JSON.stringify(envVars, null, 2)}</pre>
          </div>
        )}

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="troubleshooting">
            <AccordionTrigger>Firebase Troubleshooting Steps</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">1. Check .env.local file</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Make sure your .env.local file has all the required Firebase variables and they are correctly
                    formatted.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">2. Verify API Key</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Double-check that your Firebase API key is correct. You can find it in the Firebase console under
                    Project Settings.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">3. Check Authorized Domains</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    In Firebase console, go to Authentication → Settings → Authorized domains and make sure your domain
                    is listed.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">4. Restart Development Server</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    After updating environment variables, restart your development server with <code>npm run dev</code>.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">5. Try a New Firebase Project</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    If all else fails, create a new Firebase project and use its credentials instead.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
