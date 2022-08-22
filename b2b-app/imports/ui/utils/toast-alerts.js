import { toast } from 'react-toastify'

const defaultOptions = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
}

export const showSuccess = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options })
}

export const showInfo = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options })
}

export const showError = (message, options = { autoClose: false }) => {
  toast.error(message, { ...defaultOptions, ...options })
}

export const showWarning = (message, options = {}) => {
  toast.warn(message, { ...defaultOptions, ...options })
}
