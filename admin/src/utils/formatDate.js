import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ar'

dayjs.extend(relativeTime)
dayjs.locale('ar')

export function formatDate(date, format = 'DD MMM YYYY') {
  return dayjs(date).format(format)
}

export function fromNow(date) {
  return dayjs(date).fromNow()
}
