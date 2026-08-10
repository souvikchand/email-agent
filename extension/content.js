console.log("Email Agent Loaded");

let button = null;
let timer = null;
let emailAgentContainer = null;
const THREAD_SELECTORS = [
    ".kv",
    ".h7.bg.ie"
];

const state = {
    currentAction:"summary",
    currentEmail:null,
    cache:{
        summary:null,
        tasks:null,
        reply:null
    }
};

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
    // Container
    // const container = document.createElement("div");
    emailAgentContainer = document.createElement("div");
    emailAgentContainer.className = "email-agent-container";
    // container.id = "email-agent-container";
    // container.className = "email-agent-container";

    // Main action button
    button = document.createElement("button");
    button.innerText = "Summarize";
    button.className = "email-agent-btn";

    // Existing action execution
    button.onclick = onActionButtonClick;

    // Dropdown button
    const dropdownButton = document.createElement("button");
    dropdownButton.innerText = "▼";
    dropdownButton.className = "email-agent-dropdown-btn";

    // Dropdown click ONLY opens/closes menu
    dropdownButton.onclick = function (event) {
        event.stopPropagation();

        const menu = document.getElementById("email-agent-menu");

        if (menu.style.display === "none") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    };

    // Add both buttons to container
    emailAgentContainer.appendChild(button);
    emailAgentContainer.appendChild(dropdownButton);

    document.body.appendChild(emailAgentContainer);

    // -------------------------
    // Action menu
    // -------------------------

    const menu = document.createElement("div");
    menu.id = "email-agent-menu";
    menu.style.display = "none";

    const actions = [
        ["Summary", "summary"],
        ["Tasks", "tasks"],
        ["Reply", "reply"]
    ];

    actions.forEach(([label, value]) => {
        const item = document.createElement("div");

        item.innerText = label;
        item.className = "email-agent-menu-item";

        item.onclick = function (event) {
            event.stopPropagation();

            // Only SELECT the action
            state.currentAction = value;

            // Change main button text
            button.innerText = label;

            // Close menu
            menu.style.display = "none";
            console.log("Current action:", state.currentAction);
        };
        menu.appendChild(item);
    });
    emailAgentContainer.appendChild(menu);
    console.log("Button Added");
}



function hideButton() {
    if (!emailAgentContainer) return;
    emailAgentContainer.remove();
    emailAgentContainer = null;
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


//===new===
async function runCurrentAction() {
    switch (state.currentAction) {

        case "summary":
            await showSummary();
            break;

        case "tasks":
            await showTasks();
            break;

        case "reply":
            // await showReply();
            break;
    }
}

async function onActionButtonClick() {
    const email = {
        "subject":extractSubject(),
        "thread": extractThread(),
    }
    state.currentEmail = email;
    // Reset cache for the newly opened email
    state.cache = {
        summary: null,
        tasks: null,
        reply: null
    };
    await runCurrentAction();
}

//====observers
const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(checkPage, 300);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
checkPage();