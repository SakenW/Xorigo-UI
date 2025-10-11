import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { DTCGStyleRecipeProvider } from "../src/style-recipe/provider/DTCGStyleRecipeProvider"
import LandingPage from "./pages/LandingPage"
import ComponentLibrary from "./pages/ComponentLibrary"
import UnifiedRecipeDemo from "./components/UnifiedRecipeDemo"

export default function App() {
  return (
    <DTCGStyleRecipeProvider
      defaultRecipe="light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow"
      enableTransitions={true}
      transitionDuration={400}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/components" element={<ComponentLibrary />} />
        <Route path="/recipes" element={<UnifiedRecipeDemo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DTCGStyleRecipeProvider>
  )
}
