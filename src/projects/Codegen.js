import React from "react";

function Codegen() {
  return (
    <div className="codegen-doc">
      <h1>💻 Codegen Demo (Conceptual) — using Codex / Code Models</h1>
      <p>
        This page describes a proposed feature: using OpenAI’s code models
        (e.g. Codex / GPT-4 / GPT-5 variants) to convert tennis performance data
        into rich dashboards and analytics. While a full implementation isn't
        built yet, this doc covers the idea, necessary APIs, integration with
        agents, enhancements, and limitations.
      </p>

      <h2>📘 Background: Codex & Code Models</h2>
      <p>
        Codex is OpenAI’s agentic coding model, designed to generate, modify,
        inspect, and run code in sandboxed environments. It can read codebases,
        generate features/tests, propose pull requests, and execute tasks in
        isolated environments. While usable via the OpenAI API for code
        generation, performance and stability (especially for complex multi-step
        code) remain challenging in practice.
      </p>

      <h2>💡 Feature Idea</h2>
      <p>
        Users upload performance data (CSV, Excel, JSON, or simple text logs)
        from drills, matches, or training sessions. The system transforms that
        data into analytics dashboards automatically. The vision: write a
        natural-language prompt like:
      </p>
      <blockquote>
        “Create a dashboard showing my serve accuracy trend, rally length over
        time, and a comparison against my last 5 sessions.”
      </blockquote>
      <p>
        Then Codex (or a code model) generates the analytic code (JavaScript,
        Python, or similar), a runtime executes it, and the frontend renders
        visual charts.
      </p>

      <h2>🛠️ APIs & Components You’d Need</h2>
      <ul>
        <li>
          <strong>File Upload + Parser API</strong> – to ingest CSV/Excel/JSON
          files and turn them into structured records.
        </li>
        <li>
          <strong>Code Generation Endpoint</strong> – using OpenAI’s Codex/code
          models to generate analysis scripts or transformations.
        </li>
        <li>
          <strong>Code Execution / Sandbox Engine</strong> – a secure runtime to
          execute generated code (e.g. Python, JS).
        </li>
        <li>
          <strong>Visualization Libraries</strong> – D3.js, Plotly, Recharts to
          produce dashboards.
        </li>
        <li>
          <strong>Agent Orchestrator</strong> – to combine parsing, codegen,
          execution, and visualization into one workflow.
        </li>
      </ul>

      <h2>🔗 Integration with Agents</h2>
      <ol>
        <li>Receive user query + upload (e.g. “Show me accuracy trends”).</li>
        <li>Call parser API to normalize data.</li>
        <li>
          Call Codex/code model with instruction + schema to generate code.
        </li>
        <li>Execute code in sandbox and capture results.</li>
        <li>Return charts + JSON + reasoning logs to frontend.</li>
      </ol>
      <p>
        The agent could also support edits/iteration: “Change the window to last
        3 months” → regenerate or patch the code.
      </p>

      <h2>🚀 Enhancements (Future Work)</h2>
      <ul>
        <li>
          Support <strong>custom metrics</strong> so users can define KPIs in
          plain English.
        </li>
        <li>
          Provide <strong>narrative insights</strong> with each chart (e.g.
          “Serve consistency dropped on day 3”).
        </li>
        <li>
          Enable <strong>multi-user comparisons</strong> (e.g. teammates).
        </li>
        <li>
          Auto-generate <strong>progress reports</strong> (“Consistency improved
          12% over 4 weeks”).
        </li>
        <li>
          Export code/notebook for power users to inspect or tweak.
        </li>
      </ul>

      <h2>⚠️ Limitations & Risks</h2>
      <ul>
        <li>
          <strong>Performance & Latency</strong> – generating complex code +
          running it can be slow.
        </li>
        <li>
          <strong>Incorrect or Unsafe Code</strong> – models may output buggy or
          insecure code.
        </li>
        <li>
          <strong>Sandboxing</strong> – execution must be safe and resource
          limited.
        </li>
        <li>
          <strong>Data Quality</strong> – messy or inconsistent input data may
          break parsing.
        </li>
        <li>
          <strong>Hallucinations</strong> – model might invent metrics not in
          the dataset.
        </li>
      </ul>

      <h2>📚 References</h2>
      <ul>
        <li>
          <a
            href="https://platform.openai.com/docs/codex/overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI Codex / Code Models Guide
          </a>
        </li>
        <li>
          <a
            href="https://platform.openai.com/docs/guides/code"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI Code Guide (Completions + Function Calling)
          </a>
        </li>
      </ul>

      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        This component is a <strong>developer-facing design doc</strong>. It
        outlines how a Codegen feature could be implemented with OpenAI’s code
        models, what APIs are needed, possible enhancements, and current
        limitations.
      </p>
    </div>
  );
}

export default Codegen;
