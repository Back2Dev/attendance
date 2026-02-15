import * as changeCase from 'change-case'
import CONSTANTS from '/imports/api/constants'
import { accessByPath } from '/imports/api/util'
import icons from '/imports/api/utils/pdfmake/icons'
import { slugify } from '/imports/api/util'
const debug = require('debug')('app:pdf-util')

const bossPalette = CONSTANTS.PALETTES.boss
const peerPalette = CONSTANTS.PALETTES.peer
const koiPalette = CONSTANTS.PALETTES.koi
const selfPalette = CONSTANTS.PALETTES.self
const colors = {
  self: selfPalette[0],

  peer: peerPalette[0],
  peer1: peerPalette[0],
  peer2: peerPalette[1],
  peer3: peerPalette[2],
  peer4: peerPalette[3],
  peer5: peerPalette[4],
  peer6: peerPalette[5],
  peer7: peerPalette[6],
  peer8: peerPalette[7],
  peer9: peerPalette[8],
  peer10: peerPalette[9],
  peer11: peerPalette[10],
  peer12: peerPalette[11],
  peer13: peerPalette[12],
  peer14: peerPalette[13],
  peer15: peerPalette[14],
  peer16: peerPalette[15],
  peer17: peerPalette[16],
  peer18: peerPalette[17],
  peer19: peerPalette[18],
  peer20: peerPalette[19],

  boss1: bossPalette[0],
  boss2: bossPalette[1],
  boss3: bossPalette[2],
  boss4: bossPalette[3],
  boss5: bossPalette[4],
  boss6: bossPalette[5],
  boss7: bossPalette[6],
  boss8: bossPalette[7],
  boss9: bossPalette[8],
  boss10: bossPalette[9],

  koi: koiPalette[0],
  koi1: koiPalette[0],
  koi2: koiPalette[1],
  koi3: koiPalette[2],
  koi4: koiPalette[3],
  koi5: koiPalette[4],
  koi6: koiPalette[5],
  koi7: koiPalette[6],
  koi8: koiPalette[7],
  koi9: koiPalette[8],
  koi10: koiPalette[9],
  koi11: koiPalette[10],
  koi12: koiPalette[11],
  koi13: koiPalette[12],
  koi14: koiPalette[13],
  koi15: koiPalette[14],
  koi16: koiPalette[15],
  koi17: koiPalette[16],
  koi18: koiPalette[17],
  koi19: koiPalette[18],
  koi20: koiPalette[19],
}
const names = {
  self: 'Self',
  peer: 'Team',
  boss1: 'B1',
  boss2: 'B2',
  boss3: 'B3',
  boss4: 'B4',
  boss5: 'B5',
  boss6: 'B6',
  boss7: 'B7',
  boss8: 'B8',
  boss9: 'B9',
  boss10: 'B10',
  boss: 'Boss',
}

const styleKeys = 'alignment fillColor border margin bold color'.split(/\s+/)

export const topBorder = {
  hLineColor: function (rowIndex, node, columnIndex) {
    if (rowIndex === node.table.body.length) {
      return '#FFFFFF'
    } else if (rowIndex % 2 === 0) {
      return '#000000'
    } else {
      return '#FFFFFF'
    }
  },
  hLineWidth: function (i) {
    return 1.5
  },
  vLineWidth: function (i) {
    return 0
  },
}

// Formatting functions
const formatters = {
  $: (value) => {
    debug({ value })
    if (!value) return 'P.O.A.'
    return (
      '$' +
        Number(value)
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') || ''
    )
  },
  '$.00': (value) => {
    return value ? '$' + Number(value).toFixed(2) : 'P.O.A.'
  },
}

const verbatimV1 = (number, prompt, response, images) => {
  const revert = 0
  const fillColor = revert ? 'white' : null
  const col1Width = revert ? 15 : 60
  const name = revert ? ' ' : null
  if (typeof response === 'string') {
    const stuff = [
      {
        layout: topBorder,
        table: {
          widths: [15, '*'],
          body: [
            [
              { text: number, bold: true },
              {
                text: prompt,
                bold: true,
              },
            ],
            ['', ''],
          ],
        },
      },
    ]
    if (images) stuff.push(renderImages(images, { width: 500 }))
    stuff.push({
      layout: 'noBorders',
      table: {
        widths: [15, '*'],
        lineHeight: 1.5,
        body: [['', response + '\n ']],
      },
    })
    return stuff
  } else {
    let body
    if (response.length === 0) body = ['', '']
    else
      body = [].concat(
        response.map((r) => [
          {
            fillColor: fillColor || colors[r.role] || '#cb1b33',
            fillOpacity: 0.7,
            border: [false, false, true, true],
            padding: 4,
            fontSize: 10,
            color: 'white',
            text: '\n' + (name || r.name || names[r.role] || r.role || ''),
            alignment: 'center',
            bold: true,
          },
          {
            text: revert
              ? [
                  {
                    text: r.name || names[r.role] || r.role || '',
                    bold: true,
                    color: '#092b58',
                    italics: true,
                    fontSize: 12,
                  },
                  { text: ': ' + r.text },
                ]
              : '\n' + r.text + '\n \n',
          },
        ])
      )
    debug({ body })
    const stuff = [
      {
        layout: topBorder,
        table: {
          fontSize: 11,
          widths: [15, '*'],
          body: [
            [
              { text: number, bold: true, alignment: 'center' },
              { text: prompt, bold: true },
            ],
            ['', ''],
          ],
        },
      },
    ]
    if (images) stuff.push(renderImages(images, { width: 500 }))
    stuff.push({
      fontSize: 10,
      layout: {
        hLineWidth: function (i, node) {
          return i > 0 ? 8 : 4
        },
        vLineWidth: function (i, node) {
          return 0
        },
        vLineColor: 'grey',
        hLineColor: 'white',
      },
      table: {
        widths: [col1Width, '*'],
        body,
      },
    })

    return stuff
  }
}
const verbatimV2 = (number, prompt, response, images) => {
  const revert = 0
  const fillColor = revert ? 'white' : null
  const col1Width = revert ? 15 : 60
  const name = revert ? ' ' : null
  if (typeof response === 'string') {
    const stuff = [
      {
        layout: topBorder,
        table: {
          widths: [15, '*'],
          body: [
            [
              { text: number, bold: true },
              {
                text: prompt,
                bold: true,
              },
            ],
            ['', ''],
          ],
        },
      },
    ]
    if (images) stuff.push(renderImages(images, { width: 500 }))
    stuff.push({
      // layout: 'noBorders',
      table: {
        widths: [15, '*'],
        lineHeight: 1.5,
        body: [['', response + '\n ']],
      },
    })
    return stuff
  } else {
    let body
    if (response?.length === 0) body = ['', '']
    else
      body = [].concat(
        response?.map((r) => [
          {
            fillColor: fillColor || 'white',
            fillOpacity: 0.7,
            border: [false, true, true, true],
            padding: 4,
            fontSize: 10,
            color: colors[r.role] || '#cb1b33',
            text: name || r.name || names[r.role] || r.role || '',
            alignment: 'center',
            bold: true,
          },
          {
            text: revert
              ? [
                  {
                    text: r.name || names[r.role] || r.role || '',
                    bold: true,
                    color: '#092b58',
                    italics: true,
                    fontSize: 12,
                  },
                  { text: ': ' + r.text },
                ]
              : r.text + '\n\n\n',
          },
        ])
      )
    debug({ body })
    const stuff = [
      {
        layout: topBorder,
        table: {
          fontSize: 11,
          widths: [15, '*'],
          body: [
            [
              { text: number, bold: true, alignment: 'center' },
              { text: prompt, bold: true },
            ],
            ['', ''],
          ],
        },
      },
    ]
    if (images) stuff.push(renderImages(images, { width: 500 }))
    stuff.push({
      fontSize: 10,
      layout: {
        hLineWidth: function (i, node) {
          return 1
          return i > 0 ? 8 : 4
        },
        vLineWidth: function (i, node) {
          return 0
        },
        vLineColor: 'grey',
        hLineColor: '#eee',
      },
      table: {
        widths: [col1Width, '*'],
        body,
      },
    })

    return stuff
  }
}
export const verbatim = (number, prompt, response, images, version = 'v1') => {
  switch (version) {
    case 'v2':
      return verbatimV2(number, prompt, response, images)
      break
    case 'v1':
    default:
      return verbatimV1(number, prompt, response, images)
  }
}
/**
 * 
   matrix9({heading:'7. Communicating super powers',
     explain:'(Ability to convey meaning and obtain understanding)',
      low:'1 = Poor',
      high:'9 = Excellent'})
      */
export const matrix9 = ({ heading, explain, high, low, values, labels }) => [
  {
    layout: topBorder,
    style: 'sub_title',
    table: {
      widths: [330, '*', '*'],
      body: [
        [
          {
            bold: true,
            text: heading,
          },
          {
            alignment: 'right',
            bold: true,
            text: '',
          },
          {
            italics: true,
            alignment: 'left',
            text: '',
          },
        ],
      ],
    },
  },
  {
    layout: 'noBorders',
    style: 'sub_sub_title',
    table: {
      widths: [20, 300, '*', '*'],
      body: [
        [
          '',
          {
            text: explain,
          },
          {
            text: low,
          },
          {
            text: high,
          },
        ],
        ['', '', '', ''],
      ],
    },
  },
  {
    style: 'body',
    table: {
      widths: ['*', 8, 8, 8, 8, 8, 8, 8, 8, 8],
      alignment: 'center',
      style: 'body',
      body: scale9(values, labels),
    },
  },
  { text: '\n' },
]

export const scale9 = (values, labs = {}) => {
  const range = '1 2 3 4 5 6 7 8 9'.split(/\s+/)
  const vals =
    values ||
    Object.keys(labs).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {})
  // if (!values) return [[{ border: [false, false, true, true], text: '' }].concat(range)]

  return [[{ border: [false, false, true, true], text: '' }].concat(range)].concat(
    Object.keys(labs)
      .filter((key) => labs[key])
      .map((key) =>
        [
          {
            border: [false, true, true, true],
            style: 'body_table_name',
            text: labs[key] || `No label for ${key}`,
          },
        ].concat(
          range.map((n) => {
            return n === vals[key] ? 'X' : ''
          })
        )
      )
  )
}

export const q5Rows = (persons, version = 'v1') => {
  const prefix = version === 'v3' ? '' : 'koi__'
  const heading = [
    {
      style: 'header_line',
      text: 'Name and Position',
    },
    {
      text: 'Company Name',
      style: 'header_line',
    },
    {
      text: 'Email & Phone',
      style: 'header_line',
    },
  ]
  if (!persons || !persons.length) return [heading, ['No data', '', '']]
  debug({ persons })
  return [heading].concat(
    persons.filter(Boolean).map((person, ix) => {
      const values = {}
      'title name company email phone'.split(/\s+/).forEach((key) => {
        values[key] = person[prefix + key]
      })
      const name = person[prefix + 'name']
      return [
        {
          text: `${ix + 1}. ${values.name || ''}\n${values.title || ''}`,
          style: 'listitem',
        },
        {
          text: `${values.company || ''}`,
          style: 'listitem',
        },
        {
          text: `${values.email || ''}\n${values.phone || ''}`,
          style: 'listitem',
        },
      ]
    })
  )
}

/* Output a table for PDFMake...
 Params
 @rows = Array of objects containing data to be displayed
 @cols = Array of column names
*/
export const myTable = (rows, cols) => {
  const heading = cols.map((col) => {
    const colHdr = {
      style: 'header_line',
      text: col.heading || col.col,
    }
    if (typeof col === 'object') {
      styleKeys.forEach((key) => {
        if (col[key]) colHdr[key] = col[key]
      })
      if (col.headingStyle && typeof col.headingStyle === 'object') {
        styleKeys.forEach((key) => {
          if (col.headingStyle[key]) colHdr[key] = col.headingStyle[key]
        })
      }
    }
    return colHdr
  })

  if (!rows || !rows.length) return [heading, cols.map((col) => '')]
  // console.log({ rows })
  return [heading].concat(
    rows.map((row, ix) => {
      // Do calculations
      cols.forEach((col) => {
        if (col.calc) col.calc(row)
      })
      return cols.map((col) => {
        let text = `${row[col.col]}`
        if (col.format) {
          if (formatters[col.format]) text = formatters[col.format](row[col.col])
          else {
            if (typeof col.format === 'function') text = col.format(text, row)
            else text = myTableMerge(col.format, row)
          }
        }
        // console.log({ text })
        if (typeof text === 'string') text = text.replace('undefined', '')

        const cell = {
          text: text,
          // style: 'listitem',
        }
        if (typeof col === 'object') {
          styleKeys.forEach((key) => {
            if (col[key]) cell[key] = col[key]
            if (row[key]) cell[key] = row[key]
          })
        }

        return cell
      })
    })
  )
}

export const myTableMerge = (buf, context, limit = 50) => {
  console.log({ buf, context })
  let n = 0
  let merged = buf
  let done = false
  while (!done) {
    if (typeof merged !== 'string') return merged
    const m = merged?.match(/\[\[([a-z0-9_\-\.\s]+)\]\]/i)
    if (m) {
      const newValue = accessByPath(context, m[1]) || ''
      const re = `[[${m[1]}]]`
      if (typeof newValue === 'string') merged = merged.replace(re, newValue)
      else {
        merged = newValue
        done = true
      }
      n = n + 1
      if (n > limit) done = true
    } else done = true
  }
  // console.log({ merged })
  return merged
}

export const q10aRows = (persons, version = 'v1') => {
  const heading = [
    {
      style: 'header_line',
      text: 'Name',
    },
    {
      text: 'Email',
      style: 'header_line',
    },
  ]
  if (!persons || !persons.length) return [heading, ['No data', '']]
  debug({ persons })
  return [heading].concat(
    persons.filter(Boolean).map((person, ix) => {
      let name = ''
      let email = ''
      switch (version) {
        case 'v1':
          name = person.kp__name
          email = person.kp__email
          break
        case 'v3':
          name = person.name
          email = person.email
          break
        default:
          console.log(`q10aRows Unsupported version: ${version}`)
      }

      return [
        {
          text: `${ix + 1}. ${name}`,
          style: 'listitem',
        },
        {
          text: `${email}`,
          style: 'listitem',
        },
      ]
    })
  )
}

export const pdfHeader = ({
  page,
  v,
  title = 'No title provided',
  logo = 'icon',
  id = ' ',
  middle = ' ',
  right = 'TODAY',
}) => {
  if (page % 2 !== 0)
    return {
      margin: [30, 20, 30, 10],
      columns: [
        {
          layout: 'noBorders',
          table: {
            widths: [240, 300, '*'],
            body: [
              [
                {
                  image: logo,
                  alignment: 'left',
                  width: 125,
                },
                { text: middle },
                {
                  alignment: 'right',
                  text: right,
                },
              ],
              [{ text: ' ' }, { text: ' ' }, { text: ' ' }],
              [
                {
                  colSpan: 3,
                  fontSize: 13,
                  bold: true,
                  headerRows: 1,
                  table: {
                    widths: ['*', 80],
                    body: [
                      [
                        {
                          fillColor: '#092B58',
                          color: 'white',
                          text: title,
                        },
                        {
                          alignment: 'center',
                          text: id,
                          color: '#092B58',
                        },
                      ],
                    ],
                  },
                },
                { text: ' ' },
                { text: ' ' },
              ],
            ],
          },
        },
      ],
    }
  else
    return {
      margin: [30, 20, 30, 10],
      columns: [
        {
          layout: 'noBorders',
          table: {
            widths: [240, 300, '*'],
            body: [
              [
                {
                  image: logo,
                  alignment: 'left',
                  width: 125,
                },
                { text: ' ' },
                {
                  text: right,
                  alignment: 'right',
                },
              ],
              // [{ text: 'BACK' }, { text: ' ' }, { text: ' ' }],
              [
                {
                  colSpan: 3,
                  fontSize: 13,
                  bold: true,
                  headerRows: 1,
                  table: {
                    widths: [80, '*'],
                    body: [
                      [
                        {
                          alignment: 'center',
                          text: id,
                          color: '#092B58',
                        },
                        {
                          fillColor: '#092B58',
                          color: 'white',
                          text: title,
                          alignment: 'right',
                        },
                      ],
                    ],
                  },
                },
                { text: ' ' },
                { text: ' ' },
              ],
            ],
          },
        },
      ],
    }
}

export const mapHeaderV1 = (page, v, title, QNo, noDueDate) => {
  const hdrBody = [
    [{ style: 'header_left', text: 'Participant:' }, v('name')],
    [{ style: 'header_left', text: 'Organization:' }, v('company')],
    [{ style: 'header_left', text: 'Workshop Date:' }, v('workshop_date')],
  ]
  if (!noDueDate)
    hdrBody.push([{ style: 'header_left', text: 'Due Date:' }, v('due_date')])
  if (page % 2 !== 0)
    return {
      margin: [30, 20, 30, 10],
      columns: [
        {
          layout: 'noBorders',
          table: {
            widths: [150, 100, '*'],
            body: [
              [
                {
                  image: 'icon',
                  alignment: 'left',
                  width: 125,
                },
                { text: ' ' },
                {
                  layout: 'noBorders',
                  fontSize: 9,
                  table: {
                    body: hdrBody,
                  },
                },
              ],
              [{ text: ' ' }, { text: ' ' }, { text: ' ' }],
              [
                {
                  colSpan: 3,
                  fontSize: 13,
                  bold: true,
                  headerRows: 1,
                  table: {
                    widths: ['*', 40],
                    body: [
                      [
                        {
                          fillColor: '#092B58',
                          color: 'white',
                          text: title,
                        },
                        {
                          alignment: 'center',
                          text: QNo,
                          color: '#092B58',
                        },
                      ],
                    ],
                  },
                },
                { text: ' ' },
                { text: ' ' },
              ],
            ],
          },
        },
      ],
    }
  else
    return {
      margin: [30, 20, 30, 10],
      columns: [
        {
          layout: 'noBorders',
          table: {
            // widths: [240, 50, '*'],
            widths: [150, 100, '*'],
            body: [
              [
                {
                  image: 'icon',
                  alignment: 'left',
                  width: 125,
                },
                { text: ' ' },
                {
                  layout: 'noBorders',
                  fontSize: 9,
                  table: {
                    body: hdrBody,
                  },
                },
              ],
              [{ text: 'BACK' }, { text: ' ' }, { text: ' ' }],
              [
                {
                  colSpan: 3,
                  fontSize: 13,
                  bold: true,
                  headerRows: 1,
                  table: {
                    widths: [40, '*'],
                    body: [
                      [
                        {
                          alignment: 'center',
                          text: QNo,
                          color: '#092B58',
                        },
                        {
                          fillColor: '#092B58',
                          color: 'white',
                          text: title,
                          alignment: 'right',
                        },
                      ],
                    ],
                  },
                },
                { text: ' ' },
                { text: ' ' },
              ],
            ],
          },
        },
      ],
    }
}
export const mapHeaderV2 = (page, v, title, QNo, noDueDate) => {
  const hdrBody = [[{ style: 'header_left', text: v('name') }, v('workshop_date')]]
  if (!noDueDate)
    hdrBody.push([{ style: 'header_left', text: 'Due Date:' }, v('due_date')])
  return {
    margin: [30, 20, 30, 10],
    columns: [
      {
        layout: 'noBorders',
        table: {
          widths: [40, 2, 300, '*', 2],
          body: [
            [
              {
                border: [false, false, false, false],
                image: 'icon',
                alignment: 'center',
                width: 30,
              },
              {
                fillColor: '#092B58',
                color: 'white',
                text: '', // Padding
                alignment: 'right',
              },
              {
                fillColor: '#092B58',
                color: 'white',
                text: '  ' + title,
                alignment: 'left',
              },
              {
                fillColor: '#092B58',
                color: 'white',
                text: v('name') + '    ',
                alignment: 'right',
                paddingRight: 5,
              },
              {
                fillColor: '#092B58',
                color: 'white',
                text: '', // Padding
                alignment: 'right',
              },
            ],
          ],
        },
      },
    ],
  }
}
export const mapHeader = (page, v, title, QNo, noDueDate, version = 'v1') => {
  switch (version) {
    case 'v2':
      return mapHeaderV2(page, v, title, QNo, noDueDate)
      break
    case 'v1':
    default:
      return mapHeaderV1(page, v, title, QNo, noDueDate)
  }
}

export const mapFooterV1 = (page, pages, v) => {
  return {
    fontSize: 7,
    layout: 'noBorders',
    table: {
      widths: [30, '*', '*', 30],
      body: [
        [
          '',
          {
            text: v('slug'),
            color: '#ccc',
          },
          {
            bold: true,
            alignment: 'right',
            fontSize: 9,
            text: '(Please keep a copy of this form)',
          },
          '',
        ],
        [
          '',

          {
            text: 'Page ' + page + '/' + pages,
          },

          {
            alignment: 'right',
            text: 'Copyright © Management Action Programs, Inc. All rights reserved.',
          },
          '',
        ],
      ],
    },
  }
}

export const mapFooterV2 = (page, pages, v) => {
  return {
    fontSize: 7,
    layout: 'noBorders',
    table: {
      widths: [30, '*', 80, '*', 30],
      body: [
        [
          '',

          {
            text: 'Page ' + page + '/' + pages,
          },
          {
            text: v('slug'),
            color: '#ccc',
          },
          {
            alignment: 'right',
            text: 'Copyright © Management Action Programs, Inc. All rights reserved.',
          },
          '',
        ],
      ],
    },
  }
}

export const mapFooter = (page, pages, v, version = 'v1') => {
  switch (version) {
    case 'v2':
      return mapFooterV2(page, pages, v)
      break
    case 'v1':
    default:
      return mapFooterV1(page, pages, v)
  }
}

export const image = (path) => {
  if (Meteor.isClient) {
    return Meteor.absoluteUrl(path)
  }
  // TODO: Get rid of this, as it really only works in development environment
  return process.cwd() + '/../web.browser/app' + path
}

// Function to get a value, will be run in eval
export const v = (path) => {
  if (Object.keys(context).length) return accessByPath(context, path)
  else return `{{${path}}}`
}
const mapSectionV1 = (title, subTitle) => {
  return {
    fontSize: 13,
    bold: true,
    headerRows: 1,
    layout: 'noBorders',
    table: {
      widths: ['100%'],
      body: [
        [
          {
            margin: [2, 2, 2, 2],
            fillColor: '#cb1b33',
            fillOpacity: 0.8,
            padding: 4,
            color: 'white',
            text: title,
            alignment: 'center',
          },
        ],
        [''],
        [
          {
            margin: [20, 2, 2, 2],
            text: subTitle,
            italics: true,
            alignment: 'center',
            fontSize: 9,
            bold: false,
            lineHeight: 1.5,
          },
        ],
      ],
    },
  }
}
const mapSectionV2 = (title, subTitle) => {
  return {
    fontSize: 13,
    bold: true,
    headerRows: 1,
    layout: 'noBorders',
    table: {
      widths: ['100%'],
      body: [
        [
          {
            margin: [2, 2, 2, 2],
            lineColor: '#cb1b33',
            fillOpacity: 0.8,
            padding: 4,
            color: '#cb1b33',
            text: title,
            alignment: 'center',
          },
        ],
      ],
    },
  }
}
export const mapSection = (title = 'Missing title', subTitle = '', version = 'V1') => {
  if (version === 'V1') return mapSectionV1(title, subTitle)
  else return mapSectionV2(title, subTitle)
}

export const mliChart = (title, data) => {
  return {
    image: 'mli-chart',
    alignment: 'left',
    width: 400,
    border: [false, true, true, true],
  }
}

/**
 * Function to render list of images
 * @param  {Array<String>} images
 * @param  {any} options
 * @returns Array of image objects to put in PDF document
 */
export const renderImages = (images, options = {}) => {
  if (typeof images === 'string') return [{ text: `${images}` }]

  // images looks like [ { image: 'BASE64_STRING' } ]
  if (!images || images.length === 0) return []
  return images.map((image) => ({
    image: image,
    ...options,
  }))
}

export const pdfFooter = ({ page, pages, left = '', middle = '', right = '' }) => ({
  fontSize: 7,
  layout: 'noBorders',
  table: {
    widths: [30, '*', '*', '*', 30],
    body: [
      [
        '',
        {
          text: left || 'Page' + page + '/' + pages,
        },
        {
          alignment: 'center',
          text: middle || 'Copyright © 2024 Back2Dev',
        },
        {
          bold: true,
          alignment: 'right',
          fontSize: 9,
          text: right,
        },
        '',
      ],
    ],
  },
})

/* Output a table for PDFMake...
 Params
 @rows = Array of objects containing data to be displayed
 @cols = Array of column names
*/
export const groupTable = ({
  rows = [{ name: 'me', category: 'category' }],
  cols = [{ col: 'name' }],
  groupBy = 'category',
  orderBy = 'category',
}) => {
  // A nicety to explain what the table is for
  if (rows.length === 1 && rows[0].category === 'category') {
    rows[0].category = `Group table by ${groupBy}, no data supplied (yet). One table will appear for each [${groupBy}]`
    groupBy = 'category'
  }
  //
  const groups = rows.reduce((acc, { ...item }) => {
    if (!item[groupBy]) return acc //item[groupBy] = 'N/A'
    const group = item[groupBy]
    if (!acc.includes(group)) acc.push(group)
    return acc
  }, [])
  debug({ groups, numRows: rows.length })
  const heading = cols.map((col) => ({
    style: 'header_line',
    text: col.heading || col.col,
  }))

  if (!rows || !rows.length) return [heading, cols.map((col) => '')]

  const contents = groups.sort().map((group, ix) => {
    const head = cols.map((col) => {
      const colHdr =
        col.heading === 'group' ? group : col.heading || changeCase.capitalCase(col.col)
      return {
        style: 'header_line',
        text: colHdr,
      }
    })
    const pBreak =
      ix === 0
        ? ''
        : {
            text: '',
            pageBreak: 'after',
          }
    return [
      pBreak,
      {
        layout: 'noBorders',
        table: {
          widths: [70, 140],
          alignment: 'center',
          body: [
            [
              {
                image: slugify(`cat-${group}`),
                alignment: 'left',
                width: 60,
              },
              ['\n', { text: group, style: 'h3', bold: true, tocItem: true }],
            ],
          ],
        },
      },
      '',
      {
        style: 'prod_table',
        layout: {
          vLineWidth: function () {
            return 0
          },
          hLineWidth: function () {
            return 1
          },
          hLineColor: function (rowIndex, node, columnIndex) {
            return '#008dbe'
          },
        },
        table: {
          headerRows: 1,
          widths: cols.map((col) => col.width || '*'),
          body: [head].concat(
            rows
              .filter((row) => row[groupBy] === group)
              .map((row, ix) => {
                // Do calculations
                cols.forEach((col) => {
                  if (col.calc) col.calc(row)
                })
                return cols.map((col) => {
                  let text = `${row[col.col]}` || ''
                  if (col.format) {
                    if (formatters[col.format])
                      text = formatters[col.format](row[col.col])
                    else {
                      if (typeof col.format === 'function') text = col.format(text, row)
                      else text = myTableMerge(col.format, row)
                    }
                  }

                  return {
                    text,
                  }
                })
              })
          ),
        },
      },
    ]
  })
  return contents
}

const theLot = {
  scale9,
  topBorder,
  matrix9,
  verbatim,
  icons,
  q5Rows,
  q10aRows,
  myTable,
  groupTable,
  myTableMerge,
  pdfHeader,
  pdfFooter,
  mapHeader,
  mapFooter,
  mapSection,
  mliChart,
  renderImages,
  image,
  slugify,
}

export default theLot
