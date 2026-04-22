import React from 'react';
import { AppointmentFormData } from '../page';

interface Step2Props {
    formData: AppointmentFormData;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function Step2({ formData, onChange, onNext, onPrev }: Step2Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
                <label htmlFor="address" className="mb-1 text-sm font-medium">ที่อยู่ปัจจุบัน</label>
                <textarea
                    id="address" name="address" value={formData.address} onChange={onChange} required
                    rows={4} placeholder="99 หมู่ 18 ถ.พหลโยธิน คลองหลวง รังสิต ปทุมธานี 12121"
                    className="border border-slate-300 p-3 text-lg rounded-md resize-none"
                ></textarea>
            </div>
            <div className="flex flex-col">
                <label htmlFor="maritalStatus" className="mb-1 text-sm font-medium">สถานะการสมรส</label>
                <select
                    id="maritalStatus" name="maritalStatus" value={formData.maritalStatus} onChange={onChange} required
                    className="border border-slate-300 p-3 text-lg rounded-md bg-white">
                    <option value="" disabled>เลือกสถานะ</option>
                    <option value="single">โสด</option>
                    <option value="married">มีการจดทะเบียนสมรส</option>
                    <option value="divorced">หย่าร้าง</option>
                </select>
            </div>
            <div className="flex flex-col gap-3 mt-6">
                <button type="submit" className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md">ต่อไป</button>
                <button type="button" onClick={onPrev} className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md">ย้อนกลับ</button>
            </div>
        </form>

    );

}

 

 


