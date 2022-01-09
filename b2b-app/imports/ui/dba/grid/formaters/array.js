// import React from 'react'

const ArrayFormater = ({ column, row }) => {
  if (!row[column.key]) {
    return null
  }
  return JSON.stringify(row[column.key], null, 2)
}

export default ArrayFormater
