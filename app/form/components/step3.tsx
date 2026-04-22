import React, { useState } from 'react';
import { AppointmentFormData } from '../page';

interface Step3Props {
    formData: AppointmentFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
    onPrev: () => void;
    setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
    onSubmitData: () => Promise<boolean>; // ประกาศ Type ให้รอรับฟังก์ชันที่เป็น Async
}

export default function Step3({ formData, onChange, onNext, onPrev, setFormData, onSubmitData }: Step3Props) {
    // สร้าง State เล็กๆ ไว้เก็บสถานะตอนกำลังโหลดข้อมูล
    const [isSubmitting, setIsSubmitting] = useState(false);

    // เปลี่ยนเป็น async function เพื่อรอผลลัพธ์จาก API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.appointmentTime) {
            alert("กรุณาเลือกช่วงเวลาที่ต้องการพบแพทย์");
            return;
        }

        setIsSubmitting(true); // ปรับปุ่มเป็นสถานะกำลังโหลด

        // เรียกใช้ฟังก์ชันยิง API และรอจนกว่าจะเสร็จ
        const isSuccess = await onSubmitData();

        setIsSubmitting(false); // คืนสถานะปุ่ม

        // ถ้าสำเร็จค่อยเปลี่ยนหน้าไป Step 4
        if (isSuccess) {
            onNext();
        }
    };
    const handleTimeSelect = (time: string) => {
        setFormData((prev) => ({ ...prev, appointmentTime: time }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
                <label htmlFor="appointmentDate" className="mb-1 text-sm font-medium">วัน-เดือน-ปี ที่ต้องการเข้าพบแพทย์</label>
                <input type="date" id="appointmentDate" name="appointmentDate"
                    value={formData.appointmentDate} onChange={onChange} required
                    className="border border-slate-300 p-3 text-lg rounded-md"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="mb-1 text-sm font-medium">เลือกช่วงเวลาที่ต้องการพบแพทย์</label>
                {[
                    { time: '09:00 - 09:30', slots: 9 },
                    { time: '09:30 - 10:00', slots: 2 },
                    { time: '10:00 - 10:30', slots: 1 }
                ].map((slot, index) => (
                    <div key={index} className="border border-slate-300 rounded-md overflow-hidden">
                        <div className="p-3 bg-white">
                            <p className="font-bold">เวลา {slot.time}</p>
                            <p className="text-sm text-slate-600">จำนวนคงเหลือ {slot.slots} ช่อง</p>
                        </div>
                        <button type="button" onClick={() => handleTimeSelect(slot.time)}
                            className={`w-full py-2 font-bold ${formData.appointmentTime === slot.time ? 'bg-slate-400 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>
                            {formData.appointmentTime === slot.time ? 'เลือกแล้ว' : 'เลือก'}
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-3 mt-6">
                <button type="submit" disabled={isSubmitting}
                    className={`w-full py-4 text-lg font-bold rounded-md ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300'}`}>
                    {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการนัดหมาย'}
                </button>
                <button type="button" onClick={onPrev} disabled={isSubmitting} className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md">ย้อนกลับ</button>
            </div>
        </form>
    );
}
