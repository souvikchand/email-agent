# Email Agent

**Version:** 2.1.1  
**Author:** zd

---

## About

Email Agent is an intelligent email processing system that leverages large language models (LLMs) to automate email analysis and task extraction. It combines a FastAPI backend with a browser extension frontend to provide seamless email summarization, thread extraction, and task identification directly from your email client.

The system uses locally-run GGUF models (quantized models) for privacy-preserving email analysis without sending data to external servers.

---

## Features

✅ Thread extraction  
✅ Whole-thread summarization  
✅ Task extraction  
✅ Smart reply generation
🔜 Response-time optimization (persistent model, prompt cleanup, streaming)  
🔜 Vector database for semantic search  
🔜 Chat over previous email threads  


---

## File Structure

```
email_agent/
├── README.md                 # Project documentation
├── record.txt                # Email records/logs
├── requirements.txt          # all dependencies
│
├── backend/
│   ├── app.py              # FastAPI main application
│   ├── grammers/           # GBNF grammar files for LLM
│   │   ├── reply.gbnf      # Grammar for reply generation
│   │   └── tasks.gbnf      # Grammar for task extraction
│   ├── prompts/            # Prompt templates for LLM
│   │   ├── reply.py        # Reply generation prompts
│   │   ├── summarize.py    # Summarization prompts
│   │   └── task.py         # Task extraction prompts
│   ├── services/           # Core services
│   │   └── llm.py          # LLM model management & inference
│   └── utils/              # Utility functions
│       └── email_cleaner.py # Email text processing
│
└── extension/              # Browser extension (frontend)
    ├── manifest.json       # Extension configuration
    ├── action.js           # Background script & actions
    ├── api.js              # Backend communication
    ├── content.js          # Content script for email injection
    ├── extractor.js        # Email data extraction
    ├── panel.js            # UI panel logic
    ├── styles.css          # Extension styling
    └── icons/              # Extension icons
```

---

## Use Case Example

### Scenario: Managing Busy Email Inbox

**User:** Project Manager with 100+ emails daily

**Problem:** Manually reading and organizing emails is time-consuming. Need to:
- Extract action items from email threads
- Quickly summarize long email conversations
- Track tasks assigned to team members
- Generate professional replies

**Solution with Email Agent:**

1. **Thread Summarization**
   - User clicks extension icon on an email thread
   - System reads entire thread and generates concise summary
   - Manager gets key points without reading all messages

2. **Task Extraction**
   - Extension automatically identifies action items: "Review proposal by Friday", "Send updated document"
   - Tasks are extracted with context and deadline info
   - Results displayed in clean UI for task management

3. **Smart Workflow**
   - Time saved: 1-2 hours per day on email processing
   - Better task tracking and prioritization
   - No data leaves private network (GGUF models run locally)

**Example Output:**
```
Email Summary:
The client approved the project scope but requested timeline extension 
to Q2. Resource allocation discussion needed with team.

Extracted Tasks:
- Update project timeline to Q2 ✓
- Schedule resource allocation meeting ✓
- Send timeline confirmation to client ✓
```

---

## Installation Guide

### Prerequisites

- Python 3.12
- pip (Python package manager)
- Browser (Chrome/Firefox for extension)
- 16GB+ RAM (for GGUF model inference)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd email_agent/backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   Dependencies include:
   - FastAPI
   - Uvicorn (ASGI server)
   - Llama-cpp-python (GGUF model inference)
   - Pydantic (data validation)

3. **Download GGUF Models:**
   
   Place models in the `models/` directory at workspace root:
   - `Qwen2.5-Coder-3B` (for code/task extraction)
   - `Qwen3VL-8B` (for complex email parsing)
   - Or any compatible GGUF quantized model

4. **Start the backend server:**
   ```bash
   uvicorn app:app --reload --host 127.0.0.1 --port 8000
   ```
   
   Server will be available at: `http://localhost:8000`

### Extension Setup (Browser)

1. **Load Extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select `email_agent/extension/` folder

2. **Load Extension in Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `email_agent/extension/manifest.json`

3. **Configure Backend URL:**
   - Update `api.js` with your backend server URL
   - Default: `http://localhost:8000`

### Usage

1. Start the backend server
2. Load the extension in your browser
3. Navigate to any email in your email client
4. Click the extension icon to:
   - Summarize email thread
   - Extract tasks
   - Generate replies

---

## Version History

```
0.1   : Email scraping functionality
0.2   : FastAPI backend integration
0.3   : Improved scraping mechanism
0.4   : GGUF model integration for summarization
0.5   : Thread-level scraping and API processing
0.6   : Task extraction feature added
0.7   : Scalable UI button design
0.7.1 : Frontend task feature implementation
1.0.1 : Task extraction with grammar support
1.0.2 : UI dropdown fixes
1.0.3 : Threading fix for single emails
2.0.0 : Added Reply Feature
2.1.0 : fix bugs
2.1.1 : Rewrote Readme and requirements.txt
```

---

## Troubleshooting

- **Model not loading?** Ensure GGUF files are in correct directory with proper permissions
- **Extension not connecting?** Verify backend URL in `api.js` matches running server
- **High memory usage?** Reduce model size or use quantized versions (Q4_K_M)

---

For more information or contributions, please contact the project author.