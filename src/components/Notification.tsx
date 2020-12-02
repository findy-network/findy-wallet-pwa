import React from 'react'
import { Box, Button, Stack, Text } from 'grommet'
import { FormClose, StatusPlaceholder } from 'grommet-icons'
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
    duration={4}
  >
    <Box
      direction="row"
      align="center"
      justify="between"
      gap="small"
      round
      pad={{ vertical: `xsmall`, left: `medium`, right: `medium` }}
      background="status-ok"
    >
      <Text size="large">{text}</Text>
      <Stack alignSelf="center" margin={{ top: `xsmall` }}>
        <StatusPlaceholder />
        <Button plain icon={<FormClose />} onClick={onClose} />
      </Stack>
    </Box>
  </Dialog>
)

export default Notification
