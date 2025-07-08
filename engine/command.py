import pyttsx3
import speech_recognition as sr
import eel
import time
from typing import Any, Tuple, Union

def speak(text: str) -> None:
    engine: Any = pyttsx3.init('espeak')
    voices: list[Any] = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)
    engine.setProperty('rate', 174)
    eel.DisplayMessage(str(text)) # type: ignore
    engine.say(text)
    eel.receiverText(str(text)) # type: ignore
    engine.runAndWait()


def takecommand() -> str:

    r = sr.Recognizer()

    with sr.Microphone() as source:
        print('listening....')
        eel.DisplayMessage('listening....') # type: ignore
        r.pause_threshold = 1
        r.adjust_for_ambient_noise(source)
        
        audio = r.listen(source, 10, 6)

    try:
        print('recognizing')
        eel.DisplayMessage('recognizing....') # type: ignore
        query = r.recognize_google(audio, language='en-in')
        print(f"user said: {query}")
        eel.DisplayMessage(query) # type: ignore
        time.sleep(2)
       
    except Exception as e: # Catch specific exception for better debugging
        print(f"error: {e}")
        return ""
    
    return query.lower()

@eel.expose
def allCommands(message: Union[int, str] = 1):

    query: str
    if message == 1:
        query = takecommand()
        print(query)
        eel.senderText(query) # type: ignore
    else:
        query = str(message)
        eel.senderText(query) # type: ignore
    
    # Ensure query is a string before performing 'in' operations
    query = str(query)

    try:

        if "open" in query:
            from engine.features import openCommand
            openCommand(query)
        elif "on youtube" in query:
            from engine.features import PlayYoutube
            PlayYoutube(query)
        
        elif "send message" in query or "phone call" in query or "video call" in query:
            from engine.features import findContact, whatsApp, makeCall, sendMessage
            contact_no: Union[str, int]
            name: str
            contact_no, name = findContact(query)
            if(contact_no != 0):
                speak("Which mode you want to use whatsapp or mobile")
                preferance: str = takecommand()
                print(preferance)

                if "mobile" in preferance:
                    if "send message" in query or "send sms" in query:
                        speak("what message to send")
                        message_to_send: str = takecommand()
                        sendMessage(message_to_send, str(contact_no), name)
                    elif "phone call" in query:
                        makeCall(name, str(contact_no))
                    else:
                        speak("please try again")
                elif "whatsapp" in preferance:
                    message_type: str = ""
                    if "send message" in query:
                        message_type = 'message'
                        speak("what message to send")
                        whatsapp_message: str = takecommand()
                                        
                    elif "phone call" in query:
                        message_type = 'call'
                        whatsapp_message = "" # Initialize if not set
                    else:
                        message_type = 'video call'
                        whatsapp_message = "" # Initialize if not set
                                        
                    whatsApp(str(contact_no), whatsapp_message, message_type, name)

        else:
            from engine.features import chatBot
            chatBot(query)
    except Exception as e: # Catch specific exception for better debugging
        print(f"error: {e}")
    
    eel.ShowHood() # type: ignore