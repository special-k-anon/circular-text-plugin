"use client"

import { useState, useEffect } from "react"
import { applyCircularTextToPenpot, isRunningInPenpot, initPenpotListeners } from "../lib/penpot-api"

export default function CircularTextPlugin() {
  const [text, setText] = useState("Circular Text Example")
  const [radius, setRadius] = useState(100)
  const [fontSize, setFontSize] = useState(14)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [fontWeight, setFontWeight] = useState(400)
  const [textPosition, setTextPosition] = useState("outside") // "outside" or "inside"
  const [rotation, setRotation] = useState(0) // 0-360 degrees
  const [isInPenpot, setIsInPenpot] = useState(false)
  const [isPluginReady, setIsPluginReady] = useState(false)

  // SVG viewBox dimensions
  const svgSize = 300
  const centerPoint = svgSize / 2

  // Create a circular path for text to follow
  // For inside text, we reverse the sweep flag in the arc commands
  const circlePath =
    textPosition === "outside"
      ? `
      M ${centerPoint},${centerPoint - radius}
      A ${radius},${radius} 0 1,1 ${centerPoint},${centerPoint + radius}
      A ${radius},${radius} 0 1,1 ${centerPoint},${centerPoint - radius}
    `
      : `
      M ${centerPoint},${centerPoint - radius}
      A ${radius},${radius} 0 1,0 ${centerPoint},${centerPoint + radius}
      A ${radius},${radius} 0 1,0 ${centerPoint},${centerPoint - radius}
    `

  // Check if we're running inside Penpot
  useEffect(() => {
    const inPenpot = isRunningInPenpot()
    setIsInPenpot(inPenpot)

    if (inPenpot) {
      initPenpotListeners(() => {
        setIsPluginReady(true)
        console.log("Plugin is ready to communicate with Penpot")
      })
    }
  }, [])

  const handleApplyEffect = () => {
    if (isInPenpot && isPluginReady) {
      // Apply the effect to Penpot
      applyCircularTextToPenpot(text, radius, fontSize, letterSpacing, fontWeight, textPosition, rotation)
    } else {
      // Show a message if not running in Penpot
      alert(
        "This plugin is designed to work inside Penpot. When used as a standalone app, this button would apply the effect to your Penpot design.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Penpot Circular Text Plugin</h1>
          <p className="text-gray-400 mt-2 text-center">Create and preview text along a circular path</p>
          {isInPenpot && (
            <div className="mt-2 px-3 py-1 bg-green-900 text-green-300 text-sm rounded-full">
              Running inside Penpot {isPluginReady ? "✓" : "- Initializing..."}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <div className="space-y-3">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-300">
                Text
              </label>
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/20 text-white transition-all"
                placeholder="Enter text to display in a circle"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="radius-slider" className="block text-sm font-medium text-gray-300">
                  Circle Radius
                </label>
                <span className="text-sm text-gray-400">{radius}px</span>
              </div>
              <input
                id="radius-slider"
                type="range"
                min="50"
                max="200"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="font-size-slider" className="block text-sm font-medium text-gray-300">
                  Font Size
                </label>
                <span className="text-sm text-gray-400">{fontSize}px</span>
              </div>
              <input
                id="font-size-slider"
                type="range"
                min="8"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="letter-spacing-slider" className="block text-sm font-medium text-gray-300">
                  Letter Spacing
                </label>
                <span className="text-sm text-gray-400">{letterSpacing}</span>
              </div>
              <input
                id="letter-spacing-slider"
                type="range"
                min="-2"
                max="10"
                step="0.5"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="font-weight-slider" className="block text-sm font-medium text-gray-300">
                  Font Weight
                </label>
                <span className="text-sm text-gray-400">{fontWeight}</span>
              </div>
              <input
                id="font-weight-slider"
                type="range"
                min="100"
                max="900"
                step="100"
                value={fontWeight}
                onChange={(e) => setFontWeight(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Text Position</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTextPosition("outside")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    textPosition === "outside" ? "bg-white text-black" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                  }`}
                >
                  Outside
                </button>
                <button
                  onClick={() => setTextPosition("inside")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    textPosition === "inside" ? "bg-white text-black" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                  }`}
                >
                  Inside
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="rotation-slider" className="block text-sm font-medium text-gray-300">
                  Rotation
                </label>
                <span className="text-sm text-gray-400">{rotation}°</span>
              </div>
              <input
                id="rotation-slider"
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <button
              onClick={handleApplyEffect}
              className="w-full mt-6 bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Apply Effect to Penpot
            </button>
          </div>

          <div className="flex justify-center items-center bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`} className="max-w-full">
              {/* Circle outline */}
              <circle cx={centerPoint} cy={centerPoint} r={radius} fill="none" stroke="#333" strokeWidth="1" />

              {/* Text path definition */}
              <defs>
                <path id="textCirclePath" d={circlePath} />
              </defs>

              {/* Text on the path */}
              <text
                fill="white"
                fontWeight={fontWeight}
                style={{
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`,
                }}
                transform={`rotate(${rotation}, ${centerPoint}, ${centerPoint})`}
              >
                <textPath href="#textCirclePath" startOffset="50%" textAnchor="middle">
                  {text}
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>
              {isInPenpot
                ? "Customize your circular text and click 'Apply Effect' to add it to your Penpot design."
                : "This plugin is designed to work inside Penpot. When used as a standalone app, the 'Apply Effect' button will show a demo message."}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
