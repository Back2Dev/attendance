const UserLoginSchemaValidator = (model) => {
  const error = {}

  if (!model.password) {
    error.password = 'Password is required!'
  } else if (model.password.length < 8) {
    error.password = 'Password has to be at least 8 characters long!'
  } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W-])/.test(model.password)) {
    error.password =
      'Password must contain at least \n one uppercase letter, lowercase letter, digit and symbol (!@#$%^&*()+-[{]})'
  }
  if (model.password !== model.confirmPassword) {
    error.password = 'Passwords mismatch!'
  }

  if (Object.keys(error).length) {
    return error
  }
}

export default UserLoginSchemaValidator
