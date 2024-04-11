import React, { useEffect, useMemo, useState } from "react";

import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Workbox } from "workbox-window";

import { LogAllow } from "@_constants/global";
import MainPage from "@_pages/main";
import * as BrowserFS from "browserfs";
import { FSModule } from "browserfs/dist/node/core/FS";

export default function App() {
  // setup nohost-serviceworker
  const [nohostReady, setNohostReady] = useState(false);
  const [browserFSReady, setBrowserFSReady] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const wb = new Workbox("/nohost-sw.js?route=rnbw");
      wb.register().then(() => {
        setNohostReady(true);
        LogAllow && console.log("nohost ready");
      });
    }
  }, []);

  useEffect(() => {
    // Initialize BrowserFS
    BrowserFS.configure(
      {
        fs: "IndexedDB", // Choose the backend (e.g., IndexedDB)
        options: {}, // Backend-specific options
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        }

        // Assign fs to window object
        window.fs = BrowserFS.BFSRequire("fs");
        setBrowserFSReady(true);
      },
    );
  }, []);

  return useMemo(() => {
    return (
      <>
        {nohostReady && browserFSReady ? (
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/:project/*" element={<MainPage />} />
            </Routes>
          </Router>
        ) : null}
      </>
    );
  }, [nohostReady, browserFSReady]);
}

// extend global interfaces for nohost
declare global {
  interface Window {
    fs: FSModule;
  }
}
