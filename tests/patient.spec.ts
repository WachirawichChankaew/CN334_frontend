import { test, expect } from '@playwright/test';

test('ทดสอบระบบค้นหาคนไข้บนตาราง (ด้วย API Mocking)', async ({ page }) => {
    // 1. ดักจับและปลอมแปลงข้อมูล API (Mocking)
    await page.route('${process.env.NEXT_PUBLIC_API_URL}patients', async route => {
        const mockData = [
            { id: 1, hn_number: 'HN999', patient_name: 'Robot Tester', exam_date: '2026-03-31', diagnosis: 'Testing' },
            { id: 2, hn_number: 'HN111', patient_name: 'John Doe', exam_date: '2026-04-01', diagnosis: 'Fever' }
        ];
        await route.fulfill({ json: mockData });
    });

    // 2. ไปที่หน้าจัดการคนไข้
    await page.goto('http://localhost:3000/admin/patients');

    // 3. ตรวจสอบว่าตารางโหลดข้อมูลปลอมของเรามาแสดงผลเรียบร้อยแล้ว
    await expect(page.locator('table')).toContainText('Robot Tester');

    // 4. ทดสอบระบบค้นหา: พิมพ์ค้นหาคำว่า "John"
    const searchInput = page.getByPlaceholder("ค้นหาชื่อ หรือ HN..."); 
    await searchInput.fill('John');

    // 5. ตรวจสอบผลลัพธ์: ตารางต้องแสดง John Doe และต้อง "ไม่" แสดง Robot Tester แล้ว
    await expect(page.locator('table')).toContainText('John Doe');
    await expect(page.locator('table')).not.toContainText('Robot Tester');
});