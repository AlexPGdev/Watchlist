interface StatsProps {
  stats: {
    total: number
    watched: number
    toWatch: number
  }
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-number">{stats.total}</div>
        <div className="stat-label">Total Movies</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.watched}</div>
        <div className="stat-label">Watched</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.toWatch}</div>
        <div className="stat-label">To Watch</div>
      </div>
    </div>
  )
}
