"use client";

import React, { useState,  useRef } from "react";
import { Card, Avatar, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';
export default function MessageUI({ conversation, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const userId = useSelector((state) => state.auth.id);
  // Auto-scroll to the bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    onSendMessage(newMessage);
    setNewMessage(""); // Clear input after sending
  };

  const otherParticipant = conversation && conversation.participants && conversation.participants.find(p => {
    
    
    if (p?.id) {
      return p.id !== userId;
    } else if (p?._id) {
      return p._id.toString() !== userId;
    }
    return false;
  });

  return (
    <Card className="w-full h-full col-start-1 col-end-5 ">
      {/* Header */}
      <div className="bg-gray-600 text-white p-4 rounded-t-lg flex items-center">
        {otherParticipant && (
          <Avatar src={otherParticipant.avatar} size="large" className="mr-4">
            {!otherParticipant.avatar && otherParticipant.username.slice(0,2).toUpperCase()}
          </Avatar>
        )}
        <h2 className="text-xl font-bold">
          {otherParticipant ? otherParticipant.username : "Messages"}
        </h2>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto">
        {conversation ? (
          messages.map((message) => {
           
            
            const isCurrentUser = message.senderId === userId;
            return (
              <div key={message.id} className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end`}>
                  {/* Avatar */}
                  {!isCurrentUser && otherParticipant && (
                    <Avatar src={otherParticipant.avatar} size={32} className="mr-2">
                      {!otherParticipant.avatar && otherParticipant.username.slice(0,2).toUpperCase()}
                    </Avatar>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      isCurrentUser ? "bg-gray-600 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a conversation to view messages
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      {conversation && (
        <div className="p-4 border-t">
          <form onSubmit={handleSend} className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button type="primary" htmlType="submit" icon={<SendOutlined />} />
          </form>
        </div>
      )}
    </Card>
  );
}
