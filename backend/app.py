from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.llm import generate
from prompts.summarize import build_summary_prompt
from utils.email_cleaner import remove_signature, remove_reasoning, clean_thread
from utils.email_cleaner import extract_json
from fastapi.responses import JSONResponse
import json
# from provider import generate
from prompts.task import TASK_PROMPT

app = FastAPI()

# Allow requests from Chrome extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Later restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/email")
async def receive_email(data: dict):

    print("\n========== EMAIL RECEIVED ==========")
    print(data)
    print("====================================\n")

    return {
        "status": "success",
        "message": "Backend received email",
        "subject": data.get("subject")
    }


@app.post("/summarize")
async def summarize(data: dict):
    data['thread'] = clean_thread(data['thread'])
    prompt = build_summary_prompt(data)
    answer = generate(prompt)
    answer = remove_reasoning(answer)
    return {
        "summary": answer,
        "status": "200"
    }


@app.post("/tasks")
async def extract_tasks(data: dict):
    data['threads'] = clean_thread(data['threads'])
    thread = json.dumps(data["threads"], indent=2)
    prompt = TASK_PROMPT.replace("{thread}", thread)
    response = generate(prompt,max_tokens=300, temperature=0.2, top_p=0.8, stop=["\nexiing\n"])
    response = remove_reasoning(response)
    
    try:
        tasks = extract_json(response)
        return JSONResponse(content=tasks)

    except Exception as e:
        print(e)
        print(response)
        return JSONResponse(
            status_code=500,
            content={
                "tasks": [],
                "count": 0
            }
        )