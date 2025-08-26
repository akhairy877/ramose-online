import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root")!;

// Check if we already have a root to avoid creating multiple roots
// This prevents the warning during hot module replacement
if (!container._reactRoot) {
  const root = createRoot(container);
  container._reactRoot = root;
  root.render(<App />);
} else {
  // Reuse existing root for hot reloads
  container._reactRoot.render(<App />);
}
