'use client';

import React, { useState } from 'react';
import Step1 from './components/step1';
import Step2 from './components/step2';
import Step3 from './components/step3';
import Step4 from './components/step4';

export interface AppointmentFormData {
    idCard: string;
    fullName: string;
    phone: string;
    gender: string;
    dob: string;
    address: string;
    maritalStatus: string;
    appointmentDate: string;
    appointmentTime: string;
}

export default function FormPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<AppointmentFormData>({
        idCard: '',
        fullName: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        maritalStatus: '',
        appointmentDate: '',
        appointmentTime: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // ฟังก์ชันใหม่สำหรับยิง API ไปที่ httpbin.org
    const submitFormData = async () => {
        try {
            const response = await fetch('http://localhost:3340/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('เกิดข้อผิดพลาดในการส่งข้อมูล');
            }

            // ถ้าอยากดูผลลัพธ์ว่าเซิร์ฟเวอร์ตอบอะไรกลับมา ให้เปิด Console ดูได้เลย
            const result = await response.json();
            console.log('ข้อมูลที่ส่งสำเร็จ', result);

            return true; // ส่งค่า true กลับไปบอกว่าสำเร็จ
        } catch (error) {
            console.error('Error submitting form', error);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
            return false; // ส่งค่า false กลับไปบอกว่าล้มเหลว
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center py-10">
            <header className="w-full max-w-md bg-white border border-slate-200 p-4 flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">TU-PINE Care</h1>
                <div className="p-2 text-4xl">☰</div>
            </header>

            <main className="w-full max-w-md bg-white p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                {step < 4 && (
                    <div className="w-32 h-32 flex items-center justify-center text-center text-8xl mb-4">📅</div>
                )}

                {step === 1 && <Step1 formData={formData} onChange={handleInputChange} onNext={nextStep} />}
                {step === 2 && <Step2 formData={formData} onChange={handleInputChange} onNext={nextStep} onPrev={prevStep} />}
                {/* เพิ่ม Props ใหม่ onSubmitData โยนลงไปให้ Step 3 ใช้งาน */}
                {step === 3 && <Step3 formData={formData} onChange={handleInputChange} onNext={nextStep} onPrev={prevStep} setFormData={setFormData} onSubmitData={submitFormData} />}
                {step === 4 && <Step4 />}
            </main>
        </div>
    );
}
