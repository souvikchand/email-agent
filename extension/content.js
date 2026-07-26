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
        const detailsButton = document.querySelector(".ajy");
        detailsButton.click();
        await waitForPopup();
        const email = extractEmail();
        //alert("Button Clicked");
        detailsButton.click();
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
    if(bodyElement){
        const quote = bodyElement.querySelector(".gmail_quote");
        if(quote)
            quote.remove();
        body = bodyElement.innerText.trim();
    }  
    //not adding Quoted thing right now

    const date =
        document.querySelector("span.g3")?.getAttribute("title")
        ||
        document.querySelector("span.g3")?.innerText
        ||
        "";
    // const sender = document.querySelector("span.gD")?.getAttribute("email")
    // const cc = document.querySelector("span.ATvwCb")?.getAttribute("email")
    // const people = extractRecipients();
    const info = {};
    document.querySelectorAll("table.ajC tr").forEach(row => {
        const key = row.querySelector("th .gI")
            ?.innerText
            .replace(":", "")
            .trim()
            .toLowerCase();
        const td = row.querySelector("td");

        if (!key || !td)
            return;

        switch (key) {
            case "from":
            case "to":
            case "cc":
            case "bcc":
                info[key] = parsePeople(td);
                break;
            default:
                info[key] = td.innerText.trim();
        }

    });
    return {
        subject: subject,
        date: info.date||date,
        body: body,
        quoted: "",
        from: info.from?.[0] || null,
        to: info.to || [],
        cc: info.cc || [],
        bcc: info.bcc || []
    };

}