
'use client';

import { useState } from 'react';
import { ChatWidget } from './chat-widget';

export function ChatWidgetWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  return <ChatWidget isOpen={isChatOpen} onToggle={handleToggleChat} />;
}
