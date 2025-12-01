import React from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import timelineData from './timeline-data'

const MyTimeline = () => {
  return (
    <Stack spacing={4} sx={{ position: 'relative', pl: 4 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 12,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: '#e0e0e0',
        }}
      />
      {timelineData &&
        timelineData.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={2}
            sx={{ alignItems: 'flex-start', position: 'relative' }}
          >
            <Box
              sx={{
                minWidth: 60,
                textAlign: 'center',
                fontFamily: 'GothamRoundedMedium',
                color: '#fff',
                bgcolor: '#4794fc',
                borderRadius: '999px',
                px: 1.5,
                py: 1,
              }}
            >
              {item.dateText}
            </Box>
            <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
              <Typography component="div">
                {item.markdown && (
                  <ReactMarkdown remarkPlugins={[gfm]}>{item.markdown}</ReactMarkdown>
                )}
              </Typography>
            </Paper>
          </Stack>
        ))}
    </Stack>
  )
}

export default MyTimeline
