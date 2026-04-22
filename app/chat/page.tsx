"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// กำหนด Type ให้กับ TypeScript เพื่อความชัดเจนและป้องกัน Error
interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Chatbot() {
  // สถานะเริ่มต้นของแชท (มีข้อความทักทายจากหมอ)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'สวัสดีค่ะ! TU-PINE Care ยินดีให้บริการค่ะ 😅 มีอะไรให้ TU-PINE Care ดูแล หรือให้คำปรึกษาด้านสุขภาพได้บ้างคะในวันนี้? ไม่ว่าจะเป็นเรื่องสุขภาพทั่วไป การดูแลตัวเอง หรือข้อสงสัยเกี่ยวกับยา ก็สอบถามได้เลยนะคะ'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ระบุ <HTMLDivElement> ให้ TypeScript รู้จัก
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันเลื่อนหน้าจอลงล่างสุดอัตโนมัติ
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    // 1. นำข้อความผู้ใช้แสดงบนหน้าจอ
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("ไม่พบ API Key กรุณาตรวจสอบไฟล์ .env.local");
      }

      // 2. จัดรูปแบบประวัติแชท โดยใช้ .slice(1) ตัดคำทักทายแรกสุดออก
      const formattedHistory = messages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      // 3. รวมประวัติเดิมเข้ากับข้อความใหม่ที่ผู้ใช้เพิ่งพิมพ์
      const currentContents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMsg }] }
      ];

      // 4. ยิง Request ไปที่ Gemini API ผ่าน Fetch
      // 1. ย้าย apiKey มาต่อท้าย URL ด้วย ?key=
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. ลบ 'x-goog-api-key' ออกจากตรงนี้ได้เลยครับ
        },
        body: JSON.stringify({
          // 3. (แถม) แก้ system_instruction เป็น systemInstruction (ตัวพิมพ์ใหญ่ I) ให้ตรงกับมาตรฐานของ REST API
          systemInstruction: {
            parts: [{ text: "You are a Thai HealthCare Assistant AI from TU-PINE Care app. Please answer politely and professionally." }]
          },
          contents: currentContents
        })
      });

      // ดักจับ Error กรณี API มีปัญหา
      if (!response.ok) {
        // เปลี่ยนมาอ่านค่าแบบ Text ดิบๆ จะได้เห็นทุกตัวอักษรที่ Google ส่งมา
        const errorText = await response.text();
        console.error("🚨 HTTP Status Code:", response.status);
        console.error("🚨 API Error Details (Raw):", errorText);

        // เช็คด้วยว่า API Key โหลดเข้ามารึเปล่า (ถ้าขึ้นว่า undefined คือไฟล์ .env มีปัญหา)
        console.log("🔑 API Key Status:", apiKey ? "Loaded" : "Missing or Undefined");

        throw new Error(`API Request failed with status ${response.status}`);
      }

      const data = await response.json();

      // 5. ดึงข้อความตอบกลับจาก API
      const replyText = data.candidates[0].content.parts[0].text;

      // 6. อัปเดต UI ให้แสดงข้อความของ AI
      setMessages(prev => [...prev, { role: 'model', text: replyText }]);

    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'ขออภัยค่ะ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ กรุณาลองใหม่อีกครั้งนะคะ' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ระบุ Type ให้ Event ของคีย์บอร์ด
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-screen p-4 flex flex-col font-sans">

      {/* ส่วนหัว (Header) */}
      <div className="flex justify-between items-center pb-2 border-b-2 border-gray-200 mb-2">
        <h1 className="text-xl font-bold text-green-700">ปรึกษาคุณหมอ (AI)</h1>
        <Link href="/" >
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-sm font-medium transition-colors">
            กลับหน้าแรก
          </button>
        </Link>
      </div>

      {/* พื้นที่แสดงแชท (Chat Container) */}
      <div className="flex-1 bg-[#d2d6d9] rounded-t-lg overflow-y-auto p-4 flex flex-col gap-4 border border-gray-300 border-b-0">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              // ใช้ whitespace-pre-wrap แทน Inline Style
              className={`whitespace-pre-wrap max-w-[75%] p-3 rounded-lg text-sm ${msg.role === 'user'
                ? 'bg-[#7E57C2] text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* สถานะกำลังพิมพ์ (Typing Indicator) */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 p-2 rounded-lg rounded-bl-none shadow-sm text-sm flex items-center gap-2">
              กำลังพิมพ์...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* พื้นที่พิมพ์ข้อความ (Input Area) */}
      <div className="bg-[#f0f2f5] p-3 rounded-b-lg border border-gray-300 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="พิมพ์ข้อความสอบถามอาการเบื้องต้น..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#7E57C2] focus:ring-1 focus:ring-[#7E57C2]"
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded disabled:opacity-50 transition-colors"
        >
          ส่ง
        </button>
      </div>

    </div>
  );
}