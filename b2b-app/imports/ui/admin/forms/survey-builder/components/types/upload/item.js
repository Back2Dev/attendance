import React, { useCallback, useMemo } from 'react'
import {useDropzone} from 'react-dropzone'

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export const DropZone = ({ pid, all,fileRestriction }) => {
    // let accept = []
    // if(all?.accept){
    //   const newAccept = Object.entries(all.accept).filter(([key,value])=> value).map(([key, value]) => key)
    //   accept = newAccept
    // }

    const onDrop = useCallback((acceptedFiles,  rejectedFiles)=> {
      console.log('accept', acceptedFiles)
      console.log('reject', rejectedFiles)
        // Do something with the files
      }, [])
    // console.log(accept)
    const {getRootProps, getInputProps, isDragActive ,isFocused,
        isDragAccept,
        isDragReject} = useDropzone({onDrop, accept: [...fileRestriction], maxSize: all.maxSize * 1024 *1024 , multiple: all.fileType }) //MB
    
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isFocused,
        isDragAccept,
        isDragReject
      ]);

  

  return (
   

    <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
    </div>

   
  )
}
