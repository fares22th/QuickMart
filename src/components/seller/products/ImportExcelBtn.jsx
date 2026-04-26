import { FileSpreadsheet } from 'lucide-react'
import Button from '@/components/common/Button'

export default function ImportExcelBtn() {
  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) console.log('Import excel:', file.name)
  }

  return (
    <>
      <Button variant="outline" onClick={() => document.getElementById('excel-input')?.click()}>
        <FileSpreadsheet className="w-4 h-4 ml-1" /> استيراد Excel
      </Button>
      <input id="excel-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
    </>
  )
}
