import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./components/ui/AuthenticationGuard";
import { CurrencyProvider } from "./context/CurrencyContext";
import { DatabaseProvider } from "./context/DatabaseContext";

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <DatabaseProvider>
          <Routes />
        </DatabaseProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;