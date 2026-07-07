import { useParams } from 'react-router-dom'

export default function CustomerDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">تفاصيل العميل #{id}</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-gray-400">بيانات العميل ستظهر هنا</p>
      </div>
    </div>
  )
}
