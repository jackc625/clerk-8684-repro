import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { App } from "./App";

// Throwaway public dev-instance key for this reproduction (clerk/javascript#8684).
// A pk_test_ key is publishable by design — it ships in every client bundle and
// grants no dashboard or secret access — so committing it here is safe. It points
// at a disposable Clerk dev instance configured with "Email verification code"
// enabled. Override locally by setting VITE_CLERK_PUBLISHABLE_KEY in .env.
const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ??
  "pk_test_b24tbWFtbW90aC0zLmNsZXJrLmFjY291bnRzLmRldiQ";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </StrictMode>,
);
