console.log("Email Agent Loaded");

let button = null;
let timer = null;

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
        const email = extractEmail();
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

function extractEmail() {
    const subject = document.querySelector("h2.hP")?.innerText.trim() || "";
    const bodyElement = document.querySelector(".a3s.aiL");
    let body = "";

    if (bodyElement) {
        const quote = bodyElement.querySelector(".gmail_quote");
        if (quote)
            quote.remove();

        body = bodyElement.innerText.trim();
    }

    const date =
        document.querySelector(".g3")?.getAttribute("title") ||
        document.querySelector(".g3")?.innerText ||
        "";

    const senderElement = document.querySelector(".gD");
    const from = senderElement
        ? {
            name: senderElement.innerText.trim(),
            email: senderElement.getAttribute("email")
        }
        : null;

    const recipients = [...document.querySelectorAll(".hb .g2")].map(el => ({
        name: el.innerText.trim(),
        email: el.getAttribute("email")
    }));

    return {
        subject,
        date,
        from,
        recipients,
        body,
        quoted: ""

    };
}


// function extractEmail() {
//     const subject = document.querySelector("h2.hP")?.innerText.trim() || "";

//     const bodyElement = document.querySelector(".a3s.aiL");
//     let body = "";
//     if(bodyElement){
//         const quote = bodyElement.querySelector(".gmail_quote");
//         if(quote)
//             quote.remove();
//         body = bodyElement.innerText.trim();
//     }  
//     //not adding Quoted thing right now

//     const date =
//         document.querySelector("span.g3")?.getAttribute("title")
//         ||
//         document.querySelector("span.g3")?.innerText
//         ||
//         "";
//     // const sender = document.querySelector("span.gD")?.getAttribute("email")
//     // const cc = document.querySelector("span.ATvwCb")?.getAttribute("email")
//     // const people = extractRecipients();
//     const info = {};
//     document.querySelectorAll("table.ajC tr").forEach(row => {
//         const key = row.querySelector("th .gI")
//             ?.innerText
//             .replace(":", "")
//             .trim()
//             .toLowerCase();
//         const td = row.querySelector("td");

//         if (!key || !td)
//             return;

//         switch (key) {
//             case "from":
//             case "to":
//             case "cc":
//             case "bcc":
//                 info[key] = parsePeople(td);
//                 break;
//             default:
//                 info[key] = td.innerText.trim();
//         }

//     });
//     return {
//         subject: subject,
//         date: info.date||date,
//         body: body,
//         quoted: "",
//         from: info.from?.[0] || null,
//         to: info.to || [],
//         cc: info.cc || [],
//         bcc: info.bcc || []
//     };

// }

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