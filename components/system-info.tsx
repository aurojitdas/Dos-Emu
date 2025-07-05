"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Monitor, HardDrive, Cpu, MemoryStick } from "lucide-react"

interface SystemInfoProps {
  isRunning: boolean
  bootImage: File | null
}

export function SystemInfo({ isRunning, bootImage }: SystemInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Boot Image</span>
            </div>
            <Badge variant={bootImage ? "default" : "secondary"}>{bootImage ? "Loaded" : "Not Loaded"}</Badge>
          </div>

          {bootImage && (
            <div className="text-xs text-slate-600 ml-6">
              <p>File: {bootImage.name}</p>
              <p>Size: {(bootImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Emulator</span>
            </div>
            <Badge variant="outline">js-dos 6.22</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-4 h-4 text-green-600" />
              <span className="text-sm">Status</span>
            </div>
            <Badge variant={isRunning ? "default" : "secondary"}>{isRunning ? "Running" : "Stopped"}</Badge>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-slate-600">
            Mode: Local Emulation
            <br />
            Storage: Browser Memory
            <br />
            Network: Offline
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
