document.addEventListener("DOMContentLoaded", () => {
    // Elements Selection
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const logoModal = document.getElementById("logoModal");
    const closeLogoModal = document.getElementById("closeLogoModal");
    const clickableLogos = document.querySelectorAll(".clickable-logo");

    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const messagesContainer = document.getElementById("messagesContainer");

    const plusBtn = document.getElementById("plusBtn");
    const plusMenu = document.getElementById("plusMenu");
    const menuCameraBtn = document.getElementById("menuCameraBtn");
    const menuGalleryBtn = document.getElementById("menuGalleryBtn");
    const menuFileBtn = document.getElementById("menuFileBtn");
    const menuGenBtn = document.getElementById("menuGenBtn");

    const fileInput = document.getElementById("fileInput");
    const galleryInput = document.getElementById("galleryInput");
    const filePreviewBar = document.getElementById("filePreviewBar");
    const previewFileName = document.getElementById("previewFileName");
    const removeFileBtn = document.getElementById("removeFileBtn");

    const micBtn = document.getElementById("micBtn");
    const openMathSolverBtn = document.getElementById("openMathSolverBtn");
    const openPdfReaderBtn = document.getElementById("openPdfReaderBtn");
    const openQuizModalBtn = document.getElementById("openQuizModalBtn");
    const quizModal = document.getElementById("quizModal");
    const closeQuizModalBtn = document.getElementById("closeQuizModalBtn");
    const submitQuizBtn = document.getElementById("submitQuizBtn");

    const cameraModal = document.getElementById("cameraModal");
    const closeCameraModalBtn = document.getElementById("closeCameraModalBtn");
    const webcam = document.getElementById("webcam");
    const cameraCanvas = document.getElementById("cameraCanvas");
    const captureBtn = document.getElementById("captureBtn");
    const switchCameraBtn = document.getElementById("switchCameraBtn");

    // 💪 Fitness Modal Elements
    const openFitnessModalBtn = document.getElementById("openFitnessModalBtn");
    const fitnessModal = document.getElementById("fitnessModal");
    const closeFitnessModalBtn = document.getElementById("closeFitnessModalBtn");
    const submitFitnessBtn = document.getElementById("submitFitnessBtn");

    // 🍎 Food & Fruit Scanner Elements
    const openFoodDetectorBtn = document.getElementById('openFoodDetectorBtn');
    const foodModal = document.getElementById('foodModal');
    const closeFoodModalBtn = document.getElementById('closeFoodModalBtn');
    const submitFoodBtn = document.getElementById('submitFoodBtn');

    // 🎂 Age Calculator Elements
    const openAgeModalBtn = document.getElementById('openAgeModalBtn');
    const ageModal = document.getElementById('ageModal');
    const closeAgeModalBtn = document.getElementById('closeAgeModalBtn');
    const submitAgeBtn = document.getElementById('submitAgeBtn');

    // 🧮 Smart Voice Calculator Elements
    const openSmartCalcBtn = document.getElementById('openSmartCalcBtn');
    const smartCalcModal = document.getElementById('smartCalcModal');
    const closeSmartCalcBtn = document.getElementById('closeSmartCalcBtn');
    const calcDisplay = document.getElementById('calcDisplay');
    const calcKeypad = document.getElementById('calcKeypad');
    const voiceCalcBtn = document.getElementById('voiceCalcBtn');

    let activeStream = null;
    let selectedFile = null;
    let currentFacingMode = "environment";
    
    // 🧠 ચેટ મેમરી
    let conversationHistory = [];

    // 🔊 સ્પીચ વોઈસ લોડર
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // 1. Sidebar Toggle Logic
    function toggleSidebar() {
        if (!sidebar) return;
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle("active");
            if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
        } else {
            sidebar.classList.toggle("closed");
        }
    }

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener("click", toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener("click", toggleSidebar);

    // ➕ નવી ચેટ શરૂ કરવાનો બટન
    const newChatBtn = document.getElementById("newChatBtn") || document.querySelector(".new-chat-btn");
    
    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            conversationHistory = [];

            if (messagesContainer) {
                messagesContainer.innerHTML = `
                    <div class="message assistant-message">
                        <div class="message-content">
                            🌟 <b>નમસ્તે! Sarkar Smart AI માં તમારું હાર્દિક સ્વાગત છે!</b><br><br>તમે શૈક્ષણિક પ્રશ્નો, ગીતો, કવિતાઓ, પાઠો અને લાઈવ સમાચાર મેળવી શકો છો. 
                            <div class="message-source-note" style="font-size: 11px; opacity: 0.85; margin-top: 10px; border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 6px;">[Source: GCERT/NCERT Educational & Official Assistant]</div>
                        </div>
                    </div>
                `;
            }

            if (userInput) userInput.value = "";
            if (removeFileBtn) removeFileBtn.click();

            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains("active")) {
                toggleSidebar();
            }
        });
    }

    // 2. Logo Zoom Modal
    clickableLogos.forEach(logo => {
        logo.addEventListener("click", () => {
            if (logoModal) logoModal.classList.remove("hidden");
        });
    });
    if (closeLogoModal && logoModal) {
        closeLogoModal.addEventListener("click", () => logoModal.classList.add("hidden"));
    }

    // 3. Plus Menu Toggle Action
    if (plusBtn) {
        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (plusMenu) plusMenu.classList.toggle("hidden");
        });
    }

    document.addEventListener("click", (e) => {
        if (plusMenu && !plusMenu.contains(e.target) && plusBtn && !plusBtn.contains(e.target)) {
            plusMenu.classList.add("hidden");
        }
    });

    // 4. File / Image Attachment Selection (સંપૂર્ણ સુધારેલું જેથી ફોટો સિલેક્ટ થતા જ AI પ્રોસેસિંગ શરૂ થાય)
    if (menuFileBtn && fileInput) menuFileBtn.addEventListener("click", () => fileInput.click());
    if (menuGalleryBtn && galleryInput) menuGalleryBtn.addEventListener("click", () => galleryInput.click());
    if (openPdfReaderBtn && fileInput) openPdfReaderBtn.addEventListener("click", () => fileInput.click());

    if (fileInput) fileInput.addEventListener("change", handleFileSelection);
    if (galleryInput) galleryInput.addEventListener("change", handleFileSelection);

    function handleFileSelection(e) {
        if (e.target.files && e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            if (previewFileName) previewFileName.textContent = `📎 પસંદ કરેલી ફાઈલ: ${selectedFile.name}`;
            if (filePreviewBar) filePreviewBar.classList.remove("hidden");

            // જો યુઝરે ઇમેજ/ફોટો સિલેક્ટ કર્યો હોય, તો યુઝરે કંઈપણ લખ્યા વગર પણ સીધો સબમિટ ફોર્મ જેવું જ કામ ઓટોમેટિક અથવા ચેટમાં મોકલી શકાય
            // અથવા યુઝર 'મોકલો' બટન દબાવે ત્યારે તે પ્રોસેસ થશે. જો સીધેસીધું રીડ કરાવવું હોય તો નીચે મુજબ કોલ કરી શકાય:
            if (selectedFile.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Image = reader.result;
                    const comment = userInput && userInput.value.trim() ? userInput.value.trim() : "આ ફોટા વિશે વિગતવાર સમજાવો અથવા આ ફોટો રીડ કરો.";
                    
                    if (userInput) userInput.value = "";
                    if (filePreviewBar) filePreviewBar.classList.add("hidden");

                    // ચેટમાં યુઝરનો મેસેજ અને ફોટો બતાવો
                    const userMsgDiv = document.createElement('div');
                    userMsgDiv.className = 'message user-message';
                    userMsgDiv.innerHTML = `<div class="message-content">🖼️ [અપલોડ કરેલો ફોટો]: ${comment}<br><img src="${base64Image}" style="max-width:200px; border-radius:8px; margin-top:8px; display:block;"></div>`;
                    messagesContainer.appendChild(userMsgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'message assistant-message';
                    loadingDiv.id = 'tempImageLoading';
                    loadingDiv.innerHTML = `<div class="message-content">🔄 ફોટો રીડ અને વિશ્લેષણ કરવામાં આવી રહ્યું છે...</div>`;
                    messagesContainer.appendChild(loadingDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                    try {
                        const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: comment,
                                imageBase64: base64Image,
                                history: conversationHistory
                            })
                        });

                        const data = await res.json();
                        const tempMsg = document.getElementById('tempImageLoading');
                        if (tempMsg) tempMsg.remove();

                        const replyText = data.reply || "⚠️ ફોટો રીડ કરવામાં અથવા વિશ્લેષણ કરવામાં મુશ્કેલી થઈ છે.";
                        
                        const aiMsgDiv = document.createElement('div');
                        aiMsgDiv.className = 'message assistant-message';
                        aiMsgDiv.innerHTML = `<div class="message-content">${replyText.replace(/\n/g, '<br>')}</div>`;
                        messagesContainer.appendChild(aiMsgDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;

                        conversationHistory.push({ role: "user", parts: [{ text: `[ફોટો અપલોડ]: ${comment}` }] });
                        conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                    } catch (err) {
                        const tempMsg = document.getElementById('tempImageLoading');
                        if (tempMsg) tempMsg.remove();
                        
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'message assistant-message';
                        errorDiv.innerHTML = `<div class="message-content">⚠️ સર્વર સાથે સંપર્ક કરવામાં ભૂલ થઈ છે.</div>`;
                        messagesContainer.appendChild(errorDiv);
                    }

                    selectedFile = null;
                    if (fileInput) fileInput.value = "";
                    if (galleryInput) galleryInput.value = "";
                };
                reader.readAsDataURL(selectedFile);
            }
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener("click", () => {
            selectedFile = null;
            if (fileInput) fileInput.value = "";
            if (galleryInput) galleryInput.value = "";
            if (filePreviewBar) filePreviewBar.classList.add("hidden");
        });
    }

    // 5. Camera & Scanner Operations
    async function startCamera() {
        try {
            if (cameraCanvas) {
                const ctx = cameraCanvas.getContext("2d");
                ctx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
                cameraCanvas.style.display = "none";
            }

            if (webcam) {
                webcam.style.display = "block";
            }

            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
            activeStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: currentFacingMode }
            });
            if (webcam) webcam.srcObject = activeStream;
            if (cameraModal) cameraModal.classList.remove("hidden");
        } catch (err) {
            console.error("Camera Error:", err);
            alert("⚠️ કેમેરાનો એક્સેસ મળી શક્યો નથી. પરમિશન ચકાસો.");
        }
    }

    function stopCamera() {
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }
        if (cameraModal) cameraModal.classList.add("hidden");
    }

    if (menuCameraBtn) {
        menuCameraBtn.addEventListener("click", () => {
            if (plusMenu) plusMenu.classList.add("hidden");
            startCamera();
        });
    }

    if (openMathSolverBtn) openMathSolverBtn.addEventListener("click", startCamera);
    if (closeCameraModalBtn) closeCameraModalBtn.addEventListener("click", stopCamera);

    if (switchCameraBtn) {
        switchCameraBtn.addEventListener("click", () => {
            currentFacingMode = (currentFacingMode === "user") ? "environment" : "user";
            startCamera();
        });
    }

    if (captureBtn) {
        captureBtn.addEventListener("click", async () => {
            if (!cameraCanvas || !webcam) return;
            const ctx = cameraCanvas.getContext("2d");
            cameraCanvas.width = webcam.videoWidth;
            cameraCanvas.height = webcam.videoHeight;
            ctx.drawImage(webcam, 0, 0);

            webcam.style.display = "none";
            cameraCanvas.style.display = "block";

            const base64Image = cameraCanvas.toDataURL("image/jpeg");
            stopCamera();

            appendMessage("📷 [કેમેરા સ્કેનર]: ગણિતના દાખલાનું વિશ્લેષણ અને સોલ્યુશન મેળવવામાં આવી રહ્યું છે...", "user-message");
            const loadingDiv = appendMessage("🔄 AI સોલ્યુશન તૈયાર થઈ રહ્યું છે...", "assistant-message");

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: "આ ગણિતના દાખલાને સ્ટેપ-બાય-સ્ટેપ ઉકેલીને સમજાવો.",
                        imageBase64: base64Image,
                        history: conversationHistory
                    })
                });

                const data = await res.json();
                if (loadingDiv) loadingDiv.remove();
                const replyText = data.reply || "⚠️ સોલ્યુશન મેળવવામાં ભૂલ થઈ. [Source: GCERT/NCERT Educational Assistant]";
                appendMessage(replyText, "assistant-message");

                conversationHistory.push({ role: "user", parts: [{ text: "[કેમેરા સ્કેનરથી મેથ્સ સોલ્યુશન માટે ફોટો અપલોડ કર્યો]" }] });
                conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

            } catch (err) {
                if (loadingDiv) loadingDiv.remove();
                appendMessage("⚠️ સર્વર પ્રોસેસિંગમાં તકલીફ થઈ. [Source: System]", "assistant-message");
            }
        });
    }

    // 6. Voice Input (Speech Recognition)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'gu-IN';

        if (micBtn) {
            micBtn.addEventListener("click", () => {
                try {
                    recognition.start();
                    micBtn.style.color = "#ff4d4d";
                } catch (e) {
                    console.error("Speech Recognition Error:", e);
                }
            });
        }

        recognition.onresult = (e) => {
            if (userInput) userInput.value = e.results[0][0].transcript;
            if (micBtn) micBtn.style.color = "var(--accent-color)";
        };

        recognition.onerror = () => { if (micBtn) micBtn.style.color = "var(--accent-color)"; };
        recognition.onend = () => { if (micBtn) micBtn.style.color = "var(--accent-color)"; };
    }

    // 7. Image/Poster Prompt Shortcut
    if (menuGenBtn) {
        menuGenBtn.addEventListener("click", () => {
            if (userInput) {
                userInput.value = "એક મોટિવેશનલ કે ફેસ્ટિવલ પોસ્ટર જનરેટ કરી આપો: ";
                userInput.focus();
            }
        });
    }

    // 8. Quiz Generation Modal Handlers
    if (openQuizModalBtn && quizModal) openQuizModalBtn.addEventListener("click", () => quizModal.classList.remove("hidden"));
    if (closeQuizModalBtn && quizModal) closeQuizModalBtn.addEventListener("click", () => quizModal.classList.add("hidden"));

    if (submitQuizBtn) {
        submitQuizBtn.addEventListener("click", async () => {
            const std = document.getElementById("quizStd")?.value || "General";
            const subject = document.getElementById("quizSubject")?.value || "GK";
            const chapter = document.getElementById("quizChapter")?.value || "General";
            const marks = document.getElementById("quizMarks")?.value || 5;

            const types = [];
            if (document.getElementById("typeMcq")?.checked) types.push("MCQ");
            if (document.getElementById("typeBlank")?.checked) types.push("ખાલી જગ્યા");
            if (document.getElementById("typeShort")?.checked) types.push("ટૂંકા પ્રશ્નો");
            if (document.getElementById("typeLong")?.checked) types.push("લાંબા પ્રશ્નો");

            if (quizModal) quizModal.classList.add("hidden");
            appendMessage(`📝 ક્વિઝ રિક્વેસ્ટ: ધોરણ ${std} | વિષય ${subject} | પ્રકરણ ${chapter} (${marks} ગુણ)`, "user-message");

            try {
                const res = await fetch("/api/generate-quiz", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ std, subject, chapter, totalMarks: marks, questionTypes: types })
                });
                const data = await res.json();
                appendMessage(data.reply, "assistant-message");
            } catch (err) {
                appendMessage("⚠️ ક્વિઝ જનરેટ કરવામાં તકલીફ થઈ છે. [Source: GCERT/NCERT Curriculum]", "assistant-message");
            }
        });
    }

    // 💪 9. Health & Fitness Modal Handlers
    if (openFitnessModalBtn && fitnessModal) {
        openFitnessModalBtn.addEventListener("click", () => fitnessModal.classList.remove("hidden"));
    }
    if (closeFitnessModalBtn && fitnessModal) {
        closeFitnessModalBtn.addEventListener("click", () => fitnessModal.classList.add("hidden"));
    }

    if (submitFitnessBtn) {
        submitFitnessBtn.addEventListener("click", async () => {
            const gender = document.getElementById("fitGender")?.value || "Male";
            const age = document.getElementById("fitAge")?.value || "25";
            const height = document.getElementById("fitHeight")?.value || "170";
            const weight = document.getElementById("fitWeight")?.value || "65";
            const activity = document.getElementById("fitActivity")?.value || "Moderate";

            if (fitnessModal) fitnessModal.classList.add("hidden");
            appendMessage(`💪 ફિટનેસ રિપોર્ટ રિક્વેસ્ટ: ઉંમર ${age} વર્ષ | ઊંચાઈ ${height} સેમી | વજન ${weight} કિલો`, "user-message");
            const loadingDiv = appendMessage("🔄 તમારો ફિટનેસ રિપોર્ટ તૈયાર થઈ રહ્યો છે...", "assistant-message");

            try {
                const res = await fetch("/api/calculate-fitness", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ gender, age, height, weight, activity })
                });
                const data = await res.json();
                if (loadingDiv) loadingDiv.remove();
                appendMessage(data.reply || "⚠️ ફિટનેસ રિપોર્ટ મેળવવામાં ભૂલ થઈ. [Source: Fitness System]", "assistant-message");
            } catch (err) {
                if (loadingDiv) loadingDiv.remove();
                appendMessage("⚠️ ફિટનેસ રિપોર્ટ જનરેટ કરવામાં સર્વર એરર આવી છે. [Source: Fitness System]", "assistant-message");
            }
        });
    }

    // 🍎 10. Food & Fruit Scanner Modal Logic
    if (openFoodDetectorBtn && foodModal) {
        openFoodDetectorBtn.addEventListener('click', () => {
            foodModal.classList.remove('hidden');
            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        });
    }

    if (closeFoodModalBtn && foodModal) {
        closeFoodModalBtn.addEventListener('click', () => {
            foodModal.classList.add('hidden');
        });
    }

    if (submitFoodBtn) {
        submitFoodBtn.addEventListener('click', async () => {
            const foodImageInput = document.getElementById('foodImageInput');
            const commentInput = document.getElementById('foodComment');

            if (!foodImageInput || foodImageInput.files.length === 0) {
                alert('⚠️ કૃપા કરીને પહેલા કોઈ ખાદ્ય પદાર્થ કે ફળનો ફોટો પસંદ કરો.');
                return;
            }

            const file = foodImageInput.files[0];
            const comment = commentInput ? commentInput.value : "આ ફોટામાં શું શું છે તે જણાવો.";

            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = async () => {
                const base64String = reader.result;

                if (foodModal) foodModal.classList.add('hidden');

                const userMsgDiv = document.createElement('div');
                userMsgDiv.className = 'message user-message';
                userMsgDiv.innerHTML = `<div class="message-content">🖼️ [ફૂડ/ફ્રૂટ ફોટો સ્કેન માટે મોકલ્યો છે]<br><img src="${base64String}" style="max-width:200px; border-radius:8px; margin-top:8px;"></div>`;
                messagesContainer.appendChild(userMsgDiv);

                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'message assistant-message';
                loadingDiv.id = 'tempLoadingMsg';
                loadingDiv.innerHTML = `<div class="message-content">⏳ AI ફોટો સ્કેન કરી રહ્યું છે, કૃપા કરીને રાહ જુઓ...</div>`;
                messagesContainer.appendChild(loadingDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                try {
                    const response = await fetch('/api/detect-food', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imageBase64: base64String,
                            comment: comment
                        })
                    });

                    const data = await response.json();
                    
                    const tempMsg = document.getElementById('tempLoadingMsg');
                    if (tempMsg) tempMsg.remove();

                    const aiMsgDiv = document.createElement('div');
                    aiMsgDiv.className = 'message assistant-message';
                    aiMsgDiv.innerHTML = `<div class="message-content">${(data && data.reply) ? data.reply.replace(/\n/g, '<br>') : "⚠️ જવાબ મળ્યો નથી."}</div>`;
                    messagesContainer.appendChild(aiMsgDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;

                } catch (error) {
                    console.error("Food API Error:", error);
                    const tempMsg = document.getElementById('tempLoadingMsg');
                    if (tempMsg) tempMsg.remove();
                    alert('⚠️ સર્વર સાથે કનેક્ટ કરવામાં એરર આવી.');
                }
            };
        });
    }

    // 🎂 11. Age Calculator Modal Logic
    if (openAgeModalBtn && ageModal) {
        openAgeModalBtn.addEventListener('click', () => {
            ageModal.classList.remove('hidden');
            
            const today = new Date();
            const tDay = document.getElementById('targetDay');
            const tMonth = document.getElementById('targetMonth');
            const tYear = document.getElementById('targetYear');

            if (tDay) tDay.value = today.getDate();
            if (tMonth) tMonth.value = today.getMonth() + 1;
            if (tYear) tYear.value = today.getFullYear();

            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        });
    }

    if (closeAgeModalBtn && ageModal) {
        closeAgeModalBtn.addEventListener('click', () => {
            ageModal.classList.add('hidden');
        });
    }

    if (submitAgeBtn) {
        submitAgeBtn.addEventListener('click', () => {
            const bD = document.getElementById('birthDay').value;
            const bM = document.getElementById('birthMonth').value;
            const bY = document.getElementById('birthYear').value;

            const tD = document.getElementById('targetDay').value;
            const tM = document.getElementById('targetMonth').value;
            const tY = document.getElementById('targetYear').value;

            if (!bD || !bM || !bY) {
                alert('⚠️ કૃપા કરીને તમારી સંપૂર્ણ જન્મતારીખ (તારીખ, મહિનો અને વર્ષ) પસંદ કરો.');
                return;
            }

            if (!tD || !tM || !tY) {
                alert('⚠️ કૃપા કરીને ટાર્ગેટ તારીખની તમામ વિગતો પસંદ કરો.');
                return;
            }

            if (ageModal) ageModal.classList.add('hidden');

            const bDate = new Date(bY, bM - 1, bD);
            const tDate = new Date(tY, tM - 1, tD);

            if (bDate > tDate) {
                alert('⚠️ જન્મતારીખ, ટાર્ગેટ તારીખ કરતાં મોટી ન હોઈ શકે!');
                return;
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

            const replyText = `🌟 <b>તમારો વય (Age) રિપોર્ટ:</b><br><br>` +
                              `👉 <b>ચોક્કસ ઉંમર:</b> ${years} વર્ષ, ${months} મહિના અને ${days} દિવસ<br>` +
                              `⏳ <b>કુલ જીવેલા દિવસો:</b> આશરે ${totalDays.toLocaleString()} દિવસો<br>` +
                              `[Source: Sarkar Smart AI System]`;

            if (messagesContainer) {
                const aiMsgDiv = document.createElement('div');
                aiMsgDiv.className = 'message assistant-message';
                aiMsgDiv.innerHTML = `<div class="message-content">${replyText}</div>`;
                messagesContainer.appendChild(aiMsgDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    }

    // 🧮 12. Smart Voice Calculator Logic
    if (openSmartCalcBtn && smartCalcModal) {
        openSmartCalcBtn.addEventListener('click', () => {
            smartCalcModal.classList.remove('hidden');
            if (sidebar) sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        });
    }

    if (closeSmartCalcBtn && smartCalcModal) {
        closeSmartCalcBtn.addEventListener('click', () => {
            smartCalcModal.classList.add('hidden');
        });
    }

    if (calcKeypad && calcDisplay) {
        calcKeypad.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const action = btn.getAttribute('data-action') || btn.textContent.trim();

            if (action === 'C' || btn.classList.contains('clear')) {
                calcDisplay.value = '';
            } else if (action === '=' || btn.classList.contains('equals')) {
                try {
                    let expr = calcDisplay.value.replace(/×/g, '*').replace(/÷/g, '/');
                    calcDisplay.value = eval(expr);
                } catch (err) {
                    calcDisplay.value = 'Error';
                }
            } else {
                calcDisplay.value += action;
            }
        });
    }

    if (voiceCalcBtn && calcDisplay) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const CalcSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
            const calcRec = new CalcSpeech();
            calcRec.lang = 'gu-IN';

            voiceCalcBtn.addEventListener('click', () => {
                try {
                    calcRec.start();
                    voiceCalcBtn.style.color = '#ff4d4d';
                } catch (e) {
                    console.error(e);
                }
            });

            calcRec.onresult = (e) => {
                const speechText = e.results[0][0].transcript;
                voiceCalcBtn.style.color = 'inherit';
                calcDisplay.value = speechText;
            };

            calcRec.onerror = () => { voiceCalcBtn.style.color = 'inherit'; };
            calcRec.onend = () => { voiceCalcBtn.style.color = 'inherit'; };
        }
    }

    // 13. Main Chat Form Handler
    if (chatForm) {
        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = userInput ? userInput.value.trim() : "";
            if (!text && !selectedFile) return;

            let userMsgText = text;
            if (selectedFile) {
                userMsgText = `[ફાઈલ: ${selectedFile.name}] ${text}`;
            }

            appendMessage(userMsgText, "user-message");
            if (userInput) userInput.value = "";

            const lowerText = text.toLowerCase();
            const isImageFile = selectedFile && selectedFile.type.startsWith("image/");
            const isPdfFile = selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf"));
            
            const isImageGenKeyword = 
                lowerText.includes("પોસ્ટર") || lowerText.includes("ઈમેજ") || lowerText.includes("ચિત્ર") || 
                lowerText.includes("ફોટો") || lowerText.includes("પિક") || lowerText.includes("સીન") || 
                lowerText.includes("image") || lowerText.includes("poster") || lowerText.includes("photo") || 
                lowerText.includes("pic") || lowerText.includes("scene") || lowerText.includes("bnavi") || 
                lowerText.includes("બનાવી") || lowerText.includes("દોરી") || lowerText.includes("બનાવી આપો");
            
            const isLiveNewsKeyword = lowerText.includes('news') || lowerText.includes('સમાચાર') || lowerText.includes('live news');
            const isCricketKeyword = lowerText.includes('cricket') || lowerText.includes('score') || lowerText.includes('સ્કોર') || lowerText.includes('ક્રિકેટ');

            const isEducationalOrMediaQuery = 
                lowerText.includes("ગીત") || lowerText.includes("song") || lowerText.includes("કવિતા") || 
                lowerText.includes("poem") || lowerText.includes("પ્રકરણ") || lowerText.includes("chapter") || 
                lowerText.includes("પાઠ") || lowerText.includes("lesson") || lowerText.includes("શાળા") || 
                lowerText.includes("education") || lowerText.includes("ધોરણ") || lowerText.includes("std");

            if (isEducationalOrMediaQuery && !selectedFile && !isImageGenKeyword) {
                const loadingDiv = appendMessage("📚 શૈક્ષણિક માહિતી અને સત્તાવાર વીડિયો લિંક શોધવામાં આવી રહી છે...", "assistant-message");

                try {
                    const enhancedPrompt = `તમે ગુજરાત સરકાર અને NCERT/GCERT ના સત્તાવાર શૈક્ષણિક સહાયક છો. યુઝરની માંગ મુજબ સચોટ માહિતી આપો. સવાલ: ${text}`;

                    const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: enhancedPrompt, history: conversationHistory })
                    });

                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();
                    
                    let replyText = data.reply || "⚠️ માહિતી મેળવવામાં ભૂલ થઈ.";
                    
                    const encodedQuery = encodeURIComponent(text + " GCERT official Gujarat");
                    replyText += `<br><br>📺 <b>શૈક્ષણિક વીડિયો અને સામગ્રી માટે:</b><br>` +
                                 `👉 <a href="https://www.youtube.com/results?search_query=${encodedQuery}" target="_blank" style="color: #00d2ff; text-decoration: underline;">YouTube પર સત્તાવાર વીડિયો જુઓ</a><br>` +
                                 `<span style="font-size: 11px; opacity: 0.8;">[Source: GCERT / Education Department Gujarat Official Channels]</span>`;

                    appendMessage(replyText, "assistant-message");
                    conversationHistory.push({ role: "user", parts: [{ text: text }] });
                    conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage(`⚠️ માહિતી મેળવવામાં તકલીફ થઈ. વધુ માહિતી માટે તમે <a href="https://www.youtube.com/results?search_query=GCERT+Gujarat" target="_blank" style="color: #00d2ff;">YouTube પર GCERT Gujarat</a> સર્ચ કરી શકો છો.`, "assistant-message");
                }
                return;
            }

            if ((isLiveNewsKeyword || isCricketKeyword) && !selectedFile && !isImageGenKeyword) {
                const loadingDiv = appendMessage("📰/🏏 માહિતી મેળવવામાં આવી રહી છે...", "assistant-message");

                try {
                    let promptMsg = text;
                    if (isCricketKeyword) {
                        promptMsg = `હાલની ક્રિકેટ મેચ અથવા લાઈવ સ્કોર માટે [Cricbuzz](https://www.cricbuzz.com) અથવા [ESPNcricinfo](https://www.espncricinfo.com) પર મુલાકાત લો. સવાલ: ${text}`;
                    }

                    const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: promptMsg, history: conversationHistory })
                    });

                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();
                    
                    const replyText = data.reply || "⚠️ માહિતી મેળવવામાં ભૂલ થઈ.";
                    appendMessage(replyText, "assistant-message");
                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage(`🏏 લાઈવ સ્કોર અને અપડેટ્સ માટે તમે અહીં મુલાકાત લઈ શકો છો:<br>1. [Cricbuzz](https://www.cricbuzz.com)<br>2. [ESPNcricinfo](https://www.espncricinfo.com)`, "assistant-message");
                }
                return;
            }

            if (isImageFile && !isImageGenKeyword) {
                const loadingDiv = appendMessage("🔄 ફોટો વિશ્લેષિત થઈ રહ્યો છે...", "assistant-message");
                const reader = new FileReader();

                reader.onload = async () => {
                    try {
                        const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: text || "આ ફોટા વિશે સમજાવો.",
                                imageBase64: reader.result,
                                history: conversationHistory
                            })
                        });

                        const data = await res.json();
                        if (loadingDiv) loadingDiv.remove();
                        const replyText = data.reply || "⚠️ વિશ્લેષણમાં ભૂલ થઈ.";
                        appendMessage(replyText, "assistant-message");

                        conversationHistory.push({ role: "user", parts: [{ text: `[અપલોડ કરેલો ફોટો]: ${text}` }] });
                        conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                    } catch (err) {
                        if (loadingDiv) loadingDiv.remove();
                        appendMessage("⚠️ સર્વર પ્રોસેસિંગમાં તકલીફ થઈ.", "assistant-message");
                    }
                };
                reader.readAsDataURL(selectedFile);
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            if (isImageGenKeyword) {
                const loadingDiv = appendMessage("🔄 તમે માંગેલી છબી તૈયાર થઈ રહી છે...", "assistant-message");

                try {
                    const res = await fetch("/api/generate-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: text })
                    });

                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();

                    if (data && data.imageUrl) {
                        const msgDiv = document.createElement("div");
                        msgDiv.className = "message assistant-message";
                        
                        const contentDiv = document.createElement("div");
                        contentDiv.className = "message-content";
                        contentDiv.innerHTML = `
                            ✨ <b>તમારી માંગણી મુજબનો ફોટો/પોસ્ટર તૈયાર છે:</b><br><br>
                            <img src="${data.imageUrl}" alt="${text}" style="max-width:100%; border-radius:12px; margin-top:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display:block;"><br>
                            <a href="${data.imageUrl}" download="sarkar-ai-image.jpg" style="background: #28a745; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 13px; display: inline-flex; align-items: center; gap: 5px;">
                                <i class="fa-solid fa-download"></i> ડાઉનલોડ કરો
                            </a>
                        `;
                        msgDiv.appendChild(contentDiv);
                        messagesContainer.appendChild(msgDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    } else {
                        appendMessage(data.reply || "⚠️ ઈમેજ જનરેટ કરવામાં મુશ્કેલી થઈ.", "assistant-message");
                    }
                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage("⚠️ ફોટો પ્રોસેસ કરવામાં ભૂલ થઈ.", "assistant-message");
                }
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            if (selectedFile && isPdfFile) {
                const loadingDiv = appendMessage("🔄 ફાઈલનું વિશ્લેષણ થઈ રહ્યું છે...", "assistant-message");
                
                const formData = new FormData();
                formData.append("pdfFile", selectedFile);
                formData.append("comment", text || "આ ફાઈલનું પૃથ્થકરણ કરો.");

                try {
                    const res = await fetch("/api/analyze-pdf", {
                        method: "POST",
                        body: formData
                    });
                    const data = await res.json();
                    if (loadingDiv) loadingDiv.remove();

                    const replyText = data.reply || "⚠️ ફાઈલ વિશ્લેષણમાં ભૂલ થઈ.";
                    appendMessage(replyText, "assistant-message");
                } catch (err) {
                    if (loadingDiv) loadingDiv.remove();
                    appendMessage("⚠️ ફાઈલ પ્રોસેસ કરવામાં ભૂલ થઈ.", "assistant-message");
                }
                if (removeFileBtn) removeFileBtn.click();
                return;
            }

            try {
                conversationHistory.push({ role: "user", parts: [{ text: text }] });

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        message: text,
                        history: conversationHistory 
                    })
                });

                const data = await response.json();
                const replyText = data.reply || "જવાબ મળી રહ્યો છે...";

                conversationHistory.push({ role: "model", parts: [{ text: replyText }] });

                appendMessage(replyText, "assistant-message");
            } catch (error) {
                appendMessage("⚠️ સર્વર સાથે સંપર્ક થઈ શક્યો નથી.", "assistant-message");
            }
        });
    }

    // 🎯 Message Renderer
    function appendMessage(text, className) {
        if (!messagesContainer) return null;
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${className}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";

        let cleanHtmlText = text
            .replace(/###\s?/g, '')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<i>$1</i>');

        cleanHtmlText = cleanHtmlText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff; text-decoration: underline; font-weight: 500;">$1</a>');
        cleanHtmlText = cleanHtmlText.replace(/\n/g, "<br>");

        contentDiv.innerHTML = cleanHtmlText;

        const isAssistant = className.includes("assistant-message");
        const isLoadingMsg = text.includes("🔄") || text.includes("📰") || text.includes("🏏") || text.includes("⏳") || text.includes("📚");

        if (isAssistant && !isLoadingMsg) {
            const audioContainer = document.createElement("div");
            audioContainer.style.marginTop = "10px";

            const audioBtn = document.createElement("button");
            audioBtn.className = "chat-audio-btn";
            audioBtn.style.cssText = "display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 4px 8px; color: inherit; cursor: pointer; font-size: 12px;";
            audioBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
            audioBtn.onclick = () => toggleSpeech(text, audioBtn);
            
            audioContainer.appendChild(audioBtn);
            contentDiv.appendChild(audioContainer);
        }

        msgDiv.appendChild(contentDiv);
        messagesContainer.appendChild(msgDiv);
        
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 50);

        return msgDiv;
    }

    // Voice Synthesis Logic
    function toggleSpeech(text, btnElement) {
        if (!('speechSynthesis' in window)) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`;
            return;
        }

        let cleanText = text
            .replace(/#/g, '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/[*_~`]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = /[\u0A80-\u0AFF]/.test(cleanText) ? 'gu-IN' : 'en-US';
        utterance.rate = 0.9;

        utterance.onstart = () => { btnElement.innerHTML = `<i class="fa-solid fa-square-stop"></i> અટકાવો`; };
        utterance.onend = () => { btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`; };
        utterance.onerror = () => { btnElement.innerHTML = `<i class="fa-solid fa-volume-high"></i> સાંભળો`; };

        window.speechSynthesis.speak(utterance);
    }
});
