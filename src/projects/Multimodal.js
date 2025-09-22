import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import "../css/App.css"; // import CSS (adjust path if needed)

function Multimodal() {
  const [imageFile, setImageFile] = useState(null);
  const [compressedPreview, setCompressedPreview] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const [displayDims, setDisplayDims] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  // 🔑 Load cached results from localStorage
  const loadFromCache = (key) => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log("⚡ Loaded from localStorage cache:", parsed);
      setFeedback(parsed.feedback);
      setSummary(parsed.summary);
      setWarning(parsed.warning);
      setLoading(false);
      return true;
    }
    return false;
  };

  const handleImageChange = async (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setImageFile(file);

    const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1000, useWebWorker: true };
    try {
      const compressed = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onload = () => setCompressedPreview(reader.result);
    } catch (err) {
      console.error("compression error", err);
    }
  };

  const handleAnalyze = async () => {
    if (!compressedPreview) return;
    setLoading(true);
    setFeedback([]);
    setSummary("");
    setWarning("");
    setHoverIdx(null);

    const key = imageFile?.name || compressedPreview;

    if (loadFromCache(key)) return;

    try {
      console.log("🌐 Making API call for key:", key);
      const response = await axios.post(
        "https://api.openai.com/v1/responses",
        {
          model: "gpt-4o",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `
Analyze this tennis grip and posture.

Return your answer in TWO SECTIONS:

SECTION 1 (JSON only):
Output ONLY a JSON array of actionable points with coordinates (x,y as percentages between 0 and 1) and a short text label.

SECTION 2 (Summary):
After the JSON block, write 2–3 sentences in plain English summarizing the overall feedback.

Rules:
- Do not guess about features that are not visible.
- Always output both sections in this order.
                  `
                },
                { type: "input_image", image_url: compressedPreview }
              ]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
          },
        }
      );

      const rawText = response.data.output?.[0]?.content?.[0]?.text || "";

      let points = [];
      let summaryText = rawText;

      const jsonMatch = rawText.match(/\[([\s\S]*?)\]/);
      if (jsonMatch) {
        try {
          points = JSON.parse(jsonMatch[0]);
          summaryText = rawText.replace(jsonMatch[0], "").trim();
          summaryText = summaryText
            .replace(/SECTION 1[\s\S]*?SECTION 2\s*/i, "")
            .replace(/```[\s\S]*?```/g, "")
            .replace(/^\s*(#+\s*)?(Summary:|\(Summary\):)/i, "")
            .trim();
        } catch (err) {
          console.warn("Failed to parse JSON:", err);
        }
      }

      points = points
        .map((p) => ({
          x: Math.min(Math.max(Number(p.x) || 0, 0), 1),
          y: Math.min(Math.max(Number(p.y) || 0, 0), 1),
          text: String(p.text || p.label || p.description || "").trim(),
        }))
        .filter((p) => p.text);

      let warnMsg = "";
      if (points.length > 8) {
        warnMsg =
          "Note: AI generated many feedback points. Some markers may not match the photo exactly — this is a known limitation of vision models.";
      }

      const cachedResult = { feedback: points, summary: summaryText, warning: warnMsg };
      localStorage.setItem(key, JSON.stringify(cachedResult));
      console.log("💾 Saved to localStorage cache:", cachedResult);

      setFeedback(points);
      setSummary(summaryText);
      setWarning(warnMsg);
    } catch (err) {
      console.error(err);
      alert("API error: " + (err?.response?.data?.error?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const handleLoad = () => {
      const rect = img.getBoundingClientRect();
      setDisplayDims({ width: rect.width, height: rect.height });
    };
    img.addEventListener("load", handleLoad);
    if (img.complete) handleLoad();
    return () => img.removeEventListener("load", handleLoad);
  }, [compressedPreview]);

  return (
    <div className="App">
      <h2>Tennis AI Coach — Visual Feedback</h2>

      <div style={{ marginBottom: 12 }}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleAnalyze} disabled={!compressedPreview || loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: 650 }}>
        {compressedPreview ? (
          <>
            <img ref={imgRef} src={compressedPreview} alt="preview" style={{ width: "100%", borderRadius: 6 }} />

            {feedback.map((p, i) => {
              const left = displayDims.width ? p.x * displayDims.width : 0;
              const top = displayDims.height ? p.y * displayDims.height : 0;
              return (
                <div
                  key={i}
                  className="marker"
                  style={{ position: "absolute", left: left - 14, top: top - 14 }}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
                >
                  {i + 1}
                </div>
              );
            })}

            {hoverIdx != null && feedback[hoverIdx] && (
              <div
                className="tooltip"
                style={{
                  left: Math.max(8, feedback[hoverIdx].x * displayDims.width + 10),
                  top: Math.max(8, feedback[hoverIdx].y * displayDims.height - 10),
                }}
              >
                <strong>Feedback #{hoverIdx + 1}</strong>
                <div>{feedback[hoverIdx].text}</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ width: "100%", padding: 30, border: "1px dashed #ccc", borderRadius: 8, color: "#666" }}>
            Upload an image (JPEG/PNG) to see preview
          </div>
        )}
      </div>

      <h3>Overall Summary</h3>
      {summary ? (
        <div className="summary-box">{summary}</div>
      ) : (
        <div style={{ color: "#666" }}>No summary yet — upload an image and click Analyze.</div>
      )}

      {warning && (
        <div style={{ marginTop: 16, padding: "12px", borderRadius: 6, background: "#3c3d3f", color: "#FFD700" }}>
          {warning}
        </div>
      )}
    </div>
  );
}

export default Multimodal;
