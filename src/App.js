import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./css/App.css";

import Documentation from "./projects/Documentation";
import Multimodal from "./projects/Multimodal";
import Embeddings from "./projects/Embeddings";
import ChatAgent from "./projects/ChatAgent";
import Codegen from "./projects/Codegen";

function App() {
  return (
    <Router>
      <div className="layout">
        <aside className="sidebar">
          <h2 className="sidebar-title">AI Demos</h2>
          <nav>
            <ul>
              <li><NavLink to="/docs" className={({ isActive }) => isActive ? "active-link" : ""}>📑 Documentation</NavLink></li>
              <li><NavLink to="/multimodal" className={({ isActive }) => isActive ? "active-link" : ""}>🎾 Multimodal</NavLink></li>
              <li><NavLink to="/embeddings" className={({ isActive }) => isActive ? "active-link" : ""}>🔍 Embeddings</NavLink></li>
              <li><NavLink to="/agents" className={({ isActive }) => isActive ? "active-link" : ""}>🤖 Agents</NavLink></li>
              <li><NavLink to="/codegen" className={({ isActive }) => isActive ? "active-link" : ""}>💻 Codegen</NavLink></li>
            </ul>
          </nav>
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/docs" replace />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/multimodal" element={<Multimodal />} />
            <Route path="/embeddings" element={<Embeddings />} />
            <Route path="/agents" element={<ChatAgent />} />
            <Route path="/codegen" element={<Codegen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
