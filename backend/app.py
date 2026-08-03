from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.llm import generate
from prompts.summarize import build_summary_prompt
from utils.email_cleaner import remove_signature, remove_reasoning

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
    data['body'] = remove_signature(data['body'])
    prompt = build_summary_prompt(data)
    answer = generate(prompt)
    answer = remove_reasoning(answer)
    return {
        "summary": answer,
        "status": "200"
    }