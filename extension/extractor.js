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