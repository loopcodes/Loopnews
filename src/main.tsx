import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ScrollToTop from "react-scroll-to-top";
import { BookmarksProvider } from "./context/BookmarksContext";
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BookmarksProvider>
      <App />
      <ScrollToTop
        smooth
        color="white"
        style={{
          backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </BookmarksProvider>
  </StrictMode>
);
