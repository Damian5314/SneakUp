"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { submitCompletion } from "@/lib/completion-service"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface UploadProofProps {
  challengeId: string
  challengeTitle: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function UploadProof({ challengeId, challengeTitle, onSuccess, onCancel }: UploadProofProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const result = await submitCompletion(challengeId, file)

      if (result) {
        toast({
          title: "Success",
          description: "Proof submitted successfully!",
          variant: "default",
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to submit proof",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting proof:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Challenge Proof</CardTitle>
        <CardDescription>
          Submit proof for challenge: <span className="font-medium">{challengeTitle}</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {preview ? (
            <div className="relative">
              <div className="aspect-video w-full relative rounded-md overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="proof">Upload Proof</Label>
              <Input
                ref={fileInputRef}
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Upload a photo or screenshot as proof</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!file || loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Submit Proof
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
