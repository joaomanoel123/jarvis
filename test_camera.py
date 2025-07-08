import cv2

def test_camera(index: int) -> None:
    print(f"Iniciando teste da câmera no índice {index}...")
    try:
        cap = cv2.VideoCapture(index)
        print(f"Tentativa de abrir a câmera no índice {index} concluída.")
        if not cap.isOpened():
            print(f"Erro: Não foi possível abrir a câmera no índice {index}.")
            return
        print(f"Câmera aberta com sucesso no índice {index}.")
        
        # Tenta formatos diferentes
        formats = [cv2.VideoWriter_fourcc(*'MJPG'), cv2.VideoWriter_fourcc(*'YUYV')]  # type: ignore
        for fourcc in formats:  # type: ignore
            print(f"Tentando formato {fourcc} (valor: {fourcc})...")
            cap.set(cv2.CAP_PROP_FOURCC, fourcc)  # type: ignore
            ret, frame = cap.read()
            if ret:
                print(f"Funcionou com formato {fourcc} no índice {index}! Exibindo frame...")
                cv2.imwrite(f"test_frame_{index}_{fourcc}.jpg", frame)
                cv2.imshow("Teste", frame)
                cv2.waitKey(5000)  # 5 segundos
                cv2.destroyAllWindows()
                cap.release()
                return
            else:
                print(f"Falha com formato {fourcc} no índice {index}.")
        print(f"Câmera preta: Nenhum frame capturado no índice {index}.")
        cap.release()
    except Exception as e:
        print(f"Exceção capturada: {str(e)}")

# Testar índices 0 e 1
print("Script iniciado.")
for i in [0, 1]:
    test_camera(i)