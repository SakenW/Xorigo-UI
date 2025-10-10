import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import ComponentLibrary from "./pages/ComponentLibrary"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/components" element={<ComponentLibrary />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
