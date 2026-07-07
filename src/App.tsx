import { SignUp } from "@clerk/react";

// The entire reproduction: the prebuilt <SignUp/> widget, nothing else.
// `routing="hash"` avoids needing a router — the two-POST behavior is
// independent of the routing strategy.
export function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <SignUp routing="hash" />
    </div>
  );
}
