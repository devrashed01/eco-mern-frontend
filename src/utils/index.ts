import { clsx, type ClassValue } from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'

export const dateFormatter = (date: Date) => moment(date).format('YYYY-MM-DD')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
