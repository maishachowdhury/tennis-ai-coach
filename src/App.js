import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";

function App() {
  const [image, setImage] = useState(null);
  const [compressedPreview, setCompressedPreview] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;

    const file = e.target.files[0];
    setImage(file);

    // Compress image
    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile); // keeps full "data:image/jpeg;base64,..." prefix
      reader.onload = () => setCompressedPreview(reader.result);
    } catch (err) {
      console.error("Compression error:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!compressedPreview) return;

    setLoading(true);
    setFeedback("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/responses",
        {
          model: "gpt-4o-mini",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: "Analyze this tennis grip and posture. Give actionable feedback in 2-3 sentences."
                },
                {
                  type: "input_image",
                  image_url: compressedPreview // full data URL, including prefix
                }
              ]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `, // replace with your token
          },
        }
      );

      const outputText = response.data.output_text || response.data.output?.[0]?.content?.[0]?.text;
      setFeedback(outputText || "No feedback received.");
    } catch (err) {
      console.error(err);
      setFeedback("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Tennis AI Coach</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {compressedPreview && (
        <div style={{ marginTop: "10px" }}>
          <p>Compressed Image Preview:</p>
          <img src={compressedPreview} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )}
      <button onClick={handleAnalyze} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {feedback && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <strong>Feedback:</strong>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;
