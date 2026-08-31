
import {
    addUserMessage,
    addBotMessage,
    addTyping
} from "./chat.js";

import {
    scrollBottom,
    escapeHtml
} from "./utils.js";

import { readPDF } from "./modules/pdf.js";

alert("SCRIPT LOADED");

let lastUserMessage = "";
let selectedImage = null;

let currentCapturedImage = "";
let currentFeature = "lens";
const generateImageBtn = document.getElementById("generateImageBtn");
const imagePrompt = document.getElementById("imagePrompt");
const imageResult = document.getElementById("imageResult");

if (generateImageBtn) {

    generateImageBtn.onclick = async () => {

        const prompt = imagePrompt.value.trim();

        if (!prompt) {
            alert("Please enter image description.");
            return;
        }

        imageResult.innerHTML = "🎨 Generating image...";

        try {

            const response = await fetch("/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt
                })
            });

           const data = await response.json();

console.log("IMAGE RESPONSE:", data);

if (!response.ok) {
    imageResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    return;
}

if (data.image) {
    imageResult.innerHTML = `
        <img src="${data.image}" style="max-width:100%;border-radius:12px;">
    `;
} else {
    imageResult.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}
        } catch (error) {

            console.error("IMAGE API ERROR:", error);

            imageResult.innerHTML = "❌ " + error.message;

        }

    };

}

const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
let currentPdfText = "";
const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const imageCreatorBtn = document.getElementById("imageCreatorBtn");
const imageGenerator = document.getElementById("imageGenerator");

const container = document.querySelector(".container");

const micBtn = document.getElementById("micBtn");

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const sidebar = document.getElementById("sidebar");

// ================= SIDEBAR OPEN / CLOSE =================

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        console.log("☰ Menu Open");

        sidebar.classList.add("active");

    });

}

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        console.log("✖ Menu Close");

        sidebar.classList.remove("active");

    });

}

const startBtn = document.getElementById("startChatBtn");

const pdfBtn = document.getElementById("pdfBtn");
const pdfSection = document.getElementById("pdfSection");
const pdfFile = document.getElementById("pdfFile");
const readPdfBtn = document.getElementById("readPdfBtn");
const pdfResult = document.getElementById("pdfResult");


const attachBtn =
document.getElementById("attachBtn");

const attachMenu =
document.getElementById("attachMenu");

const filePicker =
document.getElementById("filePicker");

const cameraAttach =
document.getElementById("cameraAttach");

const galleryAttach =
document.getElementById("galleryAttach");

const pdfAttach =
document.getElementById("pdfAttach");

const fileAttach =
document.getElementById("fileAttach");

// ================= QUIZ =================

// ================= QUIZ VARIABLES =================

const generateQuizBtn = document.getElementById("generateQuizBtn");

const quizTopic = document.getElementById("quizTopic");

const quizClass = document.getElementById("quizClass");

const quizSubject = document.getElementById("quizSubject");

const quizDifficulty = document.getElementById("quizDifficulty");

const questionCount = document.getElementById("questionCount");

const quizResult = document.getElementById("quizResult");





const quizSection = document.getElementById("quizSection");






// ================= CAMERA =================

const cameraBtn = document.getElementById("cameraBtn");
console.log("cameraBtn =", cameraBtn);
const cameraSection = document.getElementById("cameraSection");
const cameraVideo = document.getElementById("cameraVideo");
const openCameraBtn = document.getElementById("openCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const capturedImage = document.getElementById("capturedImage");

const analyzeImageBtn =
document.getElementById("analyzeImageBtn");

const cameraResult =
document.getElementById("cameraResult");


// ================= ATTACH MENU =================

if (attachBtn) {

    attachBtn.onclick = () => {

        attachMenu.style.display =
            attachMenu.style.display === "block"
                ? "none"
                : "block";

    };

}


// ================= GALLERY =================

if (galleryAttach) {

    galleryAttach.onclick = () => {

        attachMenu.style.display = "none";

        filePicker.accept = "image/*";

        filePicker.click();

    };

}


/* ================= CHAT HISTORY ================= */


const historyBtn =
document.getElementById("historyBtn");


const historyPanel =
document.getElementById("historyPanel");


const closeHistory =
document.getElementById("closeHistory");

if (closeHistory) {

    closeHistory.onclick = () => {

        console.log("❌ History Closed");

        historyPanel.classList.remove("active");

        showSection("chat");

    };

}

const historyList =
document.getElementById("historyList");


const newChatBtn =
document.getElementById("newChatBtn");



let chats =
JSON.parse(localStorage.getItem("chatHistory")) || [];




if(historyBtn){

    historyBtn.onclick=()=>{

        showSection("history");

    };

}




if(newChatBtn){

newChatBtn.onclick=()=>{


chatBox.innerHTML="";


};

}




function saveChat(text){


chats.unshift({
time:new Date().toLocaleString(),

text:text


});


localStorage.setItem(

"chatHistory",

JSON.stringify(chats)

);


}


function loadHistory() {

    historyList.innerHTML = "";

    chats.forEach(chat => {

        let div = document.createElement("div");
        div.className = "history-item";

        // Safe text
        let preview = "";

        if (typeof chat.text === "string") {
            preview = chat.text.substring(0, 80);
        } else if (Array.isArray(chat.text)) {
            preview = chat.text.join(" ").substring(0, 80);
        } else {
            preview = JSON.stringify(chat.text).substring(0, 80);
        }

        div.innerHTML = `
            <b>${chat.time || ""}</b>
            <br><br>
            ${preview}...
        `;

        div.onclick = () => {
            chatBox.innerHTML =
                typeof chat.text === "string"
                    ? chat.text
                    : JSON.stringify(chat.text, null, 2);

            historyPanel.classList.remove("active");
        };

        historyList.appendChild(div);

    });

}



/* ================= VOICE ================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition){

    const recognition = new SpeechRecognition();

    recognition.lang = "gu-IN";

    recognition.continuous = false;

    if (micBtn) {

        micBtn.onclick = () => {

            recognition.start();

        };

    }

    recognition.onresult = (event) => {

        userInput.value =
            event.results[0][0].transcript;

        if (typeof sendMessage === "function") {
            sendMessage();
        }

    };
//

}

/* ================= TEXT TO SPEECH ================= */



function speak(text){


if(!window.speechSynthesis)

return;


let speech =

new SpeechSynthesisUtterance(text);


speech.lang="gu-IN";


speech.rate=1;



window.speechSynthesis.speak(speech);



}

// ======================================================
// SHOW ONLY ONE SECTION
// ======================================================

function showSection(section){

    if(container) container.style.display="none";

    if(pdfSection) pdfSection.style.display="none";

    if(imageGenerator) imageGenerator.style.display="none";

    if(cameraSection) cameraSection.style.display="none";

    if(quizSection) quizSection.style.display="none";

    if(historyPanel)
        historyPanel.classList.remove("active");

    switch(section){

        case "chat":

            container.style.display="flex";

        break;

        case "camera":

            cameraSection.style.display="block";

        break;

        case "pdf":

            pdfSection.style.display="block";

        break;

        case "image":

            imageGenerator.style.display="block";

        break;

        case "quiz":

            quizSection.style.display="block";

        break;

        case "history":

            loadHistory();

            historyPanel.classList.add("active");

        break;

    }

    sidebar.classList.remove("active");

}

// ================= CAMERA CLOSE =================

if (closeCameraBtn) {

    closeCameraBtn.onclick = () => {

        // Camera stream બંધ કરો
        if (cameraStream) {

            cameraStream.getTracks().forEach(track => track.stop());

            cameraStream = null;

        }

        if (cameraVideo) {

            cameraVideo.srcObject = null;

        }

        // Camera બંધ કરીને Chat પર જાઓ
        showSection("chat");

    };

}

/* ================= IMAGE CREATOR ================= */


if(imageCreatorBtn){

    imageCreatorBtn.onclick=()=>{

        showSection("image");

    };

}


/* ================= PDF ASSISTANT ================= */

if(pdfBtn){

    pdfBtn.onclick=()=>{

        showSection("pdf");

    };

}


/* ================= CAMERA AI ================= */

if(cameraBtn){

    cameraBtn.onclick=()=>{

        currentFeature = "camera";

        console.log("📷 Camera Mode");

        showSection("camera");

    };

}

//

// ================= AI FEATURE MODE =================

const aiFeatures = document.querySelectorAll(".ai-feature");

aiFeatures.forEach((button) => {

    button.addEventListener("click", () => {

        currentFeature = button.dataset.feature;

        console.log("Current Feature:", currentFeature);

    });

});

let cameraStream = null;
let facingMode = "environment"; // Default = Back Camera

async function startCamera() {

    console.log("✅ startCamera() called");

    try {

        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: facingMode
            }

        });

        cameraVideo.srcObject = cameraStream;

        cameraVideo.style.display = "block";

capturedImage.style.display = "none";

capturedImage.src = "";

cameraResult.innerHTML = "";

cameraPrompt.value = "";

    }

    catch (err) {

        console.error(err);

        alert("Camera permission denied.");

    }

}

// Open Camera

if (openCameraBtn) {

    openCameraBtn.onclick = async () => {

        console.log("📷 Camera button clicked");

        alert("Open Camera Button Clicked");

        await startCamera();

    };

}

// Switch Camera

const switchCameraBtn =
document.getElementById("switchCameraBtn");

if (switchCameraBtn) {

    switchCameraBtn.onclick = () => {

        facingMode =
        facingMode === "environment"
        ? "user"
        : "environment";

        startCamera();

    };

}

// Capture

if (captureBtn) {

    captureBtn.onclick = () => {

        const canvas =
        document.getElementById("cameraCanvas");

        canvas.width = cameraVideo.videoWidth;
        canvas.height = cameraVideo.videoHeight;

        const ctx =
        canvas.getContext("2d");

        ctx.drawImage(
            cameraVideo,
            0,
            0
        );

        capturedImage.src =
        canvas.toDataURL("image/png");

        currentCapturedImage = capturedImage.src;

        capturedImage.style.display = "block";

        if (cameraStream) {

            cameraStream.getTracks().forEach(track => track.stop());

            cameraVideo.srcObject = null;

        }

    };

}

// Analyze

if (analyzeImageBtn) {

    analyzeImageBtn.onclick = async () => {

        if (!capturedImage.src) {

            alert("Please capture an image first.");

            return;

        }

        cameraResult.innerHTML =
        "🤖 Analyzing image...";

        const prompt =
        document.getElementById("cameraPrompt")?.value || "";

        try {

            const response =
            await fetch("/analyze-image", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    image: capturedImage.src,

                    prompt: prompt

                })

            });

            const data =
            await response.json();

            cameraResult.innerHTML = `
<div class="bot-message">
    🤖 ${data.reply}
</div>

<div class="camera-chat-box">

    <input
        type="text"
        id="cameraChatInput"
        placeholder="Ask anything about this image..."
    >

    <button id="cameraSendBtn">
        Send
    </button>

</div>
`;

document.getElementById("cameraSendBtn").onclick = sendCameraMessage;

      }  catch (err) {

            console.error(err);

            cameraResult.innerHTML =
            "❌ Unable to analyze image.";

        }

    };

}


// ================= QUIZ GENERATOR =================


/* ================= AI CHAT ================= */

if(chatBtn){

    chatBtn.onclick=()=>{

        showSection("chat");

        container.scrollIntoView({

            behavior:"smooth"

        });

    };

}


if (readPdfBtn) {

    readPdfBtn.onclick = async () => {

        const file = pdfFile.files[0];

        if (!file) {
            alert("Please select a PDF file.");
            return;
        }

        pdfResult.innerHTML = "📖 Reading PDF...";

        try {

            const text = await readPDF(file);

// Clean PDF Text
const cleaned = text

    .replace(/\n\s*\n/g, "\n")
    .replace(/•\s*\n\s*/g, "• ")
    .replace(/:\s*\n\s*/g, ": ")
    .replace(/[ \t]+/g, " ")
    .trim();

currentPdfText = cleaned;

const words = cleaned.trim().split(/\s+/).length;
const chars = cleaned.length;

const preview = cleaned.substring(0, 3000);

pdfResult.innerHTML = `
    <div class="pdf-info">

        <h3>📄 ${file.name}</h3>

        <p><b>Characters:</b> ${chars.toLocaleString()}</p>

        <p><b>Words:</b> ${words.toLocaleString()}</p>

        <hr>

        <h4>Preview</h4>

        <div class="pdf-preview">

            ${preview.replace(/\n/g,"<br>")}

        </div>

    </div>
`;

        } catch (err) {

            console.error(err);

            pdfResult.innerHTML =
                "❌ Unable to read PDF.";

        }

    };

}



window.regenerateMessage = function () {

    if (!lastUserMessage) {
        alert("No previous message found.");
        return;
    }

    userInput.value = lastUserMessage;

    sendMessage();

};

window.dislikeResponse = function (answer) {

    addBotMessage(
        chatBox,
        "🙏 Thank you for your feedback. I'll try to provide a better answer next time."
    );

};


// ================= GENERATE QUIZ =================

if (generateQuizBtn) {

    generateQuizBtn.onclick = async () => {

        const topic = quizTopic.value.trim();

        if (!topic) {
            alert("Please enter a topic.");
            return;
        }

        quizResult.innerHTML = "📝 Generating Quiz...";

        try {

            const response = await fetch("/generate-quiz", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    topic: topic,

                    className: quizClass.value,

                    subject: quizSubject.value,

                    difficulty: quizDifficulty.value,

                    count: questionCount.value

                })

            });


            const data = await response.json();

            quizResult.innerHTML =
                data.quiz.replace(/\n/g, "<br>");

        } catch (error) {

            console.error("QUIZ ERROR:", error);

            quizResult.innerHTML =
                "❌ Unable to generate quiz.";

        }

    };

    }

async function sendCameraMessage() {

    const input =
        document.getElementById("cameraChatInput");

    const question = input.value.trim();

    if (!question) return;

    cameraResult.innerHTML += `
        <div class="user-message">
            👤 ${question}
        </div>
    `;

    input.value = "";

    try {

        const response = await fetch("/analyze-image", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                image: currentCapturedImage,

                prompt: question

            })

        });

        const data = await response.json();

        cameraResult.innerHTML += `
            <div class="bot-message">
                🤖 ${data.reply}
            </div>
        `;

    } catch (err) {

        console.error(err);

        cameraResult.innerHTML += `
            <div class="bot-message">
                ❌ Unable to get AI response.
            </div>
        `;
    }

}// 
 //================= AI FEATURE CLICK =================

const lensBtn = document.querySelector('[data-feature="lens"]');

console.log("Lens Button =", lensBtn);

if (lensBtn) {

    lensBtn.addEventListener("click", function () {

        console.log("Lens Click Working");

        alert("Lens Clicked");

    });

}


// ================= NORMAL AI CHAT =================

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    lastUserMessage = message;

    addUserMessage(chatBox, message);

    saveChat(message);

    userInput.value = "";

    scrollBottom(chatBox);

    const typing = addTyping(chatBox);

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                pdfText: currentPdfText

            })

        });

        typing.remove();

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        addBotMessage(chatBox, data.reply);

        scrollBottom(chatBox);

    }

    catch (err) {

        console.error(err);

        typing.remove();

        addBotMessage(

            chatBox,

            "❌ Unable to connect to AI."

        );

    }

}

// ================= SEND BUTTON =================

if (sendBtn) {

    sendBtn.onclick = () => {

        console.log("✅ Send Click");

        sendMessage();

    };

}

if (userInput) {

    userInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            sendMessage();

        }

    });

}