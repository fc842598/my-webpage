import { createRoot } from "react-dom/client";
import Home from "./page";

const mountNode = document.getElementById("ziwei-training-root");

if (!mountNode) {
  throw new Error("Missing #ziwei-training-root mount node");
}

createRoot(mountNode).render(<Home />);
