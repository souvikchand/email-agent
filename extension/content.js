console.log("Email Agent Loaded");

let button = null;
let timer = null;
const THREAD_SELECTORS = [
    ".kv",
    ".h7.bg.ie"
];

function waitForPopup() {
    return new Promise(resolve => {
        const timer = setInterval(() => {
            const table = document.querySelector("table.ajC");
            if (table) {
                clearInterval(timer);
                resolve(table);
            }
        }, 50);
    });
}

function showButton() {
    if (button) return;
    button = document.createElement("button");
    button.innerText = "Summarize";
    button.className = "email-agent-btn";

    button.onclick = async () => {
        console.log("Button Clicked");
        // const detailsButton = document.querySelector(".ajy");
        // detailsButton.click();
        // await waitForPopup();
        const email = {
            subject: extractSubject(),
            thread : extractThread()
        }
        sendToBackend(email);
        //alert("Button Clicked");
        // detailsButton.click();
        console.log(email)
    };

    document.body.appendChild(button);
    console.log("Button Added");
}

function hideButton() {
    if (!button) return;
    button.remove();
    button = null;
    console.log("Button Removed");
}

function checkPage() {
    const emailBody = document.querySelector(".a3s");
    if (emailBody)
        showButton();
    else
        hideButton();
}

const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(checkPage, 300);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
checkPage();



function parsePeople(container) {
    const people = [];
    const elements = container.querySelectorAll("[email]");
    elements.forEach(el => {
        const email = el.getAttribute("email") || "";
        let name = el.getAttribute("name");
        // TO / CC don't have a name attribute
        if (!name) {
            const text = el.innerText.trim();
            const idx = text.indexOf("<");
            if (idx !== -1)
                name = text.substring(0, idx).trim();
            else
                name = text;
        }
        people.push({
            name,
            email
        });
    });
    return people;
}

function extractSubject(){
    const subject = document.querySelector("h2.hP")?.innerText.trim() || "";
    return subject
}


function extractThread() {
    // Conversation order: oldest -> newest
    const emailNodes = [
        ...document.querySelectorAll(".kv"),
        ...document.querySelectorAll(".h7.bg.ie")
    ];

    return emailNodes.map(node => extractEmail(node));
}


function extractEmail(emailNode) {
    // ---------------- Metadata ----------------
    const date =
        emailNode.querySelector(".g3")?.getAttribute("title") ||
        emailNode.querySelector(".g3")?.innerText ||
        "";

    const senderElement = emailNode.querySelector(".gD");

    const from = senderElement
        ? {
            name: senderElement.innerText.trim(),
            email: senderElement.getAttribute("email") || ""
        }
        : null;

    const recipients = [
        ...emailNode.querySelectorAll(".hb .g2")
    ].map(el => ({
        name: el.innerText.trim(),
        email: el.getAttribute("email") || ""
    }));

    // ---------------- Body ----------------
    let body = "";

    // New Gmail layout (latest mail)
    const newBody = emailNode.querySelector(".a3s.aiL");

    if (newBody) {
        const clone = newBody.cloneNode(true);
        clone.querySelectorAll(".gmail_quote").forEach(q => q.remove());
        body = clone.innerText.trim();

    } else {
        // Older Gmail layout
        const clone = emailNode.cloneNode(true);
        clone.querySelectorAll(".gmail_quote").forEach(q => q.remove());
        body = clone.innerText;

        // Remove sender/date shown at top
        if (from?.name)
            body = body.replace(from.name, "");

        if (date)
            body = body.replace(date, "");

        body = body.trim();
    }

    return {
        date,
        from,
        recipients,
        body,
        quoted: ""
    };
}

async function sendToBackend(emailData) {
    // console.log("Sending:", emailData);
    showLoading();

    try {
        const response = await fetch("http://127.0.0.1:8000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        console.log("Status:", response.status);
        const result = await response.json();
        // console.log("Backend Response:", result);
        displayResponse(result)

    } catch (err) {
        // console.error("Fetch Error:", err);
        displayError(err);
    }
}


function createSidePanel() {
    let panel = document.getElementById("cyline-panel");
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "cyline-panel";
    panel.innerHTML = `
        <div id="cyline-header">
            <span>testing </span>
            <button id="cyline-close">✕</button>
        </div>

        <div id="cyline-content">
            Waiting...
        </div>
    `;
    document.body.appendChild(panel);
    document.getElementById("cyline-close").addEventListener("click", () => {
        hidePanel();
    });
    return panel;
}

function showPanel() {
    const panel = createSidePanel();
    panel.classList.add("open");
}

function hidePanel() {
    const panel = document.getElementById("cyline-panel");

    if (panel)
        panel.classList.remove("open");
}

function displayResponse(result){
    const panel = createSidePanel();
    panel.querySelector("#cyline-content").innerHTML = `
        <p><b>Status</b></p>
        <p>${result.status}</p>

        <hr>

        <p><b>Subject</b></p>
        <p>${result.summary}</p>
    `;

    showPanel();
}

function showLoading() {
    const panel = createSidePanel();
    panel.querySelector("#cyline-content").innerHTML = `
        <div class="cyline-loading">
            <div class="cyline-spinner"></div>
            <p>Analyzing email...</p>
        </div>
    `;

    showPanel();
}

function displayError(error){
    const panel = createSidePanel();

    panel.querySelector("#cyline-content").innerHTML = `
        <h3>Something went wrong</h3>

        <p>${error.message}</p>
    `;
    showPanel();
}