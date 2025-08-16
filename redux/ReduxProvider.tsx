"use client";

import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import Loader from "@/components/shared/Loader";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <Loader />
          </div>
        }
        persistor={persistor}
        onBeforeLift={() => console.log("🔥 Persisted state rehydrated")}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
