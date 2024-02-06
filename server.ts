import cors from "cors";
import express from "express";
import "dotenv/config";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const { GPT3, GPT4 } = process.env;

app.post("/chat", async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  const plan = req.body.plan.toUpperCase();
  const message = req.body.text;

  let apiKey = GPT3,
    model = "gpt-3.5-turbo";
  if (plan === "ZYRUS-3") {
    apiKey = GPT3;
    model = "gpt-3.5-turbo";
    console.log("GPT-3.5 Turbo");
  } else if (plan === "ZYRUS-4") {
    apiKey = GPT4;
    model = "gpt-4";
    console.log("GPT-4");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: model,
  });
  console.log(chatCompletion.choices[0].message.content);
  res.json({ message: chatCompletion.choices[0].message.content });
  return chatCompletion.choices[0].message.content;
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Hello from server!" });
});

app.listen(8080, () => console.log("Server running on PORT 8080"));
