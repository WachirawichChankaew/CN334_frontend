import React from 'react';
import Link from 'next/link';
import { AppointmentFormData } from '../page';

interface Step1Props {
    formData: AppointmentFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onNext: () => void;
}

export default function Step1({ formData, onChange, onNext }: Step1Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col">
                <label htmlFor="idCard" className="mb-1 text-sm font-medium">รหัสบัตรประชาชน 13 หลัก</label>
                <input
                    type="text" id="idCard" name="idCard" value={formData.idCard} onChange={onChange}
                    required pattern="\d{13}" title="กรุณากรอกตัวเลข 13 หลัก" placeholder="1-2345-67891-01-1"
                    className="border border-slate-300 p-3 text-lg rounded-md"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="fullName" className="mb-1 text-sm font-medium">คำนำหน้า ชื่อจริง นามสกุล</label>
                <input
                    type="text" id="fullName" name="fullName" value={formData.fullName} onChange={onChange}
                    required placeholder="นายผู้ป่วย ต้องการรักษา"
                    className="border border-slate-300 p-3 text-lg rounded-md"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="phone" className="mb-1 text-sm font-medium">เบอร์โทรสำหรับติดต่อ</label>
                <input
                    type="tel" id="phone" name="phone" value={formData.phone} onChange={onChange}
                    required pattern="[0-9]{10}" title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก" placeholder="099-99999999"
                    className="border border-slate-300 p-3 text-lg rounded-md"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="gender" className="mb-1 text-sm font-medium">เพศกำเนิด</label>
                <select
                    id="gender" name="gender" value={formData.gender} onChange={onChange} required
                    className="border border-slate-300 p-3 text-lg rounded-md bg-white"
                >
                    <option value="" disabled>เลือกเพศ</option>
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="dob" className="mb-1 text-sm font-medium">วัน-เดือน-ปี เกิด</label>
                <input
                    type="date" id="dob" name="dob" value={formData.dob} onChange={onChange} required
                    className="border border-slate-300 p-3 text-lg rounded-md"
                />
            </div>

            <div className="flex flex-col gap-3 mt-6">
                <button type="submit" className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md">ต่อไป</button>
                <Link href="/" className="w-full">
                    <button type="button" className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md">ยกเลิก</button>
                </Link>
            </div>
        </form>
    );
}

