import os
import json
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, supports_credentials=True)

ZHIPU_API_BASE = "https://open.bigmodel.cn/api/paas/v4"
ZHIPU_MODEL = "glm-4"


@app.route('/api/save_key', methods=['POST'])
def save_key():
    data = request.get_json()
    api_key = data.get('api_key', '').strip()
    if api_key:
        session['api_key'] = api_key
        session['messages'] = []
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'API Key不能为空'})


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    api_key = session.get('api_key', '')
    if not api_key:
        return jsonify({'error': '请先设置API Key'})

    messages = session.get('messages', [])

    chat_messages = []
    for m in messages:
        chat_messages.append({'role': m['role'], 'content': m['content']})
    chat_messages.append({'role': 'user', 'content': user_message})

    try:
        response = requests.post(
            f"{ZHIPU_API_BASE}/chat/completions",
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': ZHIPU_MODEL,
                'messages': chat_messages
            },
            timeout=60
        )

        if response.status_code != 200:
            error_data = response.json()
            return jsonify({'error': error_data.get('error', {}).get('message', f'API错误: {response.status_code}')})

        result = response.json()
        reply = result['choices'][0]['message']['content']

        messages.append({'role': 'user', 'content': user_message})
        messages.append({'role': 'assistant', 'content': reply})
        session['messages'] = messages

        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(port=5000, debug=True)