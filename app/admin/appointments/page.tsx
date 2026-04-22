'use client'

import React, { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import Link from 'next/link'

interface AppointmentRecord {
    id: number
    idCard: string
    fullName: string
    phone: string
    appointmentDate: string
    appointmentTime: string
}

export default function AppointmentManagementPage() {

    const [appointments, setAppointments] = useState<AppointmentRecord[]>([])
    const [filteredAppointments, setFilteredAppointments] = useState<AppointmentRecord[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    useEffect(() => {

        fetchAppointments()

    }, [])

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:3340/appointments')
            if (response.ok) {
                const result = await response.json()
                const data: AppointmentRecord[] = result.data || result
                setAppointments(data)
                setFilteredAppointments(data)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase()
        setSearchTerm(term)
        const filtered = appointments.filter((appt) =>
            appt.fullName.toLowerCase().includes(term) ||
            appt.phone.includes(term)
        )
        setFilteredAppointments(filtered)
        setCurrentPage(1)
    }

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
    const appointmentColumns = [
        { header: 'ชื่อ-นามสกุล', accessor: 'fullName' },
        { header: 'เบอร์ติดต่อ', accessor: 'phone' },
        { header: 'วันที่จอง', accessor: 'appointmentDate' },
        { header: 'เวลา', accessor: 'appointmentTime' }
    ]

    const handleEdit = (item: AppointmentRecord) => {
        alert(`เตรียมเปิดหน้าต่างแก้ไขคิวของ: ${item.fullName}`)
    }
    const handleDelete = async (item: AppointmentRecord) => {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะยกเลิกคิวของ: ${item.fullName}?`)) {
            try {
                const response = await fetch(`http://localhost:3340/appointments/${item.id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    alert('ยกเลิกคิวสำเร็จ')
                    fetchAppointments()
                }
            } catch (error) {
                console.error('Error deleting appointment:', error)
            }
        }
    }
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">จัดการการจองคิว (Appointments)</h1>
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ หรือ เบอร์โทร..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="px-4 py-2 border rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Link href="/admin/patients/create">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + เพิ่มข้อมูลใหม่
                    </button>
                </Link>
            </div>
            <DataTable
                columns={appointmentColumns}
                data={currentItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ก่อนหน้า
                    </button>
                    <span className="text-sm text-gray-600">
                        หน้า {currentPage} จาก {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ถัดไป
                    </button>
                </div>
            )}
        </div>
    )
}

