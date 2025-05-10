// This file contains utilities for interacting with the Penpot API

// Types for Penpot API
export interface PenpotSelection {
  objects: any[]
  type: string
}

// Send a message to Penpot
export function sendMessageToPenpot(type: string, payload: any) {
  window.parent.postMessage(
    {
      source: "plugin",
      type,
      payload,
    },
    "*",
  )
}

// Apply circular text to the selected object in Penpot
export function applyCircularTextToPenpot(
  text: string,
  radius: number,
  fontSize: number,
  letterSpacing: number,
  fontWeight: number,
  textPosition: string,
  rotation: number,
) {
  // Create SVG data for the circular text
  const svgSize = 300
  const centerPoint = svgSize / 2

  // Create a circular path based on text position
  const circlePath =
    textPosition === "outside"
      ? `M ${centerPoint},${centerPoint - radius} A ${radius},${radius} 0 1,1 ${centerPoint},${centerPoint + radius} A ${radius},${radius} 0 1,1 ${centerPoint},${centerPoint - radius}`
      : `M ${centerPoint},${centerPoint - radius} A ${radius},${radius} 0 1,0 ${centerPoint},${centerPoint + radius} A ${radius},${radius} 0 1,0 ${centerPoint},${centerPoint - radius}`

  // Create the SVG data
  const svgData = {
    type: "svg",
    content: {
      tag: "svg",
      attrs: {
        width: svgSize,
        height: svgSize,
        viewBox: `0 0 ${svgSize} ${svgSize}`,
      },
      content: [
        {
          tag: "defs",
          content: [
            {
              tag: "path",
              attrs: {
                id: "textCirclePath",
                d: circlePath,
              },
            },
          ],
        },
        {
          tag: "text",
          attrs: {
            fill: "currentColor",
            "font-size": fontSize,
            "font-weight": fontWeight,
            "letter-spacing": letterSpacing,
            transform: `rotate(${rotation}, ${centerPoint}, ${centerPoint})`,
          },
          content: [
            {
              tag: "textPath",
              attrs: {
                href: "#textCirclePath",
                startOffset: "50%",
                "text-anchor": "middle",
              },
              content: text,
            },
          ],
        },
      ],
    },
  }

  // Send the SVG data to Penpot
  sendMessageToPenpot("create-shape", svgData)
}

// Get the current selection from Penpot
export function getCurrentSelection(): Promise<PenpotSelection> {
  return new Promise((resolve) => {
    const messageHandler = (event: CustomEvent) => {
      window.removeEventListener("penpot-selection-changed", messageHandler as EventListener)
      resolve(event.detail as PenpotSelection)
    }

    window.addEventListener("penpot-selection-changed", messageHandler as EventListener)
    sendMessageToPenpot("get-selection", {})
  })
}

// Check if the plugin is running inside Penpot
export function isRunningInPenpot(): boolean {
  try {
    return window.parent !== window && window.parent.location.href.includes("penpot")
  } catch (e) {
    // If we can't access window.parent.location due to same-origin policy,
    // we're probably in an iframe, which is a good sign we're in Penpot
    return true
  }
}

// Initialize Penpot API listeners
export function initPenpotListeners(callback: () => void) {
  const pluginLoadedHandler = () => {
    window.removeEventListener("penpot-plugin-loaded", pluginLoadedHandler)
    callback()
  }

  window.addEventListener("penpot-plugin-loaded", pluginLoadedHandler)
}
