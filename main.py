import eel
from engine.features import *
from engine.command import *
from engine.auth import recoganize
def start():
    
    eel.init("www")

    playAssistantSound()
    @eel.expose
    def init(): # type: ignore
        
        eel.hideLoader() # type: ignore
        speak("Ready for Face Authentication")
        flag = recoganize.AuthenticateFace()
        if flag == 1:
            eel.hideFaceAuth() # type: ignore
            speak("Face Authentication Successful")
            eel.hideFaceAuthSuccess() # type: ignore
            speak("Hello, Welcome Sir, How can i Help You")
            eel.hideStart() # type: ignore
            playAssistantSound()
        else:
            speak("Face Authentication Fail")
    

    eel.start('index.html', mode='chrome', host='localhost', port=8001, block=True)

start()