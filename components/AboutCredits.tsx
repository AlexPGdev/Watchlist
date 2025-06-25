import React from "react"

export const AboutCredits = React.memo(function AboutCredits() {
  return (
    <div className="about-credits">
      <div className="about-section">
        <h2>About</h2>
        <p>
          Watchlist is an application created to help movie enthusiasts keep track of films they want to watch and share
          their movie journey with others.
        </p>
      </div>

      <div className="credits-section">
        <h2>Data Sources</h2>
        <div className="credits-content">
          <div className="credit-item">
            <ul>
              <li>
                Movie data provided by{" "}
                <a href="https://www.themoviedb.org" target="_blank" style={{ color: "#00ffff" }} rel="noreferrer">
                  <img
                    src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                    style={{ width: "80px" }}
                    alt="TMDB"
                  />
                </a>
              </li>
              <li>
                Streaming availability data provided by{" "}
                <a href="https://www.justwatch.com/" target="_blank" style={{ color: "#00ffff" }} rel="noreferrer">
                  <img
                    src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg"
                    style={{ width: "80px" }}
                    alt="JustWatch"
                  />
                </a>
              </li>
              <li>
                Additional movie data provided by{" "}
                <a href="https://www.omdbapi.com/" target="_blank" style={{ color: "white" }} rel="noreferrer">
                  OMDb API
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})
