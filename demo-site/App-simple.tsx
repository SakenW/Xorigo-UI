import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import SimpleTest from "./simple-test"
import LandingPage from "./pages/LandingPage"

export default function AppSimple() {
  return (
    <Routes>
      <Route path="/simple" element={<SimpleTest />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}