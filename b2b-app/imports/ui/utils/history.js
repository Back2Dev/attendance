import { useLocation, useNavigate } from 'react-router-dom'

// React Router v6 compatibility shim for legacy useHistory calls.
const useHistory = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    push: (to, state) => navigate(to, { state }),
    replace: (to, state) => navigate(to, { replace: true, state }),
    goBack: () => navigate(-1),
    location,
  }
}

export default useHistory
