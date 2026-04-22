'use client';
import React, { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import Link from 'next/link'

import { useRouter } from 'next/navigation';

// 1. กำหนด Interface สำหรับข้อมูลคนไข้ที่รับมาจาก Backend
interface PatientRecord {
  id: number
  hn_number: string
  patient_name: string
  exam_date: string
  diagnosis: string
}

export default function PatientManagementPage() {
  // 2. ระบุ Type ให้กับ State แทนการใช้ any[]
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [filteredPatients, setFilteredPatients] = useState<PatientRecord[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3340/patients')
      if (response.ok) {
        // 3. ระบุ Type ให้กับตัวแปร data ที่ได้จากการแปลง JSON
        const data: PatientRecord[] = await response.json()
        setPatients(data)
        setFilteredPatients(data)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    // 4. TS จะรู้ทันทีว่า patient มี property อะไรบ้าง ทำให้เราเรียกใช้ .patient_name ได้อย่างปลอดภัย
    const filtered = patients.filter((patient) =>
      patient.patient_name.toLowerCase().includes(term) ||
      patient.hn_number.toLowerCase().includes(term)
    )
    setFilteredPatients(filtered)
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)

  const patientColumns = [
    { header: 'HN Number', accessor: 'hn_number' },
    { header: 'Patient Name', accessor: 'patient_name' },
    { header: 'Exam Date', accessor: 'exam_date' },
    { header: 'Diagnosis', accessor: 'diagnosis' }
  ]

  // 5. เปลี่ยน Type ของ item จาก any เป็น PatientRecord
  const router = useRouter(); // ประกาศใช้งาน router ใน Component

  const handleEdit = (item: PatientRecord) => {
    router.push(`/admin/patients/edit/${item.id}`);
  };

  const handleDelete = async (item: PatientRecord) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ: ${item.patient_name}?`)) {
      try {
        const response = await fetch(`http://localhost:3340/patients/${item.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          alert('ลบข้อมูลสำเร็จ')
          fetchPatients()
        }
      } catch (error) {
        console.error('Error deleting patient:', error)
      }
    }
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">จัดการข้อมูลการตรวจคนไข้ (Patient Records)</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือ HN..."
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
        columns={patientColumns}
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