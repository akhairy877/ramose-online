import "./global.css";
import { createRoot } from "react-dom/client";
import App from "./App";

// Create root only once and reuse it
const container = document.getElementById("root")!;
let root: any;

if (!root) {
  root = createRoot(container);
}

root.render(<App />);
