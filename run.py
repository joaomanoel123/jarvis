import multiprocessing
import subprocess
import os
import sys
import importlib.util

# Garante que o diretório do projeto esteja no sys.path e como CWD
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Importador robusto do start()

def _load_start_function():
    # 1) Tenta importar por nome (normal)
    try:
        from main_opera import start
        return start
    except ModuleNotFoundError:
        pass
    # 2) Fallback para main.py
    try:
        from main import start
        return start
    except ModuleNotFoundError:
        pass
    # 3) Carregar diretamente pelo caminho do arquivo (contorna problemas com paths acentuados)
    for fname in ("main_opera.py", "main.py"):
        fpath = os.path.join(BASE_DIR, fname)
        if os.path.exists(fpath):
            spec = importlib.util.spec_from_file_location("_jarvis_main_module", fpath)
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                try:
                    spec.loader.exec_module(module)  # type: ignore
                    if hasattr(module, "start"):
                        return getattr(module, "start")
                except Exception as e:
                    print(f"❌ Erro ao carregar {fname} por caminho: {e}")
    raise ModuleNotFoundError("Não foi possível localizar a função start() em main_opera.py ou main.py")

# To run Jarvis

def startJarvis():
    # Code for process 1
    print("Process 1 is running.")
    start = _load_start_function()
    start()

# To run hotword

def listenHotword():
    # Code for process 2
    print("Process 2 is running.")
    from engine.features import hotword
    hotword()


# Start both processes
if __name__ == '__main__':
    # Em alguns ambientes, 'spawn' evita problemas de importação
    try:
        multiprocessing.set_start_method('spawn', force=True)
    except Exception:
        pass

    p1 = multiprocessing.Process(target=startJarvis)
    p2 = multiprocessing.Process(target=listenHotword)
    p1.start()
    p2.start()
    p1.join()

    if p2.is_alive():
        p2.terminate()
        p2.join()

    print("system stop")
