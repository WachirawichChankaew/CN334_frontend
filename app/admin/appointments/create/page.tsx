'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import ReusableForm, { FormField } from '../../components/ReusableForm'

export default function CreateAppointmentPage() {
    const router = useRouter()

    const appointmentFields: FormField[] = [
        { name: 'idCard', label: 'เลขบัตรประชาชน', type: 'text', required: true },
        { name: 'fullName', label: 'ชื่อ-นามสกุล', type: 'text', required: true },
        { name: 'phone', label: 'เบอร์โทรศัพท์', type: 'text', required: true },
        { name: 'gender', label: 'เพศ', type: 'text', required: true },
        { name: 'dob', label: 'วันเกิด (YYYY-MM-DD)', type: 'date', required: true },
        { name: 'address', label: 'ที่อยู่ปัจจุบัน', type: 'textarea', required: true },
        { name: 'maritalStatus', label: 'สถานภาพการสมรส', type: 'text', required: true },
        { name: 'appointmentDate', label: 'วันที่จอง', type: 'date', required: true },
        { name: 'appointmentTime', label: 'เวลาที่จอง', type: 'time', required: true },
    ]

    const initialAppointmentData = {
        idCard: '',
        fullName: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        maritalStatus: '',
        appointmentDate: '',
        appointmentTime: '',
    }

    const handleCreateAppointment = async (formData: any) => {
        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                alert('บันทึกการจองคิวสำเร็จ')
                router.push('/admin/appointments')
            }
        } catch (error) {
            console.error('Error creating appointment:', error)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <ReusableForm
                title="เพิ่มการจองคิวใหม่"
                fields={appointmentFields}
                initialData={initialAppointmentData}
                onSubmit={handleCreateAppointment}
                onCancel={() => router.push('/admin/appointments')}
            />
        </div>
    )
}