import React from 'react'
import LiveChat from 'react-livechat'

const Chat = ({ settings }) => (
  <span>{settings.LIVECHAT && <LiveChat license={settings.LIVECHAT} />}</span>
)

export default Chat
