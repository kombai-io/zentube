import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.zenTube";
import ErrorBoundary from "@kombai/react-error-boundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</StrictMode>
);