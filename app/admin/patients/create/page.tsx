'use client';

import Link from 'next/link';

import React from 'react'
import { useRouter } from 'next/navigation'
import ReusableForm, { FormField } from '../../components/ReusableForm'

export default function CreatePatientPage() {
    const router = useRouter()

    const patientFields: FormField[] = [
        { name: 'hn_number', label: 'หมายเลข HN', type: 'text', required: true },
        { name: 'patient_name', label: 'ชื่อ-นามสกุล คนไข้', type: 'text', required: true },
        { name: 'exam_date', label: 'วันที่ตรวจ (YYYY-MM-DD)', type: 'date', required: true },
        { name: 'diagnosis', label: 'ผลการวินิจฉัยเบื้องต้น', type: 'textarea', required: true },
    ]

    const initialPatientData = {
        hn_number: '',
        patient_name: '',
        exam_date: '',
        diagnosis: '',
    }

    const handleCreatePatient = async (formData: any) => {
        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                alert('บันทึกข้อมูลคนไข้สำเร็จ')
                router.push('/admin/patients')
            }
        } catch (error) {
            console.error('Error creating patient:', error)
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <ReusableForm
                title="เพิ่มประวัติคนไข้ใหม่"
                fields={patientFields}
                initialData={initialPatientData}
                onSubmit={handleCreatePatient}
                onCancel={() => router.push('/admin/patients')}
            />
        </div>
        
    )
}

