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