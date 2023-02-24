import { Box } from '@material-ui/core'
import React from 'react'
import CrashHistoryEntry from '../../components/crash/CrashHistoryEntry'
import useStyles from './useStyles'

export const CrashHistory = ({ history }) => {
  const classes = useStyles()

  return (
    <Box className={classes.right}>
      {history.map((game, index) => (
        <CrashHistoryEntry key={index} game={game} />
      ))}
    </Box>
  )
}
