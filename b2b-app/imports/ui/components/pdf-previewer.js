import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import NavigateNext from '@material-ui/icons/NavigateNext'
import { Document, Page, pdfjs } from 'react-pdf'
import '/imports/ui/styles/custom-styles.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const debug = require('debug')('b2b:generate-pdf')

const Previewer = ({ document }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1.0)
  useEffect(() => {}, [document])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    if (pageNumber <= 1) {
      debug('Min page reached')
    } else {
      return changePage(-1)
    }
  }

  function nextPage() {
    if (pageNumber >= numPages) {
      debug('Max page reached')
    } else {
      changePage(1)
    }
  }
  /** Controls for navigating document */
  const PageControls = () => {
    return (
      <>
        <div className="document-center">
          <span style={{ paddingLeft: '23px' }}>
            <NavigateBefore onClick={previousPage} className="hover-button" />
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}{' '}
            <NavigateNext onClick={nextPage} className="hover-button" />
          </span>

          <br></br>
          <span>
            <span id="zoom-title">Zoom:</span>
            <input
              id="zoom"
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={zoom}
              onChange={(e) => {
                setZoom(e.target.value)
              }}
            ></input>
          </span>
        </div>
      </>
    )
  }

  const DocumentRender = () => {
    return (
      <>
        <Document
          file={!document ? '' : { data: document }}
          options={{ workerSrc: '/pdf.worker.js' }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} className="page-center" scale={zoom} />
        </Document>
      </>
    )
  }
  if (document) {
    return (
      <>
        <DocumentRender />
        <PageControls />
      </>
    )
  }
  return <></>
}

Previewer.propTypes = {
  document: PropTypes.object.isRequired,
}

export default Previewer
