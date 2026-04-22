'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
// ระวังเรื่อง Path ของ Component ด้วยนะครับ ปรับให้ตรงกับโปรเจกต์ของคุณ
import ReusableForm, { FormField } from '../../../components/ReusableForm'

export default function EditPatientPage() {
    const router = useRouter()
    const params = useParams()
    const patientId = params.id

    const [initialData, setInitialData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 1. เตรียมโครงสร้างฟอร์ม (เหมือนกับหน้า Create)
    const patientFields: FormField[] = [
        { name: 'hn_number', label: 'หมายเลข HN', type: 'text', required: true },
        { name: 'patient_name', label: 'ชื่อ-นามสกุล คนไข้', type: 'text', required: true },
        { name: 'exam_date', label: 'วันที่ตรวจ (YYYY-MM-DD)', type: 'date', required: true },
        { name: 'diagnosis', label: 'ผลการวินิจฉัยเบื้องต้น', type: 'textarea', required: true },
    ]

    useEffect(() => {
        fetchPatientData()
    }, [patientId])

    // 2. ดึงข้อมูลคนไข้เดิมมาแสดง
    const fetchPatientData = async () => {
        try {
            const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}patients')
            if (response.ok) {
                const data = await response.json()
                // ใช้คำสั่ง find() เพื่อหาคนไข้ที่มี ID ตรงกับ URL
                const foundPatient = data.find((p: any) => p.id === Number(patientId))
                
                if (foundPatient) {
                    setInitialData(foundPatient) // เจอแล้ว! เอาข้อมูลไปใส่ใน initialData
                } else {
                    alert("ไม่พบข้อมูลคนไข้รหัสนี้")
                    router.push('/admin/patients')
                }
            }
        } catch (error) {
            console.error('Error fetching patient:', error)
        } finally {
            setIsLoading(false) // โหลดข้อมูลเสร็จแล้ว
        }
    }

    // 3. ฟังก์ชันบันทึกการแก้ไข (ยิง API แบบ PUT)
    const handleUpdatePatient = async (formData: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}patients/${patientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                alert("อัปเดตข้อมูลคนไข้สำเร็จ")
                router.push('/admin/patients')
            }
        } catch (error) {
            console.error("Error updating patient:", error)
        }
    }

    // 4. บล็อกหน้าจอไว้ก่อนถ้ายานแม่ยังโหลดข้อมูลไม่เสร็จ (ป้องกันฟอร์มว่าง)
    if (isLoading) {
        return <div className="text-center mt-20 text-xl font-bold">กำลังโหลดข้อมูล...</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <ReusableForm
                title={`แก้ไขข้อมูลคนไข้รหัส ${patientId}`}
                fields={patientFields}
                initialData={initialData}
                onSubmit={handleUpdatePatient}
                onCancel={() => router.push('/admin/patients')}
            />
        </div>
    )
}