from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json

from services.llm import generate, get_llm, get_tasks_grammar
from prompts.summarize import build_summary_prompt
from utils.email_cleaner import remove_signature, remove_reasoning, clean_thread
from utils.email_cleaner import extract_json
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
    answer = generate(prompt,grammar=None)
    answer = remove_reasoning(answer)
    return {
        "summary": answer,
        "status": "200"
    }


@app.post("/tasks")
async def extract_tasks(data: dict):
    print("====data====")
    data['thread'] = clean_thread(data['thread'])
    thread = json.dumps(data["thread"],indent=2, ensure_ascii=False)
    print("====thread====")
    prompt = TASK_PROMPT.replace("{thread}", thread)
    print("====prompt====")
    response = generate(prompt,
                        max_tokens=500,
                        temperature=0.2,
                        top_p=0.8,
                        grammar=get_tasks_grammar()
                        )
    print("\n========== RAW LLM RESPONSE ==========")
    print(repr(response))
    response = remove_reasoning(response)
    print("\n========== AFTER REMOVE_REASONING ==========")
    print(repr(response))
    
    try:
        tasks = extract_json(response)
        print("\n========== EXTRACTED TASKS ==========")
        print(tasks)
        print("====================================\n")
        return JSONResponse(content={
            "tasks": tasks,
            "count": len(tasks)
        })

    except Exception as e:
        print("TASK EXTRACTION ERROR:", e)
        print("RAW LLM RESPONSE:")
        print(response)
        return JSONResponse(
            status_code=200,
            content={
                "tasks": [],
                "count": 0,
                "error": "Failed to extract tasks from LLM response"
            }
        )
    