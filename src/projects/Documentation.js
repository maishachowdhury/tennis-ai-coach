import React from "react";

function Documentation() {
  return (
    <div className="doc-page">
      <h1>AI Demos Documentation</h1>
      <p>
        Welcome to my portfolio of AI demos. Each demo showcases a key capability of OpenAI’s models,
        with explanations of technologies, simple definitions of important terms, references to the
        official documentation, and notes about scaling and limitations. Video walkthroughs will be
        embedded here in the future.
      </p>

      <section>
        <h2>🎾 Multimodal (Tennis Coach)</h2>
        <p>
          <strong>Technologies:</strong> GPT-4o multimodal, React, Canvas/Tooltip overlays.
        </p>
        <p>
          <strong>Key Terms:</strong> <em>Multimodal</em> = combining text + images in a single request.  
          <em>Tooltip Overlay</em> = visual feedback markers displayed over uploaded images.
        </p>
        <p>
          <strong>Limitations:</strong> Current LLMs sometimes hallucinate body parts or mislabel coordinates.
          For accuracy, you’d combine this with a vision library like MediaPipe Hands.
        </p>
        <p>
          <strong>Scaling:</strong> For production, you’d add backend APIs, GPU hosting for vision models, and
          persistent storage of feedback. Caching (localStorage or DB) saves costs for repeat uploads.
        </p>
        <p>
          <strong>Enhancements:</strong> Frame-by-frame video analysis, audio commentary from coaches, and 
          integration with pose detection.
        </p>
        <p>
          <a href="https://platform.openai.com/docs/guides/vision" target="_blank" rel="noreferrer">
            📖 Reference: OpenAI Vision Docs
          </a>
        </p>
        <div className="video-placeholder">[ Video Demo Coming Soon ]</div>
      </section>

      <section>
        <h2>🔍 Embeddings Search</h2>
        <p>
          <strong>Technologies:</strong> OpenAI text-embedding-3-small, Vector DB (e.g. Pinecone).
        </p>
        <p>
          <strong>Key Terms:</strong> <em>Embedding</em> = numeric vector representation of text that enables 
          semantic search.
        </p>
        <p>
          <strong>Limitations:</strong> Embeddings need frequent refresh if your data updates often. Vector DB
          cost scales with dataset size.
        </p>
        <p>
          <a href="https://platform.openai.com/docs/guides/embeddings" target="_blank" rel="noreferrer">
            📖 Reference: OpenAI Embeddings Docs
          </a>
        </p>
        <div className="video-placeholder">[ Video Demo Coming Soon ]</div>
      </section>

      <section>
        <h2>🤖 Agents Demo</h2>
        <p>
          <strong>Technologies:</strong> GPT-4.1, tool calling, APIs (weather, scores).
        </p>
        <p>
          <strong>Key Terms:</strong> <em>Agent</em> = LLM that can call external tools/APIs to complete tasks.
        </p>
        <p>
          <a href="https://platform.openai.com/docs/guides/function-calling" target="_blank" rel="noreferrer">
            📖 Reference: OpenAI Function Calling
          </a>
        </p>
        <div className="video-placeholder">[ Video Demo Coming Soon ]</div>
      </section>

      <section>
        <h2>💻 Codegen / SQL</h2>
        <p>
          <strong>Technologies:</strong> GPT-4.1, Codex-style prompting.
        </p>
        <p>
          <strong>Key Terms:</strong> <em>Code Generation</em> = prompting an LLM to write or explain code.
        </p>
        <p>
          <a href="https://platform.openai.com/docs/guides/code" target="_blank" rel="noreferrer">
            📖 Reference: OpenAI Code Docs
          </a>
        </p>
        <div className="video-placeholder">[ Video Demo Coming Soon ]</div>
      </section>
    </div>
  );
}

export default Documentation;
