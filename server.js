const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define tools
const tools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Get the current weather for a city",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "findTennisCourts",
      description: "Find nearby tennis courts by city (mock data)",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string" },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "checkFriendsAvailability",
      description: "Check which friends are available (mock data)",
      parameters: {
        type: "object",
        properties: {
          names: {
            type: "array",
            items: { type: "string" },
            description: "Friends' names",
          },
        },
        required: ["names"],
      },
    },
  },
];

// Tool implementations
async function callTool(name, args) {
  if (name === "getWeather") {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${args.location}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const data = await res.json();
    return {
      forecast: data.weather[0].description,
      temp: `${data.main.temp}°C`,
    };
  }

  if (name === "findTennisCourts") {
    return [
      { name: "Victoria Park Courts", available: true },
      { name: "Riverside Tennis Club", available: false },
    ];
  }

  if (name === "checkFriendsAvailability") {
    return args.names.filter((n) => ["Sarah"].includes(n)); // mock: only Sarah free
  }

  return { error: `Unknown tool: ${name}` };
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a Tennis Coach Agent. When asked about playing tennis, prefer using tools (getWeather, findTennisCourts, checkFriendsAvailability). For anything else, respond helpfully in text.",
        },
        ...messages,
      ],
      tools,
    });

    const choice = completion.choices[0];
    const toolCalls = choice.message.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const results = [];

      for (const tool of toolCalls) {
        const toolName = tool.function.name;
        const toolArgs = JSON.parse(tool.function.arguments);
        console.log("Tool invoked:", toolName, toolArgs);

        const toolResult = await callTool(toolName, toolArgs);
        results.push({ tool: toolName, args: toolArgs, result: toolResult });
      }

      return res.json({
        reply: {
          reasoning: ["Agent used tools"],
          toolResults: results,
        },
      });
    }

    // Fallback: no tool call → return plain text
    return res.json({
      reply: { text: choice.message.content || "I'm not sure, but I'll do my best to help!" },
    });
  } catch (err) {
    console.error("Agent error:", err);
    res.status(500).send("Error calling agent");
  }
});

const PORT = 5001;
app.listen(PORT, () =>
  console.log(`Agent backend running on http://localhost:${PORT}`)
);
