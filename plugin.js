// This is the main entry point for the Penpot plugin
// It registers the plugin with Penpot and sets up message handlers

// Declare the penpot variable
let penpot

function runPlugin() {
  // Register the plugin with Penpot
  penpot.api.register({
    name: "Circular Text Plugin",
    version: "1.0.0",
    author: "Penpot Plugin Creator",
    description: "Create text along a circular path",
    iconSVG: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
    main: "index.html",
  })

  // Listen for messages from Penpot
  window.addEventListener("message", handlePenpotMessage)

  // Initialize the plugin UI
  console.log("Circular Text Plugin initialized")
}

// Handle messages from Penpot
function handlePenpotMessage(event) {
  const message = event.data

  // Only process messages from Penpot
  if (message.source !== "penpot") return

  console.log("Received message from Penpot:", message)

  // Handle different message types
  switch (message.type) {
    case "selection-changed":
      // Update the plugin UI based on the current selection
      window.dispatchEvent(
        new CustomEvent("penpot-selection-changed", {
          detail: message.payload,
        }),
      )
      break

    case "plugin-loaded":
      // Plugin has been loaded in Penpot
      window.dispatchEvent(new CustomEvent("penpot-plugin-loaded"))
      break

    default:
      // Handle other message types if needed
      break
  }
}

// Run the plugin when the window loads
window.addEventListener("load", runPlugin)
