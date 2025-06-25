"use client"

import { memo } from "react"

export const Footer = memo(function Footer() {
    return (
        <footer style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            Made with <span>❤️</span> by <a href="https://github.com/AlexPGdev" target="_blank" style={{ color: "white" }}>AlexPG</a>
            <br />
            <p style={{ fontSize: "13px" }}>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </footer>
    )
})