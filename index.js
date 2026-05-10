import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const chatHistory = req.body.history || [];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "Kamu adalah 'NusaBot', asisten virtual ahli kuliner Indonesia. Tugasmu adalah memberikan informasi, resep, sejarah, dan rekomendasi masakan khas Nusantara dengan bahasa yang asik, ramah, dan kekinian ala anak muda. Jika pengguna bertanya di luar topik makanan, minuman, atau kuliner, tolak dengan sopan dan arahkan kembali ke topik kuliner Indonesia.",
        });

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text();

     res.json({ result: responseText });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Waduh, servernya lagi masak nih. Coba lagi ya!" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server kuliner jalan di http://localhost:${port}`);
});