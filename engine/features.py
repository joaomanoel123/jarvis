import os
import platform
import shlex
import sqlite3
import struct
import subprocess
import time
import webbrowser
from playsound import playsound  # type: ignore
import eel  # type: ignore
import pyaudio
import pyautogui
from engine.command import speak  # type: ignore
from engine.config import ASSISTANT_NAME
import pywhatkit as kit
import urllib.parse
import pvporcupine  # type: ignore
import requests
import json
from typing import Dict
from dotenv import load_dotenv

from engine.helper import extract_yt_term, remove_words  # type: ignore

# Carregar variáveis de ambiente
load_dotenv()

# Importar configuração segura
try:
    from engine.secure_config import get_google_api_key
    SECURE_CONFIG_AVAILABLE = True
except ImportError:
    SECURE_CONFIG_AVAILABLE = False
    print("⚠️ Configuração segura não disponível")

# Importar funcionalidades seguras
try:
    from engine.secure_features import secure_media, setup_secure_features
    SECURE_FEATURES_AVAILABLE = True
except ImportError:
    SECURE_FEATURES_AVAILABLE = False
    print("⚠️ Funcionalidades seguras não disponíveis")

con = sqlite3.connect("jarvis.db")
cursor = con.cursor()

@eel.expose
def playAssistantSound():
    music_dir = "www/assets/audio/start_sound.mp3"
    playsound(music_dir)

def openCommand(query: str):
    query = query.replace(ASSISTANT_NAME, "")
    query = query.replace("open", "")
    query = query.replace("abrir", "")
    query = query.replace("abra", "")
    query = query.lower()

    app_name = query.strip()

    # Verificar se é WhatsApp especificamente
    if "whatsapp" in app_name or "whats" in app_name:
        openWhatsApp()
        return

    if app_name != "":
        try:
            cursor.execute(
                'SELECT path FROM sys_command WHERE name IN (?)', (app_name,))
            results = cursor.fetchall()

            if len(results) != 0:
                speak("Abrindo " + app_name)
                subprocess.Popen([results[0][0]])

            elif len(results) == 0:
                cursor.execute(
                    'SELECT url FROM web_command WHERE name IN (?)', (app_name,))
                results = cursor.fetchall()

                if len(results) != 0:
                    speak("Abrindo " + app_name)
                    webbrowser.open(results[0][0])

                else:
                    speak("Abrindo " + app_name)
                    try:
                        # Tentar abrir aplicativo genérico
                        if platform.system() == "Windows":
                            os.system(f'start {app_name}')
                        elif platform.system() == "Darwin":  # macOS
                            os.system(f'open -a "{app_name}"')
                        else:  # Linux
                            os.system(f'{app_name} &')
                    except:
                        speak("Não encontrado")
        except Exception as e:
            speak(f"Algo deu errado: {e}")
    else:
        speak("Por favor, me diga qual aplicativo você quer abrir")

def PlayYoutube(query: str):
    """Reproduz vídeo no YouTube com opção de autenticação facial"""
    
    # Verificar se funcionalidades seguras estão disponíveis
    if SECURE_FEATURES_AVAILABLE:
        # Perguntar se deseja usar modo seguro
        speak("Deseja usar modo seguro com autenticação facial?")
        print("🔒 Modo seguro disponível - digite 'seguro' para usar autenticação facial")
        print("🌍 Ou pressione Enter para modo público")
        
        try:
            # Aguardar resposta por 5 segundos
            import select
            import sys
            
            if select.select([sys.stdin], [], [], 5):
                response = input().lower()
                if 'seguro' in response or 'facial' in response:
                    speak("Usando modo seguro com autenticação facial")
                    return secure_media.youtube.search_and_play(query)
        except:
            pass  # Continuar com modo normal se houver erro
    
    # Modo normal (público)
    search_term = extract_yt_term(query)
    if search_term:
        speak("Reproduzindo " + search_term + " no YouTube")
        kit.playonyt(search_term)  # type: ignore
    else:
        speak("Não foi possível determinar o que reproduzir no YouTube.")

def searchGoogle(query: str):
    """Função para pesquisar no Google"""
    # Remover palavras de comando
    search_terms = query.replace(ASSISTANT_NAME, "")
    search_terms = search_terms.replace("pesquisar", "")
    search_terms = search_terms.replace("pesquise", "")
    search_terms = search_terms.replace("procurar", "")
    search_terms = search_terms.replace("procure", "")
    search_terms = search_terms.replace("buscar", "")
    search_terms = search_terms.replace("busque", "")
    search_terms = search_terms.replace("no google", "")
    search_terms = search_terms.replace("google", "")
    search_terms = search_terms.strip()
    
    if search_terms:
        speak(f"Pesquisando {search_terms} no Google")
        # Usar pywhatkit para pesquisar no Google
        try:
            kit.search(search_terms)
            speak(f"Aqui estão os resultados da pesquisa para {search_terms}")
        except Exception as e:
            # Fallback: abrir Google com a pesquisa manualmente
            import urllib.parse
            encoded_query = urllib.parse.quote(search_terms)
            google_url = f"https://www.google.com/search?q={encoded_query}"
            webbrowser.open(google_url)
            speak(f"Abrindo pesquisa do Google para {search_terms}")
    else:
        speak("Por favor, me diga o que você quer pesquisar no Google")

def hotword():
    """
    Função de detecção de hotword usando Porcupine
    Requer chave válida do Picovoice
    """
    porcupine = None
    paud = None
    audio_stream = None
    
    try:
        # Ler a access_key do .env ou cookies.json
        access_key = os.getenv('PORCUPINE_ACCESS_KEY')
        
        if not access_key or access_key == 'your_porcupine_access_key_here':
            # Fallback para cookies.json
            try:
                print("🔍 Tentando ler access_key do cookies.json...")
                with open("engine/cookies.json", "r") as f:
                    cookies = json.load(f)
                access_key = cookies.get("access_key")
            except FileNotFoundError:
                print("⚠️ Arquivo cookies.json não encontrado")
        
        # Verificar se a chave está configurada
        if not access_key or access_key == 'YOUR_PORCUPINE_ACCESS_KEY_HERE' or access_key == '':
            print("⚠️ Chave Porcupine não configurada. Hotword detection desabilitado.")
            print("💡 Para ativar o hotword:")
            print("   1. Acesse: https://picovoice.ai/")
            print("   2. Crie uma conta gratuita")
            print("   3. Obtenha sua Access Key")
            print("   4. Configure no arquivo .env: PORCUPINE_ACCESS_KEY=sua_chave")
            print("   5. Ou configure no cookies.json")
            return
        
        print(f"🔑 Access Key: {access_key[:10]}...")
        
        # Inicializar o Porcupine com a access_key
        print("🎙️ Inicializando Porcupine...")
        porcupine = pvporcupine.create(access_key=access_key, keywords=["jarvis", "alexa"])
        print("✅ Porcupine inicializado com sucesso!")
        print("🎧 Hotword detection ativo - diga 'Jarvis' ou 'Alexa'")

        # Configurar PyAudio
        paud = pyaudio.PyAudio()
        audio_stream = paud.open(
            rate=porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=porcupine.frame_length
        )

        while True:
            keyword = audio_stream.read(porcupine.frame_length)
            keyword = struct.unpack_from("h" * porcupine.frame_length, keyword)

            keyword_index = porcupine.process(keyword)

            if keyword_index >= 0:
                print("🎙️ Hotword detectado!")
                
                # Ativar Jarvis
                pyautogui.keyDown("win")
                pyautogui.press("j")
                time.sleep(2)
                pyautogui.keyUp("win")

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error in hotword detection: {error_msg}")
        
        # Mensagens de erro mais informativas
        if "AccessKey is invalid" in error_msg or "Failed to parse AccessKey" in error_msg:
            print("⚠️ CHAVE PORCUPINE INVÁLIDA")
            print("💡 SOLUÇÃO:")
            print("   1. Acesse: https://picovoice.ai/")
            print("   2. Faça login ou crie uma conta gratuita")
            print("   3. Vá para 'Console' > 'AccessKey'")
            print("   4. Copie sua chave válida")
            print("   5. Configure no .env: PORCUPINE_ACCESS_KEY=sua_chave_aqui")
            print("")
            print("🚫 Por enquanto, o hotword está desabilitado")
            print("✅ Você ainda pode usar o Jarvis pela interface web")
        elif "Picovoice Error" in error_msg:
            print("⚠️ ERRO DO PICOVOICE")
            print("💡 Possíveis causas:")
            print("   - Chave expirada ou inválida")
            print("   - Limite de uso excedido")
            print("   - Problema de conectividade")
        else:
            print(f"⚠️ Erro desconhecido: {error_msg}")
            
    finally:
        if porcupine is not None:
            porcupine.delete()
        if audio_stream is not None:
            audio_stream.close()
        if paud is not None:
            paud.terminate()

def findContact(query: str):
    words_to_remove = [ASSISTANT_NAME, 'fazer', 'uma', 'para', 'ligar', 'ligação', 'enviar', 'mensagem', 'whatsapp', 'vídeo', 'videochamada', 'chamada']
    query = remove_words(query, words_to_remove)

    try:
        query = query.strip().lower()
        cursor.execute("SELECT mobile_no FROM contacts WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?", ('%' + query + '%', query + '%'))
        results = cursor.fetchall()
        
        if not results:
            speak('Contato não encontrado na base de dados')
            return 0, 0
            
        mobile_number_str = str(results[0][0])

        if not mobile_number_str.startswith('+91'):
            mobile_number_str = '+91' + mobile_number_str

        return mobile_number_str, query
    except Exception as e:
        print(f"Erro ao encontrar contato: {e}")
        speak('Erro ao acessar a base de dados de contatos')
        return 0, 0

def whatsApp(mobile_no: str, message: str, flag: str, name: str):
    """Funcionalidade WhatsApp com opção de modo seguro"""
    
    # Verificar se funcionalidades seguras estão disponíveis
    if SECURE_FEATURES_AVAILABLE:
        speak("Modo seguro com autenticação facial disponível")
        speak("Diga 'seguro' para usar autenticação facial ou continue para modo normal")
        
        try:
            import select
            import sys
            
            if select.select([sys.stdin], [], [], 5):
                response = input().lower()
                if 'seguro' in response or 'facial' in response:
                    speak("Usando WhatsApp com autenticação facial")
                    if message:
                        return secure_media.whatsapp.send_message_web(message)
                    else:
                        return secure_media.whatsapp.quick_message()
        except:
            pass  # Continuar com modo normal
    
    # Modo normal (original)
    if flag == 'message':
        target_tab = 12
        jarvis_message = "Mensagem enviada com sucesso para " + name

    elif flag == 'call':
        target_tab = 7
        message = ''
        jarvis_message = "Ligando para " + name

    else:
        target_tab = 6
        message = ''
        jarvis_message = "Iniciando videochamada com " + name

    encoded_message = shlex.quote(message)
    whatsapp_url = f"whatsapp://send?phone={mobile_no}&text={encoded_message}"

    full_command = f'start "" "{whatsapp_url}"'

    subprocess.run(full_command, shell=True)
    time.sleep(5)
    subprocess.run(full_command, shell=True)

    pyautogui.hotkey('ctrl', 'f')

    for _ in range(1, target_tab):
        pyautogui.hotkey('tab')

    pyautogui.hotkey('enter')
    speak(jarvis_message)

# chat bot com Google Gemini com sistema de retry robusto

def chatBotGemini(query: str):
    """Chatbot Gemini com sistema de retry otimizado"""
    user_input = query.strip()

    google_api_key = _get_google_api_key()
    if not google_api_key:
        speak("Chave da API do Google Gemini não configurada")
        return "❌ API Key ausente"

    models_to_try = [
        'gemini-1.5-flash',
        'gemini-1.0-pro'
    ]

    for model_name in models_to_try:
        print(f"🤖 Tentando modelo: {model_name}")

        result = _try_gemini_library(user_input, google_api_key, model_name, max_retries=1)
        if result:
            return result

        result = _try_gemini_rest_api(user_input, google_api_key, model_name, max_retries=1)
        if result:
            return result

    print("⚠️ Gemini indisponível, usando fallback")
    return _fallback_response(user_input)


def _get_google_api_key():
    """Obter chave API do Google de múltiplas fontes"""
    # Tentar .env primeiro
    api_key = os.getenv('GOOGLE_API_KEY')
    
    if not api_key or api_key == 'your_google_api_key_here':
        # Fallback para cookies.json
        try:
            with open("engine/cookies.json", "r") as f:
                cookies = json.load(f)
            api_key = cookies.get("google_api_key")
        except FileNotFoundError:
            pass
    
    if api_key and api_key != 'YOUR_GOOGLE_API_KEY_HERE':
        return api_key
    
    return None

def _try_gemini_library(user_input: str, api_key: str, model_name: str, max_retries: int = 3):
    """Tentar usar biblioteca oficial do Google Gemini"""
    try:
        import google.generativeai as genai
        
        # Configurar a API do Google
        genai.configure(api_key=api_key)
        
        for attempt in range(max_retries):
            try:
                print(f"  📡 Tentativa {attempt + 1}/{max_retries} com biblioteca oficial...")
                
                # Usar o modelo especificado
                model = genai.GenerativeModel(model_name)
                
                # Gerar resposta com timeout
                response = model.generate_content(
                    user_input,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.7,
                        top_k=40,
                        top_p=0.95,
                        max_output_tokens=1024,
                    )
                )
                
                if response.text:
                    response_text = response.text.strip()
                    print(f"✅ {model_name} (biblioteca): Sucesso!")
                    speak(response_text)
                    return response_text
                else:
                    print(f"  ⚠️ Resposta vazia do {model_name}")
                    
            except Exception as e:
                error_str = str(e)
                print(f"  ❌ Erro na tentativa {attempt + 1}: {error_str}")
                
                # Se for erro 503 (overloaded), aguardar mais tempo
                if "503" in error_str or "overloaded" in error_str.lower():
                    wait_time = (attempt + 1) * 5  # 5, 10, 15 segundos
                    print(f"  ⏳ Modelo sobrecarregado, aguardando {wait_time}s...")
                    time.sleep(wait_time)
                elif "429" in error_str or "quota" in error_str.lower():
                    print(f"  ⏳ Limite de quota, aguardando {(attempt + 1) * 10}s...")
                    time.sleep((attempt + 1) * 10)
                else:
                    # Para outros erros, aguardar menos tempo
                    time.sleep(2)
                    
                if attempt == max_retries - 1:
                    print(f"  ❌ {model_name} (biblioteca) falhou após {max_retries} tentativas")
                    
    except ImportError:
        print("  ⚠️ Biblioteca google-generativeai não disponível")
    except Exception as e:
        print(f"  ❌ Erro na configuração da biblioteca: {e}")
    
    return None

def _try_gemini_rest_api(user_input: str, api_key: str, model_name: str, max_retries: int = 3):
    """Tentar usar API REST do Gemini"""
    for attempt in range(max_retries):
        try:
            print(f"  🌐 Tentativa {attempt + 1}/{max_retries} com API REST...")
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [{
                    "parts": [{
                        "text": user_input
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024
                }
            }
            
            # Timeout progressivo
            timeout = 10 + (attempt * 5)  # 10, 15, 20 segundos
            response = requests.post(url, json=data, headers=headers, timeout=timeout)
            
            if response.status_code == 200:
                response_data = response.json()
                if "candidates" in response_data and len(response_data["candidates"]) > 0:
                    response_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"✅ {model_name} (REST): Sucesso!")
                    speak(response_text)
                    return response_text
                else:
                    print(f"  ⚠️ Resposta vazia do {model_name}")
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                print(f"  ❌ Erro na tentativa {attempt + 1}: {error_msg}")
                
                # Tratamento específico por código de erro
                if response.status_code == 503:  # Service Unavailable
                    wait_time = (attempt + 1) * 8  # 8, 16, 24 segundos
                    print(f"  ⏳ Serviço sobrecarregado (503), aguardando {wait_time}s...")
                    time.sleep(wait_time)
                elif response.status_code == 429:  # Too Many Requests
                    wait_time = (attempt + 1) * 15  # 15, 30, 45 segundos
                    print(f"  ⏳ Muitas requisições (429), aguardando {wait_time}s...")
                    time.sleep(wait_time)
                elif response.status_code == 500:  # Internal Server Error
                    wait_time = (attempt + 1) * 5  # 5, 10, 15 segundos
                    print(f"  ⏳ Erro interno (500), aguardando {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    # Para outros erros, aguardar menos
                    time.sleep(3)
                    
        except requests.exceptions.Timeout:
            print(f"  ⏰ Timeout na tentativa {attempt + 1}")
            time.sleep(5)
        except requests.exceptions.ConnectionError:
            print(f"  🌐 Erro de conexão na tentativa {attempt + 1}")
            time.sleep(5)
        except Exception as e:
            print(f"  ❌ Erro inesperado na tentativa {attempt + 1}: {e}")
            time.sleep(3)
    
    print(f"  ❌ {model_name} (REST) falhou após {max_retries} tentativas")
    return None

def _fallback_response(user_input: str):
    """Resposta de fallback quando Gemini não está disponível"""
    fallback_responses = {
        "oi": "Olá, João Manoel! Como posso ajudar você hoje?",
        "olá": "Oi, Sr. João Manoel! Em que posso ser útil?",
        "como você está": "Estou funcionando perfeitamente, João Manoel. Obrigado por perguntar!",
        "que horas são": f"São {time.strftime('%H:%M')}, Sr. João Manoel.",
        "que dia é hoje": f"Hoje é {time.strftime('%d/%m/%Y')}, João Manoel.",
        "obrigado": "De nada, João Manoel! Sempre à disposição.",
        "tchau": "Até logo, Sr. João Manoel! Foi um prazer ajudar.",
        "ajuda": "Posso ajudar com pesquisas, abrir aplicativos, reproduzir música e muito mais, João Manoel!"
    }
    
    # Procurar resposta simples
    user_lower = user_input.lower()
    for key, response in fallback_responses.items():
        if key in user_lower:
            print(f"💬 Resposta local: {response}")
            speak(response)
            return response
    
    # Resposta padrão
    default_msg = "Desculpe, o serviço de IA está temporariamente indisponível. Tente novamente em alguns minutos ou use comandos específicos como 'abrir navegador' ou 'pesquisar no Google'."
    print(f"⚠️ Fallback: {default_msg}")
    speak(default_msg)
    return default_msg

def chatBot(query: str):
    try:
        # Usar configuração segura
        if SECURE_CONFIG_AVAILABLE:
            api_key = get_google_api_key()
        else:
            # Ler do .env primeiro
            api_key = os.getenv('GOOGLE_API_KEY')
            
            if not api_key or api_key == 'your_google_api_key_here':
                # Fallback para cookies.json
                try:
                    with open("engine/cookies.json", "r") as f:
                        config = json.load(f)
                    api_key = config.get("google_api_key")
                except FileNotFoundError:
                    pass
        
        if not api_key or "YOUR_" in api_key:
            speak("Chave da API não configurada. Configure no arquivo .env")
            return
        
        # URL da API do Gemini
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        # Dados da requisição
        data = {
            "contents": [{
                "parts": [{
                    "text": query
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024
            }
        }
        
        # Fazer requisição
        response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
        
        if response.status_code == 200:
            result = response.json()
            if "candidates" in result and len(result["candidates"]) > 0:
                answer = result["candidates"][0]["content"]["parts"][0]["text"]
                speak(answer)
            else:
                speak("Não consegui gerar uma resposta")
        else:
            speak(f"Erro na API: {response.status_code}")
            
    except FileNotFoundError:
        speak("Arquivo de configuração não encontrado")
    except json.JSONDecodeError:
        speak("Erro ao ler arquivo de configuração")
    except requests.RequestException as e:
        speak(f"Erro de conexão: {e}")
    except Exception as e:
        speak(f"Algo deu errado: {e}")

def makeCall(name: str, mobileNo: str):
    mobileNo = mobileNo.replace(" ", "")
    speak("Ligando para " + name)
    command = 'adb shell am start -a android.intent.action.CALL -d tel:' + mobileNo
    os.system(command)


def openWhatsApp():
    """Função específica para abrir o WhatsApp com fallback garantido - Configurado para João Manoel"""
    try:
        speak("Abrindo WhatsApp para João Manoel")
        print("📱 Abrindo WhatsApp para João Manoel...")
        print("🔍 Iniciando diagnóstico detalhado...")

        system = platform.system()
        print(f"🔍 Sistema detectado: {system}")
        print(f"🔍 Versão do sistema: {platform.version()}")

        app_opened = False

        if system == "Windows":
            print("🔍 Tentando abrir WhatsApp no Windows...")
            
            # Lista de caminhos possíveis do WhatsApp
            whatsapp_paths = [
                "WhatsApp",
                "C:\\Users\\%USERNAME%\\AppData\\Local\\WhatsApp\\WhatsApp.exe",
                "C:\\Program Files\\WhatsApp\\WhatsApp.exe",
                "C:\\Program Files (x86)\\WhatsApp\\WhatsApp.exe"
            ]
            
            for path in whatsapp_paths:
                try:
                    print(f"📂 Tentando caminho: {path}")
                    result = subprocess.run([path], capture_output=True, timeout=3)
                    if result.returncode == 0:
                        print(f"✅ WhatsApp Desktop encontrado em: {path}")
                        app_opened = True
                        break
                    else:
                        print(f"❌ Falhou com código: {result.returncode}")
                except FileNotFoundError:
                    print(f"⚠️ Arquivo não encontrado: {path}")
                except subprocess.TimeoutExpired:
                    print(f"✅ WhatsApp iniciado (timeout esperado): {path}")
                    app_opened = True
                    break
                except Exception as e:
                    print(f"❌ Erro com {path}: {e}")
            
            if not app_opened:
                print("⚠️ Nenhum WhatsApp Desktop encontrado no Windows")

        elif system == "Darwin":  # macOS
            try:
                result = os.system('open -a "WhatsApp" 2>/dev/null')
                if result == 0:
                    print("✅ WhatsApp aberto no macOS")
                    app_opened = True
                else:
                    print("⚠️ WhatsApp não encontrado no macOS")
            except Exception as e:
                print(f"⚠️ Erro ao tentar abrir WhatsApp macOS: {e}")

        else:  # Linux
            print("🔍 Tentando abrir WhatsApp no Linux...")
            whatsapp_commands = [
                "whatsapp-for-linux",
                "whatsdesk", 
                "whatsapp",
                "snap run whatsapp-for-linux",
                "flatpak run com.github.eneshecan.WhatsAppForLinux"
            ]
            
            for cmd in whatsapp_commands:
                try:
                    print(f"📂 Tentando comando: {cmd}")
                    result = subprocess.run(cmd.split(), capture_output=True, timeout=2)
                    print(f"✅ WhatsApp aberto com: {cmd}")
                    app_opened = True
                    break
                except subprocess.TimeoutExpired:
                    print(f"✅ {cmd} iniciado (timeout esperado)")
                    app_opened = True
                    break
                except FileNotFoundError:
                    print(f"⚠️ Comando não encontrado: {cmd}")
                    continue
                except Exception as e:
                    print(f"❌ Erro com {cmd}: {e}")
            
            if not app_opened:
                print("⚠️ Nenhum WhatsApp encontrado no Linux")

        # Fallback garantido → WhatsApp Web
        if not app_opened:
            print("🌐 Nenhum aplicativo encontrado, abrindo WhatsApp Web para João Manoel...")
            print("🔍 Tentando abrir https://web.whatsapp.com...")
            try:
                webbrowser.open("https://web.whatsapp.com")
                print("✅ WhatsApp Web aberto com sucesso")
                speak("WhatsApp Web aberto no navegador para João Manoel")
            except Exception as e:
                print(f"❌ Erro ao abrir WhatsApp Web: {e}")
                speak("Erro ao abrir WhatsApp Web. Verifique se há um navegador instalado.")
        else:
            time.sleep(2)
            speak("WhatsApp aberto com sucesso para João Manoel")

    except Exception as e:
        print(f"❌ Erro crítico ao abrir WhatsApp: {e}")
        webbrowser.open("https://web.whatsapp.com")
        speak("Abrindo WhatsApp Web como alternativa")


def _open_whatsapp_web():
    """Função auxiliar para abrir WhatsApp Web com múltiplas tentativas"""
    try:
        print("🌐 Abrindo WhatsApp Web...")
        
        # Tentar diferentes navegadores
        browsers = [
            'google-chrome',
            'chromium-browser', 
            'firefox',
            'firefox-esr',
            'opera',
            'brave-browser'
        ]
        
        web_opened = False
        
        # Primeiro tentar com webbrowser padrão
        try:
            webbrowser.open("https://web.whatsapp.com")
            print("✅ WhatsApp Web aberto com navegador padrão")
            web_opened = True
        except Exception as e:
            print(f"⚠️ Erro com navegador padrão: {e}")
        
        # Se o padrão falhou, tentar navegadores específicos
        if not web_opened:
            for browser in browsers:
                try:
                    print(f"🔍 Tentando abrir com {browser}...")
                    subprocess.run([browser, "https://web.whatsapp.com"], 
                                 capture_output=True, timeout=3)
                    print(f"✅ WhatsApp Web aberto com {browser}")
                    web_opened = True
                    break
                except (FileNotFoundError, subprocess.TimeoutExpired):
                    # Timeout é normal para navegadores
                    print(f"✅ {browser} iniciado (timeout esperado)")
                    web_opened = True
                    break
                except Exception as e:
                    print(f"⚠️ {browser} não funcionou: {e}")
                    continue
        
        if web_opened:
            speak("WhatsApp Web aberto no navegador")
            speak("WhatsApp aberto com sucesso")
        else:
            print("❌ Não foi possível abrir nenhum navegador")
            speak("Não foi possível abrir o WhatsApp. Verifique se há um navegador instalado.")
            
    except Exception as e:
        print(f"❌ Erro crítico no WhatsApp Web: {e}")
        speak("Erro ao abrir WhatsApp Web. Tente abrir manualmente.")

def testWhatsAppWeb():
    """Função para testar apenas o WhatsApp Web"""
    print("🧪 TESTE: Abrindo apenas WhatsApp Web")
    speak("Testando WhatsApp Web")
    _open_whatsapp_web()

def sendMessage(message: str, mobileNo: str, name: str):
    from engine.helper import replace_spaces_with_percent_s, goback, keyEvent, tapEvents, adbInput  # type: ignore
    message = replace_spaces_with_percent_s(message)
    mobileNo = replace_spaces_with_percent_s(mobileNo)
    speak("Enviando mensagem")
    goback(4)  # type: ignore
    time.sleep(1)
    keyEvent(3)  # type: ignore
    tapEvents(136, 2220)  # type: ignore
    tapEvents(819, 2192)  # type: ignore
    adbInput(mobileNo)  # type: ignore
    tapEvents(601, 574)  # type: ignore
    tapEvents(390, 2270)  # type: ignore
    adbInput(message)  # type: ignore
    tapEvents(957, 1397)  # type: ignore
    speak("Mensagem enviada com sucesso para " + name)