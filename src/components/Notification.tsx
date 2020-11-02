import React from 'react'
import { Box, Text } from 'grommet'
import { EmptyCircle } from 'grommet-icons'
import Dialog from './Dialog'

interface IProps {
  onClose: () => void
  text: string
}

const Notification = ({ onClose, text }: IProps) => (
  <Dialog
    position="top"
    modal={false}
    plain={true}
    onClose={onClose}
    onEsc={onClose}
    duration={3}
  >
    <Box
      direction="row"
      align="center"
      justify="between"
      gap="small"
      round
      pad="small"
      background="status-ok"
    >
      <EmptyCircle />
      <Text size="large">{text}</Text>
    </Box>
  </Dialog>
)

export default Notification
