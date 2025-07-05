"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, File, X } from "lucide-react"

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles((prev) => [...prev, ...files])
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }, [])

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = () => {
    if (selectedFiles.length > 0) {
      onFilesUploaded(selectedFiles)
      setSelectedFiles([])
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Additional Files
        </CardTitle>
        <CardDescription className="text-xs">Upload files to access in DOS (optional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-600 mb-2">Drag & drop files here, or click to select</p>
          <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
          <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
            Choose Files
          </Button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Files:</p>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button onClick={uploadFiles} className="w-full" size="sm">
              Add Files to Emulator
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
