"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface StreamingPopupProps {
  isVisible?: boolean
  streamingServices?: any
  movieTitle?: string
  position?: { x: number; y: number }
  onClose?: () => void
}


export function StreamingPopup({ isVisible = false, streamingServices, movieTitle, position, onClose }: StreamingPopupProps) {
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".streaming-popup") && !target.closest(".movie-watch")) {
        if (onClose) {
          onClose()
        }
      }
    }

    if (isVisible) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      className="streaming-popup"
      style={{
        left: `${position?.x}px`,
        top: `${position?.y}px`,
        display: "block",
      }}
    >
      <div style={{cursor: "pointer", marginBottom: "15px", opacity: hovered ? "0.8" : "1"}} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} onClick={() => open(streamingServices.DE.link)}>
        {streamingServices?.DE ? (
          <div>
            {streamingServices.DE.flatrate && streamingServices.DE.flatrate.length > 0 && streamingServices.DE.flatrate[0].display_priority < 21 ? (
              <div style={{fontWeight: "bold", marginBottom: "5px", textDecoration: "none", color: "white"}}>Stream</div>
            ) : ""}
            {streamingServices.DE.flatrate?.filter((service: any) => service.display_priority < 21).slice(0, 3).map((service: any) => (
              <a key={service.provider_id} style={{display: "flex", alignItems: "center", marginBottom: "0.4rem", textDecoration: "none", color: "white", "fontWeight": "600", gap: "10px"}}>
                <img
                  src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                  alt={service.provider_name}
                  style={{width: "30px", height: "30px", borderRadius: "4px"}}
                />
                <span>{service.provider_name}</span>
              </a>
            ))}
            {streamingServices.DE.buy && streamingServices.DE.buy.length > 0 && streamingServices.DE.buy[0].display_priority < 21 ? (
              <div style={{fontWeight: "bold", marginBottom: "5px", textDecoration: "none", color: "white"}}>Buy / Rent</div>
            ) : ""}
            {streamingServices.DE.buy?.filter((service: any) => service.display_priority < 21).slice(0, 3).map((service: any) => (
              <a key={service.provider_id} style={{display: "flex", alignItems: "center", marginBottom: "0.4rem", textDecoration: "none", color: "white", "fontWeight": "600", gap: "10px"}}>
                <img
                  src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
                  alt={service.provider_name}
                  style={{width: "30px", height: "30px", borderRadius: "4px"}}
                />
                <span>{service.provider_name}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="no-streaming">No streaming services available</div>
        )}
        
      </div>
      <a href="https://www.justwatch.com/" target="_blank" style={{color: "white", textDecoration: "none", fontSize: "13px"}}>Source:
        <img 
          src="https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg"
          style={{width: "70px", marginLeft: "10px", marginBottom: "4px"}}
        />
      </a>
      <br/>
      <a href="https://www.themoviedb.org" target="_blank" style={{color: "white", textDecoration: "none", fontSize: "13px"}}>Provided by:
        <img 
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          style={{width: "70px", marginLeft: "10px", marginBottom: "4px"}}
        />
      </a>
    </div>
  )
}
