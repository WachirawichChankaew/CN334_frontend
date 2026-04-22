import Link from 'next/link';

export default function HomeSemanticWithTailwind() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <nav aria-label="เมนูหลัก" className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TU-PINE Care</h1>
          <p className="text-slate-500 text-lg">ยินดีต้อนรับสู่แอปพลิเคชั่นอำนวยความสะดวกสำหรับสุขภาพของคุณ</p>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow">
        <section aria-labelledby="hero-heading" className="text-center mb-16">
          <h2 id="hero-heading" className="text-4xl font-extrabold mb-4 text-slate-800">
            ดูแลสุขภาพของคุณได้ง่ายๆ จากที่บ้าน
          </h2>
          <p className="text-xl text-slate-600">
            เลือกบริการที่ต้องการด้านล่างเพื่อเริ่มต้นการดูแลตัวเองวันนี้
          </p>
        </section>

        <nav aria-label="บริการของเรา">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <li>
              <article className="h-full">
                <Link href="/form" className="group block h-full">
                  <div className="bg-white p-12 rounded-3xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <span className="text-blue-600 text-4xl" aria-hidden="true">📅</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-slate-800">จองคิวนัดแพทย์</h3>
                    <p className="text-xl text-slate-500">เลือกวันและเวลาที่คุณสะดวกเพื่อพบคุณหมอ</p>
                  </div>
                </Link>
              </article>
            </li>

            <li>
              <article className="h-full">
                <Link href="/chat" className="group block h-full">
                  <div className="bg-white p-12 rounded-3xl shadow-md border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <span className="text-green-600 text-4xl" aria-hidden="true">💬</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-slate-800">ปรึกษาคุณหมอ</h3>
                    <p className="text-xl text-slate-500">พูดคุยสอบถามอาการเบื้องต้นผ่านระบบแชท</p>
                  </div>
                </Link>
              </article>
            </li>
          </ul>
        </nav>
      </main>

      <footer className="py-8 text-center text-slate-400 bg-white border-t border-slate-200 mt-auto">
        <p>จัดทำโดย [6710742674 Wachirawich Chankeaw] คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์ รังสิต 99 ม. 18 ต. คลองหนึ่ง อ. คลองหลวง จ. ปทุมธานี 12120 </p>
      </footer>
    </div>
  )
}


