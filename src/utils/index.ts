import { clsx, type ClassValue } from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'

export const dateFormatter = (date: Date) => moment(date).format('YYYY-MM-DD')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAmountValid = (amount: string): boolean => {
  if (amount.match(/^\d*\.?\d*$/g) === null) return false
  return true
}
