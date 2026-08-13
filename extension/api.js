//previously SendtoBackend
async function getSummary(emailData) {
    // console.log("Sending:", emailData);
    showLoading();

    try {
        console.log("Sending summary request:", emailData);
        const response = await fetch("http://127.0.0.1:8000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        console.log("Status:", response.status);
        // const result = await response.json();
        return await response.json();
        // console.log("Backend Response:", result);
        // displayResponse(result)

    } catch (err) {
        displayError(err);
    }
}


async function getTasks(emailData) {
    showLoading();
    console.log("calling getTasks with...");
    console.log(emailData);
    try{
        const response = await fetch("http://127.0.0.1:8000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });
        console.log("Tasks status:", response.status);
        return await response.json();
        console.log("Tasks response:", data);
    } catch (err){
        console.error("Tasks request failed:", err);
        displayError(err);
        return {
            tasks: [],
            count: 0
        };
    }

}

async function getReply(email, instruction) {
    const response = await fetch("http://127.0.0.1:8000/reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subject: email.subject,
            thread: email.thread,
            instruction: instruction
        })
    });

    if (!response.ok) {
        throw new Error(`Reply request failed: ${response.status}`);
    }

    return await response.json();
}