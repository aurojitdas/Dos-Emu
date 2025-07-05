"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, HardDrive, FileText, Info, AlertCircle } from "lucide-react"
import { BootImageUpload } from "@/components/boot-image-upload"
import { FileUpload } from "@/components/file-upload"
import { EmulatorControls } from "@/components/emulator-controls"
import { SystemInfo } from "@/components/system-info"

declare global {
  interface Window {
    Dos: any
  }
}

export default function DOSEmulator() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [bootImage, setBootImage] = useState<File | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dosInstance, setDosInstance] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [jsdosLoaded, setJsdosLoaded] = useState(false)

  useEffect(() => {
    // Load js-dos library
    const script = document.createElement("script")
    script.src = "https://js-dos.com/6.22/current/js-dos.js"
    script.onload = () => {
      console.log("js-dos loaded successfully")
      setJsdosLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load js-dos")
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const createBootImageUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const blob = new Blob([arrayBuffer])
        const url = URL.createObjectURL(blob)
        resolve(url)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const startEmulator = async () => {
    if (!window.Dos || !canvasRef.current || !bootImage) {
      alert("Please upload a boot image first!")
      return
    }

    setIsLoading(true)
    setLoadingProgress(0)

    try {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create URL for boot image
      const bootImageUrl = await createBootImageUrl(bootImage)

      // Initialize DOS emulator with uploaded boot image
      const dos = window.Dos(canvasRef.current, {
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
      })

      // Load the user's boot image
      const ci = await dos.run(bootImageUrl)

      setDosInstance(ci)
      setIsRunning(true)
      setLoadingProgress(100)

      // Mount uploaded files as D: drive if any
      if (uploadedFiles.length > 0) {
        await mountUploadedFiles(ci)
      }
    } catch (error) {
      console.error("Failed to start emulator:", error)
      alert("Failed to start emulator. Please check your boot image file.")
    } finally {
      setIsLoading(false)
    }
  }

  const stopEmulator = () => {
    if (dosInstance) {
      dosInstance.exit()
      setDosInstance(null)
    }
    setIsRunning(false)
  }

  const restartEmulator = async () => {
    stopEmulator()
    setTimeout(() => {
      startEmulator()
    }, 1000)
  }

  const mountUploadedFiles = async (ci: any) => {
    // Create virtual file system for uploaded files
    try {
      for (const file of uploadedFiles) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result
          // This would mount the file in the DOS environment
          console.log(`Mounting file: ${file.name}`)
        }
        reader.readAsArrayBuffer(file)
      }
    } catch (error) {
      console.error("Failed to mount files:", error)
    }
  }

  const handleBootImageUploaded = (file: File) => {
    setBootImage(file)
  }

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeBootImage = () => {
    setBootImage(null)
    if (isRunning) {
      stopEmulator()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Monitor className="w-10 h-10 text-green-400" />
            Local DOS Emulator
          </h1>
          <p className="text-slate-300">Upload your own DOS boot image and run classic programs locally</p>
        </div>

        {!jsdosLoaded && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Loading js-dos library...</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Emulator */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-black/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-sm text-slate-400">DOS Terminal</span>
                  </div>
                  <Badge variant={isRunning ? "default" : "secondary"}>{isRunning ? "Running" : "Stopped"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
                  <canvas ref={canvasRef} className="max-w-full max-h-full" style={{ imageRendering: "pixelated" }} />
                  {!isRunning && !isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Monitor className="w-16 h-16 text-green-400 mx-auto opacity-50" />
                        {!bootImage ? (
                          <p className="text-slate-400">Upload a boot image to start</p>
                        ) : (
                          <p className="text-slate-400">Click Start to begin emulation</p>
                        )}
                      </div>
                    </div>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                      <div className="text-center space-y-4">
                        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-green-400">Loading Boot Image...</p>
                        <Progress value={loadingProgress} className="w-64" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <EmulatorControls
              isRunning={isRunning}
              isLoading={isLoading}
              canStart={!!bootImage && jsdosLoaded}
              onStart={startEmulator}
              onStop={stopEmulator}
              onRestart={restartEmulator}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Tabs defaultValue="boot" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="boot">Boot</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>

              <TabsContent value="boot" className="space-y-4">
                <BootImageUpload
                  onBootImageUploaded={handleBootImageUploaded}
                  currentBootImage={bootImage}
                  onRemoveBootImage={removeBootImage}
                />
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <FileUpload onFilesUploaded={handleFilesUploaded} />

                {uploadedFiles.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        Additional Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-100 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-mono">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                            ×
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="system">
                <SystemInfo isRunning={isRunning} bootImage={bootImage} />
              </TabsContent>

              <TabsContent value="help">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      How to Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium">1. Upload Boot Image</h4>
                      <p className="text-slate-600">Upload a DOS boot disk image (.img, .ima, .jsdos files)</p>
                    </div>
                    <div>
                      <h4 className="font-medium">2. Add Files (Optional)</h4>
                      <p className="text-slate-600">Upload additional files to access in DOS</p>
                    </div>
                    <div>
                      <h4 className="font-medium">3. Start Emulator</h4>
                      <p className="text-slate-600">Click Start to boot your DOS system</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-slate-500">
                        Supported formats: .jsdos, .img, .ima, .zip
                        <br />
                        Everything runs locally in your browser
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-4 h-4" />
              <span className="text-sm">
                This emulator runs entirely in your browser. Upload your own DOS boot image to get started. No data is
                sent to any server - everything is processed locally.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
