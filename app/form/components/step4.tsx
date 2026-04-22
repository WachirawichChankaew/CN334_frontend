import React from 'react';
import Link from 'next/link';
 
export default function Step4() {
 return (
   <div className="w-full text-center flex flex-col items-center py-4">
     <div className="w-32 h-32 flex items-center justify-center text-center text-8xl mb-4">✅</div>
     <h2 className="text-4xl font-extrabold mb-4 text-slate-800">สำเร็จ</h2>
     <p className="text-2xl mb-4 font-medium">รหัสอ้างอิง: #1999999</p>
     <p className="text-slate-600 mb-10 text-lg">คำขอการนัดพบแพทย์ของท่านได้รับการบันทึก</p>
    
     <div className="flex flex-col gap-3 w-full mt-4">
       <button className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md transition-colors">
         บันทึกภาพหน้าจอ
       </button>
       <Link href="/" className="w-full">
         <button className="w-full bg-slate-200 py-4 text-lg font-bold hover:bg-slate-300 rounded-md transition-colors">
           เสร็จสิ้น
         </button>
       </Link>
     </div>
   </div>
 );
}