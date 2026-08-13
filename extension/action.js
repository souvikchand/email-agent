async function showSummary() {
    createSidePanel();
    showPanel();
    showLoading();
    if (!state.cache.summary) {
        state.cache.summary = await getSummary(state.currentEmail);
    }
    displayResponse(state.cache.summary);
}


async function showTasks() {
    createSidePanel();
    showPanel();
    showLoading();

    try {
        if (!state.cache.tasks) {
            state.cache.tasks = await getTasks(state.currentEmail);
        }

        console.log("TASK RESPONSE:", state.cache.tasks);

        if (state.cache.tasks.error) {
            displayError(state.cache.tasks.error);
            return;
        }

        console.log("TASK LIST:", state.cache.tasks.tasks);
        console.log("TASK COUNT:", state.cache.tasks.count);

        renderTaskTable(
            state.cache.tasks.tasks,
            state.cache.tasks.count
        );

    } catch (err) {
        console.error("showTasks error:", err);
        displayError(err);
    }
}

async function showReply() {
    // if (state.reply.result) {
    //     displayResponse(state.reply.result);
    //     return;
    // }

    showLoading();
    displayReplyUI();

    // try {
    //     const response = await getReply(state.currentEmail);
    //     state.reply.result = response.reply;
    //     displayResponse(response.reply);
    // } catch (error) {
    //     console.error("Reply error:", error);
    //     displayResponse("Failed to generate reply.");
    // }
}

// ============== working ==================
// async function generateReply() {
//     const instruction = state.reply.instruction.trim();
//     if (!instruction) {
//         return;
//     }
//     showLoading();

//     try {
//         const response = await getReply(
//             state.currentEmail,
//             instruction
//         );
//         state.reply.result = response.reply;
//         displayReplyResult(response.reply);

//     } catch (error) {
//         console.error("Reply generation failed:", error);
//         displayReplyResult("Failed to generate reply.");
//     }
// }
// ============= working =================

async function generateReply() {
    const instruction = state.reply.instruction.trim();
    if (!instruction) {
        return;
    }
    // Make sure state contains the email currently visible in Gmail
    // await updateCurrentEmail();
    await ensureCurrentEmail();
    showLoading();
    try {
        const response = await getReply(
            state.currentEmail,
            instruction
        );
        state.reply.result = response.reply;
        displayReplyResult(response.reply);

    } catch (error) {
        console.error("Reply generation failed:", error);
        displayReplyResult("Failed to generate a response.");
    }
}