import { useCallback, useEffect, useState } from "react"

import { AUDIO_TYPE } from "@/config/audio-type"

export const useRecord = (onStop: (file: File) => void) => {
  const [volume, setVolume] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  useEffect(() => {
    let audioContext: AudioContext
    let analyser: AnalyserNode
    let dataArray: Uint8Array

    async function setupMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

        const mediaRecorder = new MediaRecorder(stream)
        setMediaRecorder(mediaRecorder)

        let recordedChunks: Blob[] = []

        mediaRecorder.addEventListener("start", () => {
          recordedChunks = []
        })

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data)
          }
        })

        mediaRecorder.addEventListener("stop", () => {
          onStop(
            new File([...recordedChunks], "audio", {
              type: AUDIO_TYPE,
            })
          )
        })

        audioContext = new AudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        const microphone = audioContext.createMediaStreamSource(stream)
        microphone.connect(analyser)

        dataArray = new Uint8Array(analyser.frequencyBinCount)

        const interval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray)
          const sum = dataArray.reduce((acc, val) => acc + val, 0)
          const avg = sum / dataArray.length
          const volume = Math.max(0, Math.min(100, avg)) // Normalize between 0 and 100
          setVolume(volume)
        }, 100)

        return () => {
          clearInterval(interval)
          analyser.disconnect()
          microphone.disconnect()
          audioContext.close()
          stream.getTracks().forEach((track) => track.stop())
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    setupMicrophone()
  }, [onStop])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }, [mediaRecorder])

  const startRecording = useCallback(() => {
    if (
      mediaRecorder &&
      (mediaRecorder.state === "inactive" || mediaRecorder.state === "paused")
    ) {
      mediaRecorder.start()
      setIsRecording(true)
    }
  }, [mediaRecorder])

  return { volume, isRecording, stopRecording, startRecording }
}
