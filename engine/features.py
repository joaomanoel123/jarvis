import os
from pipes import quote
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
import pvporcupine  # type: ignore
import requests
import json
from typing import Dict

from engine.helper import extract_yt_term, remove_words  # type: ignore

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
                speak("Opening " + query)
                subprocess.Popen([results[0][0]])

            elif len(results) == 0:
                cursor.execute(
                    'SELECT url FROM web_command WHERE name IN (?)', (app_name,))
                results = cursor.fetchall()

                if len(results) != 0:
                    speak("Opening " + query)
                    webbrowser.open(results[0][0])

                else:
                    speak("Opening " + query)
                    try:
                        os.system('start ' + query)
                    except:
                        speak("not found")
        except Exception as e:
            speak(f"something went wrong: {e}")

def PlayYoutube(query: str):
    search_term = extract_yt_term(query)
    if search_term:
        speak("Playing " + search_term + " on YouTube")
        kit.playonyt(search_term)  # type: ignore
    else:
        speak("Could not determine what to play on YouTube.")

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
        porcupine = pvporcupine.create(access_key=access_key, keywords=["jarvis", "alexa"])  # type: ignore
        print("Porcupine inicializado com sucesso!")

        # Configurar PyAudio com dispositivo ALSA explícito (card 0, device 0)
        paud = pyaudio.PyAudio()
        audio_stream = paud.open(
            rate=porcupine.sample_rate,
            channels=1,
            format=pyaudio.paInt16,
            input=True,
            frames_per_buffer=porcupine.frame_length,
            input_device_index=0  # Usando o dispositivo identificado (card 0)
        )
        print(f"Áudio stream aberto no dispositivo {paud.get_device_info_by_index(0)['name']}")

        while True:
            keyword = audio_stream.read(porcupine.frame_length)  # type: ignore
            keyword = struct.unpack_from("h" * porcupine.frame_length, keyword)  # type: ignore

            keyword_index = porcupine.process(keyword)  # type: ignore

            if keyword_index >= 0:
                print("hotword detected")

                import pyautogui as autogui
                autogui.keyDown("win")
                autogui.press("j")
                time.sleep(2)
                autogui.keyUp("win")

    except Exception as e:
        print(f"Error in hotword detection: {e}")
        if porcupine is not None:
            porcupine.delete()  # type: ignore
        if audio_stream is not None:
            audio_stream.close()
        if paud is not None:
            paud.terminate()

def findContact(query: str):
    words_to_remove = [ASSISTANT_NAME, 'make', 'a', 'to', 'phone', 'call', 'send', 'message', 'whatsapp', 'video']
    query = remove_words(query, words_to_remove)

    try:
        query = query.strip().lower()
        cursor.execute("SELECT mobile_no FROM contacts WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?", ('%' + query + '%', query + '%'))
        results = cursor.fetchall()
        mobile_number_str = str(results[0][0])

        if not mobile_number_str.startswith('+91'):
            mobile_number_str = '+91' + mobile_number_str

        return mobile_number_str, query
    except:
        speak('not exist in contacts')
        return 0, 0

def whatsApp(mobile_no: str, message: str, flag: str, name: str):
    if flag == 'message':
        target_tab = 12
        jarvis_message = "message send successfully to " + name

    elif flag == 'call':
        target_tab = 7
        message = ''
        jarvis_message = "calling to " + name

    else:
        target_tab = 6
        message = ''
        jarvis_message = "staring video call with " + name

    encoded_message = quote(message)
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

# chat bot 
def chatBot(query: str):
    user_input = query.lower()
    try:
        with open("engine/cookies.json", "r") as f:
            cookies = json.load(f)
        api_key = cookies.get("api_key")
        if not api_key:
            raise ValueError("Chave API não encontrada em cookies.json")

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        data: Dict[str, object] = {
            "model": "llama-3.3-70b-versatile",  # Escolha um modelo disponível; ajuste conforme necessário
            "messages": [{"role": "user", "content": user_input}],
            "temperature": 0.7  # Ajuste conforme necessário
        }
        response = requests.post(url, json=data, headers=headers, timeout=10)

        if response.status_code == 200:
            response_data = response.json()
            response_text = response_data["choices"][0]["message"]["content"]
            print(response_text)
            speak(response_text)
            eel.receiverText(response_text)  # type: ignore
            return response_text
        else:
            error_msg = f"Erro na API: {response.status_code} - {response.text}"
            speak(error_msg)
            return error_msg
    except FileNotFoundError:
        error_msg = "Erro: cookies.json não encontrado. Crie o arquivo com uma chave API."
        speak(error_msg)
        return error_msg
    except Exception as e:
        error_msg = f"Erro ao chamar o chatbot: {str(e)}"
        speak(error_msg)
        return error_msg

def makeCall(name: str, mobileNo: str):
    mobileNo = mobileNo.replace(" ", "")
    speak("Calling " + name)
    command = 'adb shell am start -a android.intent.action.CALL -d tel:' + mobileNo
    os.system(command)

def sendMessage(message: str, mobileNo: str, name: str):
    from engine.helper import replace_spaces_with_percent_s, goback, keyEvent, tapEvents, adbInput  # type: ignore
    message = replace_spaces_with_percent_s(message)
    mobileNo = replace_spaces_with_percent_s(mobileNo)
    speak("sending message")
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
    speak("message send successfully to " + name)