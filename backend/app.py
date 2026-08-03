from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.llm import generate

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
    prompt = f"""
Subject:
{data.get("subject")}
Body:
{data.get("body")}
Tell me what this email is about in 2 sentence. do not overthink
"""
    answer = generate(prompt)
    return {
        "summary": answer
    }