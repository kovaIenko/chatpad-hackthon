import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {App} from "./components/App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google"

import { NextUIProvider } from "@nextui-org/react"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

console.log(GOOGLE_CLIENT_ID)
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
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
