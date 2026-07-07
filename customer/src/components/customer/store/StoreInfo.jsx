export default function StoreInfo({ store }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold mb-2">عن المتجر</h3>
      <p className="text-gray-600 text-sm">{store?.description || 'لا يوجد وصف'}</p>
      {store?.workingHours && (
        <p className="text-sm text-gray-500 mt-2">ساعات العمل: {store.workingHours}</p>
      )}
    </div>
  )
}
