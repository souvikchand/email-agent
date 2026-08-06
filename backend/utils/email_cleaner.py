import json
SIGNATURE_MARKERS = [
    # Common closings
    "thanks",
    "thanks & regards",
    "thanks and regards",
    "warm regards",
    "kind regards",
    "best regards",
    "regards",
    "sincerely",
    "cheers",

    # Common signatures
    "sent from my iphone",
    "sent from my android",
    "this email was sent from",

    # Organization blocks
    "iit madras",
    "iitm bs degree",
]

FOOTER_MARKERS = [
    "this email is confidential",
    "the information contained in this email",
    "please consider the environment",
    "to unsubscribe",
    "unsubscribe",
    "do not reply to this email",
    "this message and any attachments",
    "this communication is intended",
]

THINKING_MARKERS = [
    "\nOkay",
    "\nOK",
    "\nLet me",
    "\nLet's see",
    "\nI will",
    "\nFirst",
    "\nThe user wants",
    "\nI need to",
    "\nI should",
    r"\bokay[, ]",
    r"\bok[, ]",
    r"\blet me\b",
    r"\bfirst[, ]",
    r"\bi need to\b",
    r"\bi should\b",
    r"\bthe user wants\b",
    r"\bthe task is\b",
    r"\bthinking\b",
]

MARKERS = SIGNATURE_MARKERS + FOOTER_MARKERS

def remove_signature(body: str) -> str:
    lower = body.lower()
    cut = len(body)
    for marker in MARKERS:
        idx = lower.find(marker)
        if idx != -1:
            cut = min(cut, idx)
    return body[:cut].strip()

def clean_thread(thread: list) -> list:
    for email in thread:
        if "body" in email:
            email["body"] = remove_signature(email["body"])
    return thread

def remove_reasoning(text: str) -> str:
    cut = len(text)
    for marker in THINKING_MARKERS:
        idx = text.find(marker)
        if idx != -1:
            cut = min(cut, idx)

    return text[:cut].strip()

def extract_json(text: str):
    # Remove markdown fences if present
    text = text.replace("```json", "").replace("```", "")

    # Find the first JSON object
    start = text.find("{")
    if start == -1:
        raise ValueError("No JSON object found.")

    depth = 0

    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1

            if depth == 0:
                json_str = text[start:i + 1]
                return json.loads(json_str)

    raise ValueError("Incomplete JSON.")