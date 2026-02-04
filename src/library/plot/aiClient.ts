import axios from "axios";
import axiosRetry from "axios-retry";

const client = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 25_000,
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNRESET"
    );
  },
});

export async function callAI(
  system: string,
  user: string,
  temperature: number
) {
  const res = await client.post("/chat/completions", {
    model: "llama-3.1-8b-instant",
    temperature,
    max_tokens: 1200,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.data.choices[0].message.content.trim();
}
