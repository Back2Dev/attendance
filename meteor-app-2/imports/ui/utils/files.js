export const file2BinString = async (file) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = (event) => {
      if (!event.currentTarget.result) reject('Failed to create document')
      resolve(event.currentTarget.result)
    }
  })
}

export const file2ArrayBuffer = async (file) => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (event) => {
      if (!event.currentTarget.result) reject('Failed to create document')
      resolve(event.currentTarget.result)
    }
  })
}

export const convertBase64ToBlob = (base64File) => {
  // Split into two parts
  const parts = base64File.split(';base64,')

  // Hold the content type
  const fileType = parts[0].split(':')[1]

  // Decode Base64 string
  const decodedData = window.atob(parts[1])

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length)

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i)
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: fileType })
}

export const blobToFile = (file) => {
  const data = new Blob([file], { type: 'application/pdf' })
  return data
}
