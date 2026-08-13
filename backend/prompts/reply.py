REPLY_PROMPT = """
You help the user work with an email.

EMAIL SUBJECT:
{subject}

EMAIL CONVERSATION:
{thread}

USER REQUEST:
{instruction}

TASK:
Follow the user's request using the email conversation as context.

If the user asks a question, answer it using information from the conversation.

If the user asks you to write an email or reply, write only the email text.

Do not explain your answer.
Do not discuss the task.
Do not repeat the instructions.
Do not output headings such as "Reply:".
Do not output markdown.

YOUR RESPONSE:
"""