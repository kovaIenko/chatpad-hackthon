import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google"

import { NextUIProvider } from "@nextui-org/react"
import { App } from "./components/App";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

console.log(GOOGLE_CLIENT_ID)
ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <NextUIProvider>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<App />
		</GoogleOAuthProvider>
	</NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
