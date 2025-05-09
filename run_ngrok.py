from pyngrok import ngrok

# 1. ngrok 포트 5000으로 열기
public_url = ngrok.connect(5000)
print("🔗 Ngrok URL:", public_url)

# 2. Flask 서버 수동 실행 (터미널 따로 열어서 python app.py 하면 됨)
input("엔터 누르면 종료합니다...")
ngrok.kill()
