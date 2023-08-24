import * as React from "react"

export function useTimer(duration: number) {
  const [isRunning, setIsRunning] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    if (!isRunning) return
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === undefined) return duration
        if (prev === 0) {
          setIsRunning(false)
          return prev
        }
        return prev - 1
      })
    }, 1000)

    if (timeLeft === 0) clearInterval(intervalId)

    return () => clearInterval(intervalId)
  }, [duration, isRunning, timeLeft])

  const onStart = () => {
    setIsRunning(true)
    setTimeLeft(duration)
  }

  return { timeLeft, start: onStart }
}
