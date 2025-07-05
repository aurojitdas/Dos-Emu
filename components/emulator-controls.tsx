"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, RotateCcw, Square } from "lucide-react"

interface EmulatorControlsProps {
  isRunning: boolean
  isLoading: boolean
  canStart: boolean
  onStart: () => void
  onStop: () => void
  onRestart: () => void
}

export function EmulatorControls({
  isRunning,
  isLoading,
  canStart,
  onStart,
  onStop,
  onRestart,
}: EmulatorControlsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <Button onClick={onStart} disabled={isLoading || !canStart} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {!canStart ? "Upload Boot Image First" : "Start Emulator"}
            </Button>
          ) : (
            <>
              <Button onClick={onStop} variant="destructive" className="flex items-center gap-2">
                <Square className="w-4 h-4" />
                Stop
              </Button>
              <Button onClick={onRestart} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
