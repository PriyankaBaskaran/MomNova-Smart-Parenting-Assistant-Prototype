"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Square, Loader2, AlertCircle } from "lucide-react"
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming"
import MicrophoneStream from "microphone-stream"

type RecordingState = "idle" | "recording" | "error"

interface VoiceRecorderProps {
  onTranscriptionUpdate: (text: string) => void
  className?: string
}

// Audio encoding configuration
const SAMPLE_RATE = 44100

export function VoiceRecorder({ onTranscriptionUpdate, className }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle")
  const [duration, setDuration] = useState(0)
  const [language, setLanguage] = useState("en-IN")
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const micStreamRef = useRef<MicrophoneStream | null>(null)
  const transcribeClientRef = useRef<TranscribeStreamingClient | null>(null)
  const transcriptionRef = useRef<string>("")

  // Check AWS configuration on mount
  useEffect(() => {
    const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION
    const awsAccessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID
    const awsSecretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
      setIsConfigured(false)
      setError("AWS credentials not configured. Please add them to your .env.local file.")
      setState("error")
    } else {
      setIsConfigured(true)
      // Initialize Transcribe client
      transcribeClientRef.current = new TranscribeStreamingClient({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      })
    }
  }, [])

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start timer
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)
  }, [])

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      if (micStreamRef.current) {
        micStreamRef.current.stop()
      }
    }
  }, [stopTimer])

  // Convert audio stream to async generator for AWS Transcribe
  async function* audioStream(micStream: MicrophoneStream) {
    const stream = micStream as any // MicrophoneStream extends EventEmitter
    const chunks: Buffer[] = []
    let resolveChunk: ((value: Buffer | null) => void) | null = null

    stream.on('data', (chunk: Buffer) => {
      if (resolveChunk) {
        resolveChunk(chunk)
        resolveChunk = null
      } else {
        chunks.push(chunk)
      }
    })

    stream.on('end', () => {
      if (resolveChunk) {
        resolveChunk(null)
        resolveChunk = null
      }
    })

    while (true) {
      let chunk: Buffer | null
      
      if (chunks.length > 0) {
        chunk = chunks.shift()!
      } else {
        chunk = await new Promise<Buffer | null>((resolve) => {
          resolveChunk = resolve
        })
      }

      if (!chunk) break

      if (chunk.length <= SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: encodePCMChunk(chunk),
          },
        }
      }
    }
  }

  // Encode PCM audio chunk
  function encodePCMChunk(chunk: Buffer): Uint8Array {
    const input = MicrophoneStream.toRaw(chunk)
    let offset = 0
    const buffer = new ArrayBuffer(input.length * 2)
    const view = new DataView(buffer)
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return new Uint8Array(buffer)
  }

  // Start recording with AWS Transcribe
  const startRecording = async () => {
    if (!isConfigured || !transcribeClientRef.current) {
      setError("AWS Transcribe is not configured. Please check your credentials.")
      setState("error")
      return
    }

    setError(null)
    setDuration(0)
    transcriptionRef.current = ""

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      // Create microphone stream
      const micStream = new MicrophoneStream()
      micStream.setStream(stream)
      micStreamRef.current = micStream

      // Start AWS Transcribe streaming
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: language as any,
        MediaSampleRateHertz: SAMPLE_RATE,
        MediaEncoding: "pcm",
        AudioStream: audioStream(micStream),
      })

      setState("recording")
      startTimer()

      // Process transcription results
      const response = await transcribeClientRef.current.send(command)

      if (response.TranscriptResultStream) {
        for await (const event of response.TranscriptResultStream) {
          if (event.TranscriptEvent?.Transcript?.Results) {
            const results = event.TranscriptEvent.Transcript.Results

            for (const result of results) {
              if (result.Alternatives && result.Alternatives.length > 0) {
                const transcript = result.Alternatives[0].Transcript || ""
                
                if (!result.IsPartial) {
                  // Add final result to transcription
                  transcriptionRef.current += (transcriptionRef.current ? ' ' : '') + transcript
                  onTranscriptionUpdate(transcriptionRef.current)
                }
              }
            }
          }
        }
      }

      // Recording completed
      stopTimer()
      setState("idle")
      
    } catch (err: any) {
      console.error("Transcription error:", err)
      
      if (err.name === "NotAllowedError") {
        setPermissionDenied(true)
        setError("Microphone permission denied. Please allow access in your browser settings.")
      } else if (err.name === "UnrecognizedClientException") {
        setError("Invalid AWS credentials. Please check your access key and secret key.")
      } else if (err.name === "AccessDeniedException") {
        setError("AWS access denied. Please ensure your IAM user has Transcribe permissions.")
      } else {
        setError(`Transcription error: ${err.message || "Unknown error"}`)
      }
      
      setState("error")
      stopTimer()
      
      // Cleanup
      if (micStreamRef.current) {
        micStreamRef.current.stop()
      }
    }
  }

  // Stop recording
  const stopRecording = () => {
    stopTimer()
    
    if (micStreamRef.current) {
      micStreamRef.current.stop()
      micStreamRef.current = null
    }

    setState("idle")
  }

  // Get status message
  const getStatusMessage = () => {
    switch (state) {
      case "idle":
        return "Tap microphone to start recording"
      case "recording":
        return "Listening... Speak naturally"
      case "error":
        return error || "Something went wrong"
      default:
        return ""
    }
  }

  return (
    <div className={className}>
      {/* Language Selector */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-medium text-foreground">Language</label>
        <Select value={language} onValueChange={setLanguage} disabled={state === "recording" || !isConfigured}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-IN">English (India)</SelectItem>
            <SelectItem value="hi-IN">Hindi</SelectItem>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="en-GB">English (UK)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Microphone Button */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Pulse animation when recording */}
          {state === "recording" && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse" />
            </>
          )}
          
          <Button
            size="lg"
            variant={state === "recording" ? "destructive" : state === "error" ? "outline" : "default"}
            onClick={state === "idle" ? startRecording : state === "recording" ? stopRecording : undefined}
            disabled={permissionDenied || !isConfigured}
            className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
              state === "recording" 
                ? "bg-red-500 hover:bg-red-600 scale-110" 
                : ""
            }`}
          >
            {state === "idle" && <Mic className="w-8 h-8" />}
            {state === "recording" && <Mic className="w-8 h-8 text-white" />}
            {state === "error" && <MicOff className="w-8 h-8 text-destructive" />}
            <span className="sr-only">
              {state === "idle" ? "Start recording" : state === "recording" ? "Recording" : "Microphone"}
            </span>
          </Button>
        </div>

        {/* Recording Indicator */}
        {state === "recording" && (
          <div className="flex items-center gap-2 mt-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-lg font-mono font-semibold text-foreground">
              {formatDuration(duration)}
            </span>
          </div>
        )}

        {/* Status Message */}
        <p className={`text-sm mt-4 text-center ${
          state === "error" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {getStatusMessage()}
        </p>

        {/* Recording hint */}
        {state === "recording" && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Text will appear in the input field above
          </p>
        )}
      </div>

      {/* Error Alert */}
      {error && state === "error" && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {permissionDenied && (
              <span className="block mt-2 text-xs">
                To enable microphone access, click the lock/info icon in your browser&apos;s address bar.
              </span>
            )}
            {!isConfigured && (
              <div className="mt-3 p-3 bg-destructive/10 rounded text-xs">
                <p className="font-semibold mb-2">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a <code>.env.local</code> file in your project root</li>
                  <li>Add your AWS credentials:
                    <pre className="mt-1 p-2 bg-black/20 rounded text-[10px] overflow-x-auto">
{`NEXT_PUBLIC_AWS_REGION=ap-south-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret`}
                    </pre>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Info about AWS Transcribe */}
      {isConfigured && state === "idle" && (
        <div className="text-xs text-center text-muted-foreground mt-4">
          <p>Powered by AWS Transcribe</p>
          <p className="mt-1">Real-time speech recognition with AI</p>
        </div>
      )}
    </div>
  )
}
