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
        <hr>
        <p><b>Summary</b></p>
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

function renderTaskTable(tasks, count) {
    const panel = createSidePanel();
    const content = panel.querySelector("#cyline-content");
    if (!content) {
        console.error("renderTaskTable: #cyline-content not found");
        return;
    }

    // This removes the loading spinner
    content.innerHTML = "";

    // Total tasks
    const countText = document.createElement("p");
    countText.id = "taskCount";
    countText.innerHTML = `<b>Total tasks:</b> ${count}`;
    content.appendChild(countText);

    // Table
    const table = document.createElement("table");
    table.id = "taskTable";
    table.innerHTML = `
        <thead>
            <tr>
                <th>Assignee</th>
                <th>Task</th>
                <th>Due</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    tasks.forEach(task => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.assignee}</td>
            <td>${task.task}</td>
            <td>${task.due_date ?? "None"}</td>
            <td>${task.status}</td>
        `;
        tbody.appendChild(row);
    });
    content.appendChild(table);
    showPanel();
}

function displayReplyUI() {
    const panel = createSidePanel();
    panel.querySelector("#cyline-content").innerHTML = `
        <div class="cyline-reply">

            <div class="cyline-reply-title">
                Reply Assistant
            </div>

            <div class="cyline-reply-subtitle">
                Ask a question about this email or tell me what to write.
            </div>

            <textarea
                id="reply-instruction"
                class="cyline-reply-input"
                placeholder="e.g. Write a polite confirmation..."
            ></textarea>

            <button id="reply-generate" class="cyline-generate-btn">
                Generate
            </button>

        </div>
    `;

    const textarea =
        panel.querySelector("#reply-instruction");

    const button =
        panel.querySelector("#reply-generate");

    textarea.addEventListener("input", () => {
        state.reply.instruction = textarea.value;
    });

    button.addEventListener("click", async () => {
        await generateReply();
    });
    showPanel();
}


function displayReplyResult(result) {
    const panel = createSidePanel();
    panel.querySelector("#cyline-content").innerHTML = `
        <div class="cyline-reply">

            <div class="cyline-reply-title">
                Reply Assistant
            </div>

            <div class="cyline-reply-subtitle">
                Ask a question or generate a reply from the email context.
            </div>

            <textarea
                id="reply-instruction"
                class="cyline-reply-input"
            >${state.reply.instruction}</textarea>

            <button id="reply-generate" class="cyline-generate-btn">
                Generate
            </button>

            <div class="cyline-response-label">
                Response
            </div>

            <div class="cyline-response-card">
            ${result}
            </div>

        </div>
    `;

    const textarea =
        panel.querySelector("#reply-instruction");

    const button =
        panel.querySelector("#reply-generate");

    textarea.addEventListener("input", () => {
        state.reply.instruction = textarea.value;
    });

    button.addEventListener("click", async () => {
        await generateReply();
    });

    showPanel();
}