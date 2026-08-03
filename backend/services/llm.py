from llama_cpp import Llama

llm = Llama(
    model_path=r"D:\Cyline\models\Qwen3-8B-Q4_K_M.gguf",   # Change to your path
    n_ctx=2048,
    n_threads=8,
    verbose=False
)

def generate(prompt: str) -> str:
    response = llm(
        prompt,
        max_tokens=80,
        temperature=0.3,
        echo=False,
        #c_ntx= 1024,
    )

    return response["choices"][0]["text"].strip()