from __future__ import annotations

import time

from llama_cpp import Llama, LlamaGrammar

_MODEL_PATH = r"D:\Cyline\models\Qwen3VL-8B-Instruct-Q4_K_M.gguf"
_GRAMMAR_PATH = r"D:\Cyline\projects\email_agent\backend\grammers\tasks.gbnf"
_REPLY_GRAMMAR_PATH = r"D:\Cyline\projects\email_agent\backend\grammers\reply.gbnf"

_llm: Llama | None = None
_tasks_grammar: LlamaGrammar | None = None
_reply_grammar: LlamaGrammar | None = None


def get_llm() -> Llama:
    global _llm
    if _llm is None:
        _llm = Llama(
            model_path=_MODEL_PATH,
            n_ctx=2048,
            n_threads=6,
            verbose=False,
            enable_thinking=False,
        )
    return _llm


def get_tasks_grammar() -> LlamaGrammar:
    global _tasks_grammar
    if _tasks_grammar is None:
        _tasks_grammar = LlamaGrammar.from_file(_GRAMMAR_PATH)
    return _tasks_grammar

def get_reply_grammar() -> LlamaGrammar:
    global _reply_grammar
    if _reply_grammar is None:
        _reply_grammar = LlamaGrammar.from_file(_REPLY_GRAMMAR_PATH)
    return _reply_grammar

def llm(*args, **kwargs):
    return get_llm()(*args, **kwargs)


def generate(
    prompt: str,
    max_tokens: int = 100,
    temperature: float = 0.2,
    top_p: float = 0.8,
    stop: list[str] | None = None,
    grammar: LlamaGrammar | None = None,
) -> str:

    # if stop is None:
    #     stop = ["\n\n"]

    start = time.perf_counter()

    kwargs = {
        "prompt": prompt,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
        "echo": False,
        "stop": stop,
    }
    if grammar is not None:
        kwargs["grammar"] = grammar

    response = get_llm()(**kwargs)

    elapsed = time.perf_counter() - start
    print(f"[LLM] {elapsed:.2f}s")

    text = response["choices"][0]["text"].strip()

    return text
