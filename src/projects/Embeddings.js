import React from "react";

function Embeddings() {
  return (
    <div className="embeddings-doc">
      <h1>🔍 Embeddings Demo (Conceptual)</h1>
      <p>
        This page outlines a <strong>future feature idea</strong> for using
        embeddings to compare tennis racket grips. The APIs needed for image
        embeddings are not yet available, so this component serves as{" "}
        <em>documentation and concept design</em>.
      </p>

      <h2>💡 Idea</h2>
      <p>
        Imagine a system where players can <strong>upload a photo</strong> of
        their racket grip. The photo would be compared against a{" "}
        <strong>database of known good and bad grips</strong> (uploaded and
        labeled by experts). An <strong>embedding vector</strong> would be
        created for the photo, and then a <strong>similarity score</strong> would
        be calculated to determine how close the player’s grip is to an “ideal”
        grip.
      </p>

      <h2>🛠️ APIs Needed</h2>
      <ul>
        <li>
          <strong>Image Embeddings API</strong> – to convert grip photos into
          embedding vectors. (Currently, OpenAI provides text embeddings, but
          not production-ready image embeddings.)
        </li>
        <li>
          <strong>Vector Database</strong> (e.g. Pinecone, Weaviate, Milvus) – to
          store and search embeddings for known grips.
        </li>
        <li>
          <strong>Similarity Search</strong> – to compare the uploaded grip
          embedding against stored vectors and return a cosine similarity score.
        </li>
      </ul>

      <h2>🚀 Enhancements (Future Work)</h2>
      <ul>
        <li>
          Add <strong>categories of grips</strong> (e.g. Eastern Forehand, Western
          Forehand, Two-Handed Backhand) to provide more nuanced feedback.
        </li>
        <li>
          Include <strong>progress tracking</strong> so users can upload multiple
          photos over time and see how their grip consistency improves.
        </li>
        <li>
          Integrate with a <strong>coaching assistant agent</strong> that not
          only reports similarity scores but also recommends corrective drills or
          grip adjustments.
        </li>
      </ul>

      <h2>⚠️ Limitations</h2>
      <ul>
        <li>
          <strong>No production image embeddings API</strong> yet – this project
          is currently conceptual.
        </li>
        <li>
          Grip quality may depend on <strong>context</strong> (shot type,
          stance, biomechanics) that embeddings alone cannot capture.
        </li>
        <li>
          Requires a <strong>large, labeled dataset</strong> of grips annotated
          by coaches for the comparisons to be meaningful.
        </li>
      </ul>

      <h2>📚 References</h2>
      <ul>
        <li>
          <a
            href="https://platform.openai.com/docs/guides/embeddings"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI Embeddings Documentation
          </a>
        </li>
        <li>
          <a
            href="https://www.pinecone.io/learn/vector-database/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Intro to Vector Databases
          </a>
        </li>
      </ul>

      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        This page is included as a <strong>sample of developer documentation</strong> 
        for a feature idea. It explains the concept, required APIs, possible 
        extensions, and limitations so other developers could implement it once 
        the APIs exist.
      </p>
    </div>
  );
}

export default Embeddings;
