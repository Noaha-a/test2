import dayjs from 'element-plus'

// 日期格式化
export const formatTime = (time) => {
  return dayjs(time).format('YYYY年MM月DD日')
}