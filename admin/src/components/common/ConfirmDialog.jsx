import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, onClose, onCancel, onConfirm, title, message, confirmLabel = 'تأكيد', loading, danger }) {
  const handleCancel = onCancel ?? onClose
  return (
    <Modal open={open} onClose={handleCancel} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={handleCancel}>إلغاء</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}
