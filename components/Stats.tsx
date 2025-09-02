import React, { useEffect, useState } from "react"

interface StatsProps {
  stats: {
    total: number
    watched: number
    toWatch: number
    dailyStreak: number
  }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function useAnimatedNumber(target: number, duration = 2500) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    let start: number | null = null
    const from = value
    const to = target

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)

      setValue(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [target, duration])

  return value
}

export const Stats = React.memo(function Stats({ stats }: StatsProps) {
  const animatedTotal = useAnimatedNumber(stats.total)
  const animatedWatched = useAnimatedNumber(stats.watched)
  const animatedToWatch = useAnimatedNumber(stats.toWatch)
  const animatedStreak = useAnimatedNumber(stats.dailyStreak)

  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-number">{animatedTotal}</div>
        <div className="stat-label">Total Movies</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{animatedWatched}</div>
        <div className="stat-label">Watched</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{animatedToWatch}</div>
        <div className="stat-label">To Watch</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{animatedStreak || 0}</div>
        <div className="stat-label">Daily Streak</div>
      </div>
    </div>
  )
})
