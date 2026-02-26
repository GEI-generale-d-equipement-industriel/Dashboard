"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, Avatar, Input, Button, Empty, Typography } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from 'react-redux';

const { Text } = Typography;

export default function MessageUI({ conversation, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const userId = useSelector((state) => state.auth.id);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <Card 
      className="w-full h-full" 
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}
      bordered={false}
    >
      {/* Header */}
      <div className="bg-gray-400 text-white p-4 flex items-center  flex-shrink-0 rounded-t-lg">
        {otherParticipant && (
          <Avatar 
            src={otherParticipant.avatar} 
            size="large" 
            className="mr-3"
            icon={!otherParticipant.avatar && <UserOutlined />}
          >
            {!otherParticipant.avatar && otherParticipant.username.slice(0,2).toUpperCase()}
          </Avatar>
        )}
        <div>
          <h2 className="text-xl font-bold">
            {otherParticipant ? otherParticipant.username : "Messages"}
          </h2>
          {otherParticipant && (
            <Text className="text-blue-100 text-sm">
              {otherParticipant.online ? "Online" : "Offline"}
            </Text>
          )}
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-grow overflow-y-auto bg-gray-50 p-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {conversation ? (
          messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === userId;
                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end max-w-[80%]`}>
                      {/* Avatar */}
                      {!isCurrentUser && otherParticipant && (
                        <Avatar 
                          src={otherParticipant.avatar} 
                          size={32} 
                          className="mr-2 flex-shrink-0"
                          icon={!otherParticipant.avatar && <UserOutlined />}
                        >
                          {!otherParticipant.avatar && otherParticipant.username.slice(0,2).toUpperCase()}
                        </Avatar>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-lg ${
                          isCurrentUser 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <span className={`text-xs mt-1 block ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Empty 
                description="No messages yet. Start the conversation!" 
                className="mt-8"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Empty 
              description="Select a conversation to view messages" 
              className="mt-8"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      {conversation && (
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSend} className="flex items-center">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2 rounded-full"
              size="large"
            />
            <Button
              type="primary"
              shape="circle"
              htmlType="submit"
              icon={<SendOutlined />}
              disabled={!newMessage.trim()}
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            />
          </form>
        </div>
      )}
    </Card>
  );
}