"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. นำเข้า useRouter

export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const router = useRouter(); // 2. เรียกใช้งาน useRouter

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. เปลี่ยนการรวมข้อมูลเป็น Object ธรรมดา
        const payload = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}login', {
                method: 'POST',
                headers: {
                    // 2. เปลี่ยน Content-Type เป็น JSON
                    'Content-Type': 'application/json',
                },
                // 3. แปลง Object เป็น JSON String
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                setMessage('เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าแรก...');

                // 3. ใช้คำสั่ง push เพื่อเปลี่ยนหน้าไปยัง Path ที่ต้องการ (ในที่นี้คือ '/' หน้าแรก)
                // สามารถใช้ setTimeout เพื่อหน่วงเวลาให้ผู้ใช้เห็นข้อความสำเร็จก่อนสัก 1 วินาทีได้ครับ
                setTimeout(() => {
                    router.push('/');
                }, 1000);

            } else {
                setMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            setMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>

                <div className="mb-4">
                    <label htmlFor="usernameInput" className="block mb-2 text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <input
                        id="usernameInput"
                        type="text"
                        placeholder="Enter username (ex: admin)"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="passwordInput" className="block mb-2 text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        id="passwordInput"
                        type="password"
                        placeholder="Enter password (ex: password123)"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    เข้าสู่ระบบ
                </button>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}