import { useState } from 'react'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return alert('请输入API Key')
    try {
      const res = await fetch('/api/save_key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey })
      })
      const data = await res.json()
      if (!data.success) alert(data.error)
    } catch (e) {
      alert('保存失败: ' + e.message)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !apiKey || loading) return
    setLoading(true)
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setMessages(prev => [...prev, { role: 'thinking', content: '思考中...' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      setMessages(prev => prev.slice(0, -1))
      if (data.error) {
        setMessages(prev => [...prev, { role: 'error', content: data.error }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch (e) {
      setMessages(prev => prev.slice(0, -1))
      setMessages(prev => [...prev, { role: 'error', content: '请求失败: ' + e.message }])
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>智谱AI 对话</h1>
      </header>

      <div className="api-key-section">
        <label>API Key:</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="输入你的智谱API Key"
        />
        <button onClick={handleSaveKey}>保存</button>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-state">开始对话吧！</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>{m.content}</div>
          ))}
        </div>
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={apiKey ? "输入消息..." : "请先保存API Key"}
            disabled={!apiKey || loading}
          />
          <button onClick={handleSend} disabled={!apiKey || loading}>
            {loading ? '发送中' : '发送'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App