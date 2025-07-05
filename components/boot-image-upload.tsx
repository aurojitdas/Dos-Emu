"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardDrive, Upload, X, CheckCircle } from "lucide-react"

interface BootImageUploadProps {
  onBootImageUploaded: (file: File) => void
  currentBootImage: File | null
  onRemoveBootImage: () => void
}

export function BootImageUpload({ onBootImageUploaded, currentBootImage, onRemoveBootImage }: BootImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        const file = files[0]
        if (isValidBootImage(file)) {
          onBootImageUploaded(file)
        } else {
          alert("Please upload a valid boot image file (.jsdos, .img, .ima, .zip)")
        }
      }
    },
    [onBootImageUploaded],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        if (isValidBootImage(file)) {
          onBootImageUploaded(file)
        } else {
          alert("Please upload a valid boot image file (.jsdos, .img, .ima, .zip)")
        }
      }
    },
    [onBootImageUploaded],
  )

  const isValidBootImage = (file: File): boolean => {
    const validExtensions = [".jsdos", ".img", ".ima", ".zip"]
    const fileName = file.name.toLowerCase()
    return validExtensions.some((ext) => fileName.endsWith(ext))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          Boot Image
        </CardTitle>
        <CardDescription className="text-xs">Upload a DOS boot disk image to start the emulator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentBootImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-600 mb-2">Drag & drop boot image here</p>
            <p className="text-xs text-slate-500 mb-3">Supports: .jsdos, .img, .ima, .zip</p>
            <input
              type="file"
              accept=".jsdos,.img,.ima,.zip"
              onChange={handleFileSelect}
              className="hidden"
              id="boot-image-upload"
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById("boot-image-upload")?.click()}>
              Choose Boot Image
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{currentBootImage.name}</p>
                <p className="text-xs text-green-600">{(currentBootImage.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("boot-image-upload")?.click()}
                className="flex-1"
              >
                Replace Image
              </Button>
              <Button variant="ghost" size="sm" onClick={onRemoveBootImage} className="px-3">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <input
              type="file"
              accept=".jsdos,.img,.ima,.zip"
              onChange={handleFileSelect}
              className="hidden"
              id="boot-image-upload"
            />
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p>
            <strong>Where to get boot images:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Create .jsdos files from existing DOS installations</li>
            <li>Use DOS 6.22 boot disk images</li>
            <li>FreeDOS images for open-source alternative</li>
            <li>Game-specific boot images with pre-installed software</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
