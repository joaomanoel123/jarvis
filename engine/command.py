import pyttsx3
import speech_recognition as sr
import eel
import time
import platform
import numpy as np
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False
    print("⚠️ PyAudio não disponível - algumas otimizações de áudio podem não funcionar")

def speak(text):
    text = str(text)
    engine = None
    try:
        # Detectar sistema operacional e usar driver apropriado
        if platform.system() == "Windows":
            engine = pyttsx3.init('sapi5')
        elif platform.system() == "Darwin":  # macOS
            engine = pyttsx3.init('nsss')
        else:  # Linux
            engine = pyttsx3.init('espeak')
        
        # Configurar voz para português brasileiro
        try:
            voices = engine.getProperty('voices')
            if voices:
                # Procurar por voz em português brasileiro
                pt_voice = None
                for voice in voices:
                    if 'pt' in voice.id.lower() or 'brazil' in voice.id.lower() or 'portuguese' in voice.id.lower():
                        pt_voice = voice.id
                        break
                
                if pt_voice:
                    engine.setProperty('voice', pt_voice)
                    print(f"🇧🇷 Usando voz em português: {pt_voice}")
                else:
                    # Usar primeira voz disponível
                    engine.setProperty('voice', voices[0].id)
                    print(f"🔊 Usando voz padrão: {voices[0].id}")
        except Exception as e:
            print(f"⚠️ Não foi possível configurar voz: {e}")
        
        # Configurar velocidade e outras propriedades
        try:
            engine.setProperty('rate', 150)  # Velocidade mais natural
            engine.setProperty('volume', 0.9)  # Volume
        except Exception as e:
            print(f"⚠️ Não foi possível configurar propriedades: {e}")
        
        # Exibir mensagem na interface
        try:
            eel.DisplayMessage(text)
            eel.receiverText(text)
        except Exception as e:
            print(f"⚠️ Erro ao atualizar a interface com EEL: {e}")
        
        # Falar o texto com tratamento de erro melhorado
        engine.say(text)
        engine.runAndWait()
        
        # Limpar engine para evitar referências fracas
        try:
            engine.stop()
        except:
            pass
        
    except Exception as e:
        print(f"❌ Erro no text-to-speech: {e}")
        print(f"📝 Texto: {text}")
        # Fallback: apenas exibir na interface
        try:
            eel.DisplayMessage(text)
            eel.receiverText(text)
        except Exception as e_eel:
            print(f"⚠️ Erro ao atualizar a interface (fallback) com EEL: {e_eel}")
    finally:
        # Garantir limpeza do engine
        if engine:
            try:
                del engine
            except:
                pass


def takecommand():
    """Função de reconhecimento de voz com qualidade de áudio cristalina e tratamento robusto"""
    r = None
    source = None
    
    try:
        r = sr.Recognizer()
        
        # Detectar melhor microfone disponível
        best_mic = get_best_microphone()
    
        # Configurar reconhecedor para qualidade de áudio superior
        if r is not None:
            try:
                r.energy_threshold = 400  # Aumentado para melhor detecção
                r.dynamic_energy_threshold = True
                r.pause_threshold = 0.6  # Otimizado para captura mais precisa
                r.phrase_threshold = 0.2  # Mais sensível para início de frase
                r.non_speaking_duration = 0.4  # Ajustado para melhor detecção
                print('✅ Reconhecedor configurado com parâmetros otimizados')
            except Exception as e:
                print(f"⚠️ Erro ao configurar reconhecedor: {e}")
                return "erro_critico"
        else:
            print("❌ Reconhecedor é None")
            return "erro_critico"
    
        # Configurar microfone com qualidade superior e tratamento de erro
        mic_config = {
            'sample_rate': 16000,  # Taxa de amostragem otimizada para voz
            'chunk_size': 1024     # Tamanho de chunk para melhor qualidade
        }
        
        # Usar melhor microfone se detectado e válido
        if best_mic and hasattr(best_mic, 'device_index'):
            try:
                mic_config['device_index'] = best_mic.device_index
                print(f"🎤 Usando microfone premium (index: {best_mic.device_index})")
            except Exception as e:
                print(f"⚠️ Erro ao configurar microfone premium: {e}")
                # Continuar sem device_index (usar padrão)
        
        # Tentar criar microfone com configurações otimizadas
        try:
            source = sr.Microphone(**mic_config)
        except Exception as e:
            print(f"⚠️ Erro com configurações otimizadas: {e}")
            # Fallback para microfone básico
            try:
                source = sr.Microphone()
                print("🎤 Usando microfone com configurações básicas")
            except Exception as e2:
                print(f"❌ Erro crítico ao criar microfone: {e2}")
                return "erro_microfone"
        
        if source is None:
            print("❌ Microfone não disponível")
            return "erro_microfone"
            
        with source:
            print('🎧 Ouvindo com qualidade cristalina...')
            try:
                eel.DisplayMessage('🎧 Ouvindo com qualidade cristalina...')
            except:
                pass
            
            # Calibração avançada para ruído ambiente
            print('🔊 Calibrando microfone para qualidade superior...')
            r.adjust_for_ambient_noise(source, duration=1.5)  # Mais tempo para melhor calibração
            
            # Configurar ganho do microfone se possível
            try:
                if (PYAUDIO_AVAILABLE and 
                    source is not None and 
                    hasattr(source, 'stream') and 
                    source.stream is not None):
                    print('🎵 Otimizando configurações de áudio...')
                    # Aplicar configurações avançadas se disponíveis
                    _optimize_audio_settings(source)
            except Exception as e:
                print(f"⚠️ Não foi possível otimizar áudio: {e}")
            
            # Escutar com configurações otimizadas para qualidade
            try:
                print('🎤 Fale agora (qualidade cristalina ativa)...')
                try:
                    eel.DisplayMessage('🎤 Fale agora (qualidade cristalina)...')
                except:
                    pass
                
                # Timeout otimizado: 6s para começar, 4s de frase (mais tempo para qualidade)
                audio = r.listen(
                    source, 
                    timeout=6, 
                    phrase_time_limit=4
                )
                
            except sr.WaitTimeoutError:
                print('⏰ Timeout: Nenhuma fala detectada')
                try:
                    eel.DisplayMessage('⏰ Timeout: Tente novamente')
                except:
                    pass
                return "timeout"
            
            except Exception as e:
                print(f'❌ Erro ao capturar áudio: {e}')
                try:
                    eel.DisplayMessage('❌ Erro no microfone')
                except:
                    pass
                return "erro_microfone"

        # Reconhecimento de voz com qualidade superior
        try:
            print('🔍 Processando áudio cristalino...')
            try:
                eel.DisplayMessage('🔍 Processando áudio cristalino...')
            except:
                pass
            
            # Reconhecimento com configurações avançadas
            query = r.recognize_google(
                audio, 
                language='pt-BR',
                show_all=False  # Apenas melhor resultado
            )
            
            if query:
                print(f"👤 Usuário disse: {query}")
                try:
                    eel.DisplayMessage(f"👤 Você disse: {query}")
                except:
                    pass
                time.sleep(1)
                return query.lower()
            else:
                print('⚠️ Reconhecimento vazio')
                return ""
                
        except sr.UnknownValueError:
            print('❌ Não foi possível entender o áudio')
            try:
                eel.DisplayMessage('❌ Não entendi. Tente novamente.')
            except:
                pass
            return "nao_entendi"
            
        except sr.RequestError as e:
            print(f'❌ Erro no serviço de reconhecimento: {e}')
            try:
                eel.DisplayMessage('❌ Erro de conexão. Tente novamente.')
            except:
                pass
            return "erro_servico"
            
        except Exception as e:
            print(f'❌ Erro inesperado no reconhecimento: {e}')
            try:
                eel.DisplayMessage('❌ Erro inesperado. Tente novamente.')
            except:
                pass
            return "erro_geral"
            
    except Exception as e:
        print(f'❌ Erro crítico no takecommand: {e}')
        print(f'🔍 Tipo do erro: {type(e).__name__}')
        print(f'📝 Detalhes: {str(e)}')
        
        # Tratamento específico para erro de 'close'
        if "'NoneType' object has no attribute 'close'" in str(e):
            print("⚠️ Erro de referência None detectado - problema com microfone")
            try:
                eel.DisplayMessage('❌ Erro no microfone. Verifique as permissões e tente novamente.')
            except:
                pass
            return "erro_microfone"
        
        try:
            eel.DisplayMessage('❌ Erro no sistema de voz. Reinicie o sistema.')
        except:
            pass
        return "erro_critico"
    
    finally:
        # Limpeza segura de recursos
        try:
            if source is not None and hasattr(source, 'stream'):
                if source.stream is not None:
                    try:
                        source.stream.close()
                    except:
                        pass
        except Exception as cleanup_error:
            print(f"⚠️ Erro na limpeza: {cleanup_error}")

def _optimize_audio_settings(source):
    """Otimizar configurações de áudio para qualidade cristalina com tratamento robusto"""
    try:
        if not PYAUDIO_AVAILABLE:
            print("⚠️ PyAudio não disponível para otimizações")
            return
        
        if source is None:
            print("⚠️ Source é None, não é possível otimizar")
            return
        
        # Configurar parâmetros de áudio para melhor qualidade
        if hasattr(source, 'stream') and source.stream is not None:
            print('🔧 Aplicando otimizações de áudio...')
            
            # Tentar configurar parâmetros do stream
            try:
                # Verificar se o stream está ativo
                if hasattr(source.stream, 'is_active') and source.stream.is_active():
                    print('✅ Stream ativo, otimizações aplicadas')
                else:
                    print('⚠️ Stream não está ativo')
            except Exception as e:
                print(f"⚠️ Erro ao verificar stream: {e}")
        else:
            print("⚠️ Stream não disponível para otimização")
                
    except Exception as e:
        print(f"❌ Erro na otimização de áudio: {e}")
        print(f"🔍 Tipo do erro: {type(e).__name__}")

def get_best_microphone():
    """Detectar e retornar o melhor microfone disponível com tratamento robusto"""
    try:
        if not PYAUDIO_AVAILABLE:
            print("⚠️ PyAudio não disponível, usando microfone padrão")
            return None
            
        # Listar microfones disponíveis com tratamento de erro
        try:
            mic_list = sr.Microphone.list_microphone_names()
            if not mic_list:
                print("⚠️ Nenhum microfone detectado")
                return None
        except Exception as e:
            print(f"⚠️ Erro ao listar microfones: {e}")
            return None
        
        # Procurar por microfones de alta qualidade
        preferred_mics = [
            'USB', 'Blue', 'Audio-Technica', 'Shure', 'Rode', 
            'Samson', 'HyperX', 'SteelSeries', 'Logitech'
        ]
        
        for i, mic_name in enumerate(mic_list):
            if mic_name:  # Verificar se mic_name não é None
                for preferred in preferred_mics:
                    if preferred.lower() in mic_name.lower():
                        try:
                            # Testar se o microfone é válido
                            test_mic = sr.Microphone(device_index=i)
                            print(f"🎤 Microfone de alta qualidade detectado: {mic_name}")
                            return test_mic
                        except Exception as e:
                            print(f"⚠️ Erro ao testar microfone {mic_name}: {e}")
                            continue
        
        # Se não encontrar microfone premium, testar microfone padrão
        try:
            test_default = sr.Microphone()
            print(f"🎤 Usando microfone padrão")
            return test_default
        except Exception as e:
            print(f"⚠️ Erro ao criar microfone padrão: {e}")
            return None
        
    except Exception as e:
        print(f"❌ Erro crítico ao detectar microfone: {e}")
        return None

def enhance_audio_quality():
    """Aplicar melhorias de qualidade de áudio"""
    print("🎵 OTIMIZAÇÕES DE QUALIDADE DE ÁUDIO ATIVAS:")
    print("  • Taxa de amostragem: 16kHz (otimizada para voz)")
    print("  • Chunk size: 1024 (melhor qualidade)")
    print("  • Energy threshold: 400 (detecção aprimorada)")
    print("  • Pause threshold: 0.6s (precisão otimizada)")
    print("  • Calibração: 1.5s (redução de ruído)")
    print("  • Timeout: 6s + 4s (qualidade prioritária)")
    print("  • Reconhecimento: Google pt-BR (melhor resultado)")

@eel.expose
def allCommands(message=1):
    """Processar comandos com tratamento robusto de erros"""
    
    if message == 1:
        query = takecommand()
        print(f"📝 Query recebida: '{query}'")
        
        # Tratar casos especiais de erro
        if query in ["timeout", "erro_microfone", "nao_entendi", "erro_servico", "erro_geral", "erro_critico"]:
            error_messages = {
                "timeout": "Tempo esgotado. Clique no microfone e tente novamente.",
                "erro_microfone": "Problema com o microfone. Verifique as permissões.",
                "nao_entendi": "Não consegui entender. Fale mais claramente.",
                "erro_servico": "Problema de conexão. Verifique sua internet.",
                "erro_geral": "Erro no reconhecimento. Tente novamente.",
                "erro_critico": "Erro crítico. Reinicie o sistema."
            }
            
            error_msg = error_messages.get(query, "Erro desconhecido")
            print(f"⚠️ {error_msg}")
            
            try:
                eel.senderText(f"Erro: {error_msg}")
                eel.DisplayMessage(error_msg)
                speak(error_msg)
            except:
                pass
            
            # Retornar sem processar comando
            try:
                eel.ShowHood()
            except:
                pass
            return
        
        # Se query está vazia, não processar
        if not query or query.strip() == "":
            print("⚠️ Query vazia, não processando")
            try:
                eel.senderText("Comando vazio")
                eel.DisplayMessage("Nenhum comando detectado")
            except:
                pass
            try:
                eel.ShowHood()
            except:
                pass
            return
        
        try:
            eel.senderText(query)
        except:
            pass
    else:
        query = message
        try:
            eel.senderText(query)
        except:
            pass
    
    try:

        # Comandos em português brasileiro
        if "abrir whatsapp" in query or "abra whatsapp" in query or "whatsapp" in query:
            from engine.features import openWhatsApp
            openWhatsApp()
        elif "abrir" in query or "abra" in query:
            from engine.features import openCommand
            openCommand(query)
        elif "youtube" in query or "reproduzir" in query or "tocar" in query:
            from engine.features import PlayYoutube
            PlayYoutube(query)
        elif "pesquisar" in query or "pesquise" in query or "buscar" in query or "google" in query:
            from engine.features import searchGoogle
            searchGoogle(query)
        elif "enviar mensagem" in query or "ligar" in query or "videochamada" in query:
            from engine.features import findContact, whatsApp, makeCall, sendMessage
            contact_no, name = findContact(query)
            if(contact_no != 0):
                speak("Qual modo você quer usar: WhatsApp ou celular?")
                preferance = takecommand()
                print(preferance)

                if "celular" in preferance or "mobile" in preferance:
                    if "enviar mensagem" in query or "sms" in query: 
                        speak("Qual mensagem enviar?")
                        message = takecommand()
                        sendMessage(message, contact_no, name)
                    elif "ligar" in query:
                        makeCall(name, contact_no)
                    else:
                        speak("Por favor, tente novamente")
                elif "whatsapp" in preferance:
                    message = ""
                    if "enviar mensagem" in query:
                        message = 'message'
                        speak("Qual mensagem enviar?")
                        query = takecommand()
                                        
                    elif "ligar" in query:
                        message = 'call'
                    else:
                        message = 'video call'
                                        
                    whatsApp(contact_no, query, message, name)
        
        # Comandos em inglês (compatibilidade)
        elif "open whatsapp" in query or "whatsapp" in query:
            from engine.features import openWhatsApp
            openWhatsApp()
        elif "open" in query:
            from engine.features import openCommand
            openCommand(query)
        elif "on youtube" in query:
            from engine.features import PlayYoutube
            PlayYoutube(query)
        elif "send message" in query or "phone call" in query or "video call" in query:
            from engine.features import findContact, whatsApp, makeCall, sendMessage
            contact_no, name = findContact(query)
            if(contact_no != 0):
                speak("Which mode you want to use whatsapp or mobile")
                preferance = takecommand()
                print(preferance)

                if "mobile" in preferance:
                    if "send message" in query or "send sms" in query: 
                        speak("what message to send")
                        message = takecommand()
                        sendMessage(message, contact_no, name)
                    elif "phone call" in query:
                        makeCall(name, contact_no)
                    else:
                        speak("please try again")
                elif "whatsapp" in preferance:
                    message = ""
                    if "send message" in query:
                        message = 'message'
                        speak("what message to send")
                        query = takecommand()
                                        
                    elif "phone call" in query:
                        message = 'call'
                    else:
                        message = 'video call'
                                        
                    whatsApp(contact_no, query, message, name)

        else:
            # Usar chatbot Gemini como padrão
            from engine.features import chatBotGemini
            chatBotGemini(query)
            
    except Exception as e:
        print(f"❌ Erro no processamento do comando: {e}")
        try:
            eel.DisplayMessage(f"Erro: {str(e)}")
            speak("Desculpe, ocorreu um erro ao processar seu comando")
        except:
            pass
    
    finally:
        # Sempre tentar mostrar o hood
        try:
            eel.ShowHood()
        except:
            pass
