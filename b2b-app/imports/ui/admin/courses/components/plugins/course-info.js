import { CellPlugin } from '@react-page/editor' // only use for TS purposes
import React from 'react'
import slate from '@react-page/plugins-slate'
import Typography from '@material-ui/core/Typography'

const courseInfo = (type, content, typographyVariant = 'body1') => {
  const capitalisedContent = type.charAt(0).toUpperCase() + type.slice(1)
  return {
    Renderer: ({ data }) => (
      <Typography variant={typographyVariant}>{content}</Typography>
    ),
    id: `content${capitalisedContent}`,
    title: capitalisedContent,
    description: content,
    version: 1,
    cellPlugins: [slate],
    controls: {
      type: 'autoform',
      schema: {
        properties: {
          title: {
            type: 'string',
            default: content,
          },
        },
        required: [capitalisedContent],
      },
    },
  }
}

export default courseInfo
