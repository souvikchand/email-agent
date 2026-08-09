TASK_PROMPT = """
/no think
Extract action items from the email thread.

For each action item identify:
- assignee
- task
- due_date
- status

Use "Unknown" if the assignee is unknown.
Use null if no due date is mentioned.
Status must be pending, completed, or in progress.
Do not invent tasks.

Email Thread:

{thread}
"""