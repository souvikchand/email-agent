from llama_cpp import Llama
import time

llm = Llama(
    model_path=r"D:\Cyline\models\Qwen3-8B-Q4_K_M.gguf",   # Change to your path
    n_ctx=1024,
    n_threads=6,
    verbose=False,
    enable_thinking=False,
)

def generate(
    prompt: str,
    max_tokens: int = 100,
    temperature: float = 0.2,
    top_p: float = 0.8,
    stop: list[str] | None = None,
    ) -> str:

    if stop is None:
        stop = ["\n\n"]

    start = time.perf_counter()

    response = llm(
        prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        echo=False,
        stop=stop,
    )

    elapsed = time.perf_counter() - start
    print(f"[LLM] {elapsed:.2f}s")

    text = response["choices"][0]["text"].strip()

    return text