import os
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

from engine.helper import extract_yt_term, remove_words  # type: ignore

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
    query = query.lower()

    app_name = query.strip()

    if app_name != "":

        try:
            cursor.execute(
                'SELECT path FROM sys_command WHERE name IN (?)', (app_name,))
            results = cursor.fetchall()

            if len(results) != 0:
                speak("Abrindo " + query)
                subprocess.Popen([results[0][0]])

            elif len(results) == 0:
                cursor.execute(
                    'SELECT url FROM web_command WHERE name IN (?)', (app_name,))
                results = cursor.fetchall()

                if len(results) != 0:
                    speak("Abrindo " + query)
                    webbrowser.open(results[0][0])

                else:
                    speak("Abrindo " + query)
                    try:
                        os.system('start ' + query)
                    except:
                        speak("Não encontrado")
        except Exception as e:
            speak(f"Algo deu errado: {e}")

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
    porcupine = None
    paud = None
    audio_stream = None
    try:
        # Ler a access_key do cookies.json com depuração
        print("Tentando abrir cookies.json...")
        with open("engine/cookies.json", "r") as f:
            cookies = json.load(f)
        access_key = cookies.get("access_key")
        print(f"Access Key lida: {access_key}")  # Depuração
        if not access_key:
            raise ValueError("Chave de acesso (access_key) não encontrada em cookies.json")

        # Inicializar o Porcupine com a access_key
        print("Inicializando Porcupine...")
        porcupine = pvporcupine.create(access_key=access_key, keywords=["jarvis", "alexa"])
        print("Porcupine inicializado com sucesso!")

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
                print("hotword detected")

                
                pyautogui.keyDown("win")
                pyautogui.press("j")
                time.sleep(2)
                pyautogui.keyUp("win")

    except Exception as e:
        print(f"Error in hotword detection: {e}")
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

# chat bot com Google Gemini 2.5-flash
def chatBotGemini(query: str):
    user_input = query.strip()
    try:
        # Tentar usar a biblioteca oficial do Google primeiro
        try:
            import google.generativeai as genai
            
            with open("engine/cookies.json", "r") as f:
                cookies = json.load(f)
            google_api_key = cookies.get("google_api_key")
            if not google_api_key:
                raise ValueError("Chave API do Google não encontrada em cookies.json")
            
            # Configurar a API do Google
            genai.configure(api_key=google_api_key)
            
            # Usar o modelo Gemini 1.5-flash (mais estável)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Gerar resposta
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
                print(f"🤖 Gemini 2.5-flash: {response_text}")
                speak(response_text)
                eel.receiverText(response_text)  # type: ignore
                return response_text
            else:
                raise Exception("Resposta vazia do Gemini")
                
        except ImportError:
            # Fallback para API REST se a biblioteca não estiver disponível
            print("⚠️ Biblioteca google-generativeai não encontrada, usando API REST...")
            
            with open("engine/cookies.json", "r") as f:
                cookies = json.load(f)
            google_api_key = cookies.get("google_api_key")
            if not google_api_key:
                raise ValueError("Chave API do Google não encontrada em cookies.json")

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={google_api_key}"
            headers = {"Content-Type": "application/json"}
            data: Dict[str, object] = {
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
            response = requests.post(url, json=data, headers=headers, timeout=15)

            if response.status_code == 200:
                response_data = response.json()
                if "candidates" in response_data and len(response_data["candidates"]) > 0:
                    response_text = response_data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"🤖 Gemini 2.5-flash (REST): {response_text}")
                    speak(response_text)
                    eel.receiverText(response_text)  # type: ignore
                    return response_text
                else:
                    raise Exception("Resposta vazia do Gemini")
            else:
                raise Exception(f"Erro na API do Gemini: {response.status_code} - {response.text}")
                
    except FileNotFoundError:
        error_msg = "❌ Erro: cookies.json não encontrado. Crie o arquivo com uma chave API do Google."
        speak(error_msg)
        return error_msg
    except Exception as e:
        error_msg = f"❌ Erro ao chamar o Gemini: {str(e)}"
        print(error_msg)
        speak(error_msg)
        # Fallback para o chatbot original em caso de erro
        try:
            print("🔄 Tentando usar chatbot Groq como fallback...")
            return chatBot(query)
        except:
            return error_msg

def chatBot(query: str):
    try:
        # Usar configuração segura
        if SECURE_CONFIG_AVAILABLE:
            api_key = get_google_api_key()
        else:
            # Fallback para cookies.json
            with open("engine/cookies.json", "r") as f:
                config = json.load(f)
            api_key = config.get("google_api_key")
        
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