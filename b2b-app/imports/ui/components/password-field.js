// import React, { useState } from 'react'
// import { IconButton, Box } from '@material-ui/core'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import TextField from '@material-ui/core/TextField'
// import Visibility from '@material-ui/icons/Visibility'
// import VisibilityOff from '@material-ui/icons/VisibilityOff'
// import { connectField } from 'uniforms'

// const PasswordField = ({ id, placeholder, confirmPassword }) => {
//   const [hide, setHide] = useState(true)
//   const [confirmHide, setConfirmHide] = useState(true)
//   const toggle = () => setHide((prev) => !prev)
//   const confirmToggle = () => setConfirmHide((prev) => !prev)

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault()
//   }

//   return (
//     <Box>
//       <Box marginTop="16px">
//         <TextField
//           id={id}
//           type={hide ? 'password' : 'text'}
//           fullWidth
//           placeholder={placeholder}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={toggle}
//                   onMouseDown={handleMouseDownPassword}
//                 >
//                   {hide ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//       <Box marginTop="16px">
//         {confirmPassword && (
//           <TextField
//             id={`${id}_confirm`}
//             type={confirmHide ? 'password' : 'text'}
//             placeholder={'Confirm your password'}
//             fullWidth
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={confirmToggle}
//                     onMouseDown={handleMouseDownPassword}
//                   >
//                     {confirmHide ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         )}
//       </Box>
//     </Box>
//   )
// }

// export default connectField(PasswordField)
