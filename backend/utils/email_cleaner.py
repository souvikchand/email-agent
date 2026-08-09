import ast
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
    "\nlet's",
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

def extract_json(text):
    if isinstance(text, (dict, list)):
        return text

    if not isinstance(text, str):
        raise TypeError("Expected a string or JSON-compatible object")

    # Remove markdown fences if present
    text = text.strip().replace("```json", "").replace("```", "").strip()
    if not text:
        raise ValueError("Empty response")

    # Try standard JSON first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Handle responses that are wrapped in quotes, e.g. '{"tasks": []}'
    if len(text) >= 2 and ((text[0] == '"' and text[-1] == '"') or (text[0] == "'" and text[-1] == "'")):
        try:
            return json.loads(text[1:-1])
        except json.JSONDecodeError:
            pass

    # Handle Python-style dict/list literals (single quotes, None, True/False)
    try:
        parsed = ast.literal_eval(text)
        if isinstance(parsed, (dict, list)):
            return parsed
    except (ValueError, SyntaxError):
        pass

    # Try to extract the first JSON object/array from surrounding text
    for start_char, end_char in (("{", "}"), ("[", "]")):
        start = text.find(start_char)
        if start == -1:
            continue

        depth = 0
        for i in range(start, len(text)):
            if text[i] == start_char:
                depth += 1
            elif text[i] == end_char:
                depth -= 1
                if depth == 0:
                    candidate = text[start:i + 1]
                    try:
                        return json.loads(candidate)
                    except json.JSONDecodeError:
                        try:
                            parsed = ast.literal_eval(candidate)
                            if isinstance(parsed, (dict, list)):
                                return parsed
                        except (ValueError, SyntaxError):
                            pass
                    break

    raise ValueError("No valid JSON object found.")