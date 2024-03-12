import cors from "cors";
import express from "express";
import "dotenv/config";
import { OpenAI } from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const { GPT3, GPT4 } = process.env;

app.post("/chat", async (req: express.Request, res: express.Response) => {
    const plan = req.body.plan.toUpperCase();
    const message = req.body.text;
    const messages = req.body.messages;
    const user_id = req.body.user_id;

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
            ...messages.map((message: { role: any; content: any }) => ({
                role: message.role,
                content: message.content,
            })),
            {
                role: "user",
                content: message,
            },
        ],
        model: model,
    });
    //https://51.20.105.60.nip.io:3001/messages/create
    //http://localhost:8080/messages/create
    await fetch("https://51.20.105.60.nip.io:3001/messages/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role: "user",
            content: message,
            user_id,
        }),
    });
    //https://51.20.105.60.nip.io:3001/messages/create
    //http://localhost:8080/messages/create
    await fetch("https://51.20.105.60.nip.io:3001/messages/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...chatCompletion.choices[0].message,
            user_id,
        }),
    });
    res.json({
        message: chatCompletion.choices[0].message.content,

        messages: [
            ...messages,
            {
                role: "user",
                content: message,
                created_at: new Date().toISOString(),
            },
            {
                ...chatCompletion.choices[0].message,
                created_at: new Date().toISOString(),
            },
        ],
    });
    return chatCompletion.choices[0].message.content;
});

app.get("/", (req: express.Request, res: express.Response) => {
    res.json({ message: "Hello from server!" });
});

app.listen(8080, () => console.log("Server running on PORT 8080"));
