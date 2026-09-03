import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import cors from 'cors';
import helmet from 'helmet';
import open from 'open';
import mammoth from 'mammoth';
import ExcelJS from 'exceljs';
import axios from 'axios';
import { OpenAI } from 'openai';

const app = express();

// OpenAI SDK Initialize
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE"
});

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Multer Memory Setup
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 } 
});

// 🕒 Helper Function to Get Accurate Current Date (Indian Standard Time)
function getCurrentIndianDate() {
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date());
}

// 🧠 Unified AI Helper Function with Ultra-Strict Factuality & Zero-Hallucination Rules
async function getAIResponse(prompt, history = [], imageBase64 = null) {
    try {
        let userContent = prompt;
        const todayDateStr = getCurrentIndianDate(); 

        if (imageBase64) {
            let formattedImage = imageBase64;
            if (!formattedImage.startsWith('data:image/')) {
                formattedImage = `data:image/jpeg;base64,${formattedImage}`;
            }

            userContent = [
                { type: "text", text: prompt || "આ ચિત્રનું વિગતવાર વર્ણન કરો." },
                { 
                    type: "image_url", 
                    image_url: { 
                        url: formattedImage 
                    } 
                }
            ];
        }

        const messages = [
            { 
                role: "system", 
                content: `You are an official multi-purpose AI educational and administrative assistant for Gujarat & India (Sarkar Smart AI).
CURRENT REAL-TIME CONTEXT: Today is ${todayDateStr}.

🚨 ABSOLUTE ZERO-HALLUCINATION & STRICT TRUTH POLICY:
1. NEVER INVENT OR GUESS: Do not fabricate facts, statistics, local histories, names, rules, or unverified data. You must behave with extreme factual accuracy.
2. MANDATORY HONEST UNCERTAINTY: If a user asks about a local, specific, or difficult question and you do not possess 100% verified, real-time, or official data, you MUST NOT make up an answer. Instead, reply strictly in pure Gujarati: "આ અંગે મારી પાસે સચોટ કે અધિકૃત માહિતી ઉપલબ્ધ નથી."
3. LANGUAGE MATCHING: Always reply in the exact same language in which the user asks (e.g., pure Gujarati for Gujarati, English for English).
4. GOVERNMENT & EDUCATIONAL PRIORITY: Prioritize official standards (GCERT, NCERT, Digital Gujarat, GOI/GOG portals).
5. ACCURATE SOURCE CITATION: At the end of your response, state the actual source (e.g., [Source: GCERT / NCERT Official Curriculum], [Source: Google News Live RSS], [Source: Digital Gujarat Portal]). If information is unverified, state [Source: Verified AI Knowledge Limitation].` 
            },
            ...history.map(h => ({
                role: h.role === 'model' ? 'assistant' : h.role,
                content: h.parts ? h.parts[0].text : h.content
            })),
            { role: "user", content: userContent }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.0, // 👈 0.0 કરવાથી AI સરાસર કાલ્પનિક વાતો કરવાનું બંધ કરીને એકદમ સચોટ અને ટૂંકો સાચો જવાબ જ આપશે.
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("AI Generation Error:", err);
        return "⚠️ AI મોડેલમાંથી જવાબ મેળવવામાં ક્ષતિ આવી છે. [Source: AI System Error Handler]";
    }
}

// 💬 1. Standard Chat & Vision Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, imageBase64, history } = req.body;
        let promptText = message || "આ બાબતે વિગતવાર સમજાવો.";
        const todayDateStr = getCurrentIndianDate();

        const lowerMsg = promptText.toLowerCase();
        
        if (lowerMsg.includes('સમાચાર') || lowerMsg.includes('news') || lowerMsg.includes('live') || lowerMsg.includes('સ્કોર') || lowerMsg.includes('score') || lowerMsg.includes('match') || lowerMsg.includes('ક્રિકેટ')) {
            let liveNewsContext = "";
            try {
                const rssUrl = 'https://news.google.com/rss?hl=gu&gl=IN&ceid=IN:gu';
                const response = await axios.get(rssUrl, { timeout: 5000 });
                if (response.data) {
                    liveNewsContext = response.data;
                }
            } catch (err) {
                console.error("RSS Fetch Error:", err.message);
            }

            promptText = `આજે તારીખ ${todayDateStr} છે. યુઝરનો સવાલ છે: "${message}". 
જો આ સવાલ લાઈવ ક્રિકેટ સ્કોર અથવા એવી રમત સાથે સંકળાયેલ હોય જે નીચે આપેલા ન્યૂઝ ફીડમાં ઉપલબ્ધ નથી, તો કોઈપણ કાલ્પનિક સ્કોર ન આપતા સ્પષ્ટ કરો કે લાઈવ સ્કોર ઉપલબ્ધ નથી અને [Cricbuzz](https://www.cricbuzz.com) જોવા માટે કહો. જો સામાન્ય સમાચારો હોય તો નીચેના ગૂગલ ન્યૂઝ ફીડના આધારે સાચી માહિતી આપો અને જવાબના અંતે [Source: Google News Live RSS] લખો:\n\n${liveNewsContext.substring(0, 4000)}`;
        }

        let reply = await getAIResponse(promptText, history || [], imageBase64);
        
        res.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ reply: "⚠️ સર્વર એરર આવી. [Source: System Error Handler]" });
    }
});

// 🎨 2. Image Generator Endpoint (Temporarily Disabled)
app.post('/api/generate-image', async (req, res) => {
    try {
        res.json({
            reply: "⚠️ હાલમાં ઈમેજ જનરેશન સર્વિસ બંધ છે, આ સુવિધા હવે પછીના અપડેટમાં આવશે."
        });
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ reply: "⚠️ સર્વિસ કામ નથી કરી રહી." });
    }
});

// 🧮 3. Sidebar Maths Solver Vision Endpoint
app.post('/api/solve-math', async (req, res) => {
    try {
        const { imageBase64, comment } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ reply: "⚠️ કૃપા કરીને ગણિતના દાખલાનો ફોટો અપલોડ કરો." });
        }

        let formattedImage = imageBase64;
        if (!formattedImage.startsWith('data:image/')) {
            formattedImage = `data:image/jpeg;base64,${formattedImage}`;
        }

        const mathPrompt = [
            { 
                type: "text", 
                text: comment || "આ ફોટામાં આપેલા ગણિતના દાખલાને ધ્યાનથી વાંચો અને સ્ટેપ-બાય-સ્ટેપ સાચો જવાબ શુદ્ધ ગુજરાતીમાં આપો. જવાબના અંતે [Source: AI Vision Math Solver] ચોક્કસ લખો." 
            },
            { 
                type: "image_url", 
                image_url: { 
                    url: formattedImage 
                } 
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert Mathematics teacher. Solve math problems accurately with clear steps in pure Gujarati script."
                },
                { role: "user", content: mathPrompt }
            ],
            temperature: 0.0,
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Math Solver Error:", error);
        res.status(500).json({ reply: "⚠️ ગણિતનો દાખલો સોલ્વ કરવામાં એરર આવી. [Source: Math Solver Error]" });
    }
});

// 💪 4. Health & Fitness Calculator Endpoint
app.post('/api/calculate-fitness', async (req, res) => {
    try {
        const { gender, age, height, weight, activity, message, history } = req.body;
        
        const uAge = parseFloat(age) || 42;
        const uHeight = parseFloat(height) || 148;
        const uWeight = parseFloat(weight) || 73.2;
        const uGender = gender || "પુરુષ";
        const uActivity = activity || "સક્રિય";

        const heightM = uHeight / 100;
        const bmi = (uWeight / (heightM * heightM)).toFixed(1);

        let bmr = 0;
        if (uGender.toLowerCase() === 'female' || uGender.includes('સ્ત્રી')) {
            bmr = (10 * uWeight) + (6.25 * uHeight) - (5 * uAge) - 161;
        } else {
            bmr = (10 * uWeight) + (6.25 * uHeight) - (5 * uAge) + 5;
        }

        let multiplier = 1.2;
        if (uActivity.includes('Moderate') || uActivity.includes('મધ્યમ')) multiplier = 1.375;
        else if (uActivity.includes('Active') || uActivity.includes('સક્રિય')) multiplier = 1.55;
        else if (uActivity.includes('Very') || uActivity.includes('ખૂબ')) multiplier = 1.725;

        const tdee = Math.round(bmr * multiplier);
        let weightStatus = "નોર્મલ વજન";
        if (bmi < 18.5) weightStatus = "અંડરવેટ (ઓછું વજન)";
        else if (bmi >= 25 && bmi < 30) weightStatus = "ઓવરવેટ (વધારાનું વજન)";
        else if (bmi >= 30) weightStatus = "મેદસ્વી (ઓબેઝ)";

        const idealWeightMin = (18.5 * (heightM * heightM)).toFixed(1);
        const idealWeightMax = (24.9 * (heightM * heightM)).toFixed(1);

        let prompt = `એક હેલ્થ એક્સપર્ટ તરીકે નીચે આપેલા ડેટાના આધારે વિગતવાર ફિટનેસ રિપોર્ટ શુદ્ધ ગુજરાતી ભાષામાં તૈયાર કરો:
- લિંગ: ${uGender}
- ઉંમર: ${uAge} વર્ષ
- ઊંચાઈ: ${uHeight} સેમી
- વજન: ${uWeight} કિલો
- BMI આંકડો: ${bmi} (${weightStatus})
- BMR: ${Math.round(bmr)} કૅલરી
- દૈનિક કેલરીની જરૂરિયાત (TDEE): ${tdee} કૅલરી
- આદર્શ વજનની શ્રેણી: ${idealWeightMin} થી ${idealWeightMax} કિલો.
જવાબના અંતે [Source: AI Health & Fitness Expert System] ચોક્કસ લખો.`;

        if (message && message.trim() !== "") {
            prompt = `પહેલા આપેલી વિગતો: ઉંમર ${uAge} વર્ષ, ઊંચાઈ ${uHeight} સેમી, વજન ${uWeight} કિલો, BMI ${bmi} (${weightStatus}).
યુઝરનો નવો સવાલ: "${message}"
કૃપા કરીને આ વિગતોને ધ્યાનમાં રાખીને યુઝરના સવાલનો શુદ્ધ ગુજરાતીમાં સાચો જવાબ આપો. જવાબના અંતે [Source: AI Health & Fitness Expert System] લખો.`;
        }

        let fitnessReply = await getAIResponse(prompt, history || []);
        res.json({ reply: fitnessReply });
    } catch (error) {
        console.error("Fitness API Error:", error);
        res.status(500).json({ reply: "⚠️ ફિટનેસ રિપોર્ટ જનરેટ કરવામાં ક્ષતિ આવી. [Source: Fitness System Error]" });
    }
});

// 📄 5. Document Parser
app.post('/api/analyze-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ reply: "⚠️ કૃપા કરીને ફાઈલ પસંદ કરો." });
        }

        let extractedText = "";
        const mimeType = req.file.mimetype;

        if (mimeType === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        } else if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        } else if (mimeType.includes('spreadsheetml') || mimeType.includes('excel')) {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);
            workbook.eachSheet((worksheet) => {
                worksheet.eachRow((row) => {
                    extractedText += row.values.join(" | ") + "\n";
                });
            });
        }

        const userComment = req.body.comment || "આ ડોક્યુમેન્ટનું પૃથ્થકરણ કરો.";
        const fullPrompt = `DOCUMENT TEXT:\n${extractedText.substring(0, 8000)}\n\nUSER REQUEST: ${userComment}\n\nકૃપા કરીને આ દસ્તાવેજના આધારે જવાબ આપો અને જવાબના અંતે [Source: User Uploaded Document Analysis (${req.file.originalname})] લખો.`;

        let aiReply = await getAIResponse(fullPrompt);
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("File Analysis Route Error:", error);
        res.status(500).json({ reply: "⚠️ ડોક્યુમેન્ટ પ્રોસેસિંગમાં સર્વર એરર આવી છે. [Source: Document Parser System]" });
    }
});

// 📝 6. Quiz Generator Endpoint
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { std, subject, chapter, totalMarks, questionTypes } = req.body;
        const prompt = `કૃપા કરીને અધિકૃત GCERT/NCERT અભ્યાસક્રમ મુજબ ધોરણ ${std}, વિષય ${subject}, પ્રકરણ ${chapter} માટે કુલ ${totalMarks} ગુણની ક્વિઝ બનાવો જેમાં નીચેના પ્રકારના પ્રશ્નો સામેલ હોય: ${questionTypes.join(', ')}. જવાબના અંતે [Source: GCERT / NCERT Official Curriculum Standards] ચોક્કસ લખો.`;
        
        let quizReply = await getAIResponse(prompt);
        res.json({ reply: quizReply });
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        res.status(500).json({ reply: "⚠️ ક્વિઝ જનરેટ કરવામાં ક્ષતિ આવી. [Source: GCERT Curriculum System]" });
    }
});

// 📰 7. Live News Dedicated Endpoint
const fetchLiveNewsHandler = async (req, res) => {
    try {
        let liveNewsContext = "";
        const todayDateStr = getCurrentIndianDate();

        try {
            const rssUrl = 'https://news.google.com/rss?hl=gu&gl=IN&ceid=IN:gu';
            const response = await axios.get(rssUrl, { timeout: 5000 });
            if (response.data) {
                liveNewsContext = response.data;
            }
        } catch (e) {
            console.error("News RSS Error");
        }

        const prompt = `આજે તારીખ ${todayDateStr} છે. નીચેના ગૂગલ ન્યૂઝ ફીડ ડેટાના આધારે ગુજરાત અને ભારતભરના સૌથી મહત્વપૂર્ણ તાજા અને સચોટ સમાચારો વિગતવાર ગુજરાતીમાં લખી આપો:\n\n${liveNewsContext.substring(0, 4000)}`;
        let newsReply = await getAIResponse(prompt);
        
        if (!newsReply.includes('Source:')) {
            newsReply += `\n\n[Source: Google News Live RSS]`;
        }

        res.json({ reply: `📰 **આજના તાજા સમાચારો (Live News - ${todayDateStr}):**\n\n${newsReply}` });
    } catch (error) {
        res.json({ reply: "📰 તાજા સમાચાર મેળવવામાં અસ્થાયી રૂપે મુશ્કેલી છે. [Source: Google News RSS]" });
    }
};

// 🍎 8. Food Vision Detector Endpoint
app.post('/api/detect-food', async (req, res) => {
    try {
        const { imageBase64, comment } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ reply: "⚠️ કૃપા કરીને કોઈ ખાદ્ય પદાર્થ, ફળ કે પીણાનો ફોટો અપલોડ કરો." });
        }

        let formattedImage = imageBase64;
        if (!formattedImage.startsWith('data:image/')) {
            formattedImage = `data:image/jpeg;base64,${formattedImage}`;
        }

        const foodPrompt = [
            { 
                type: "text", 
                text: comment || "આ ફોટામાં કયા ખાદ્ય પદાર્થો અથવા ફળો છે તેની યાદી શુદ્ધ ગુજરાતીમાં બનાવો. જવાબના અંતે [Source: AI Food & Nutrition Vision Detector] લખો." 
            },
            { 
                type: "image_url", 
                image_url: { 
                    url: formattedImage 
                } 
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert food and nutrition AI assistant. Analyze food images and reply accurately in pure Gujarati script."
                },
                { role: "user", content: foodPrompt }
            ],
            temperature: 0.0,
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Food Detector Error:", error);
        res.status(500).json({ reply: "⚠️ ફોટો પ્રોસેસ કરવામાં એરર આવી. [Source: Food Vision Error]" });
    }
});

// 🎂 9. Age Calculator Endpoint
app.post('/api/calculate-age', async (req, res) => {
    try {
        const { birthDate, targetDate } = req.body;
        if (!birthDate) {
            return res.status(400).json({ reply: "⚠️ કૃપા કરીને જન્મતારીખ પસંદ કરો." });
        }

        const bDate = new Date(birthDate);
        const tDate = targetDate ? new Date(targetDate) : new Date();

        if (isNaN(bDate.getTime())) {
            return res.status(400).json({ reply: "⚠️ અયોગ્ય તારીખ format." });
        }

        let years = tDate.getFullYear() - bDate.getFullYear();
        let months = tDate.getMonth() - bDate.getMonth();
        let days = tDate.getDate() - bDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(tDate.getFullYear(), tDate.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const diffTime = Math.abs(tDate - bDate);
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalHours = totalDays * 24;

        const prompt = `એક હેલ્થ અને ડેટા એક્સપર્ટ તરીકે નીચે આપેલી ગણતરીના આધારે શુદ્ધ ગુજરાતીમાં ઉંમર રિપોર્ટ તૈયાર કરો:
- જન્મતારીખ: ${birthDate}
- ચોક્કસ ઉંમર: ${years} વર્ષ, ${months} મહિના, અને ${days} દિવસ
- કુલ જીવેલા દિવસો: આશરે ${totalDays.toLocaleString()} દિવસો (${totalHours.toLocaleString()} કલાકો)
જવાબના અંતે [Source: AI Age Calculator System] ચોક્કસ લખો.`;

        const aiReply = await getAIResponse(prompt);
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("Age Calc Error:", error);
        res.status(500).json({ reply: "⚠️ ઉંમર ગણવામાં ક્ષતિ આવી. [Source: Age Calculator Error]" });
    }
});

app.get('/api/live-news', fetchLiveNewsHandler);
app.get('/live-news', fetchLiveNewsHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Sarkar Smart AI Server running on http://localhost:${PORT}`);
    try {
        await open(`http://localhost:${PORT}`);
    } catch (e) {
        console.log("Browser auto-open skipped.");
    }
});

// સ્ટેટિક ફાઈલો લોડ કરવા માટે
app.use(express.static('.'));

// હોમ પેજ માટે રૂટ
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
