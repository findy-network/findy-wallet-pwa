import React, { useState } from 'react'
import { QrReader as Reader } from 'react-qr-reader'

interface IProps {
  onRead: (res: string) => void
}

function QrReader({ onRead }: IProps) {
  const [error, setError] = useState(null)
  return (
    <div style={{ width: '100%' }}>
      {error ? (
        <div>Error accessing camera</div>
      ) : (
        <Reader
          delay={300}
          onError={(err: any) => setError(err)}
          onResult={(res: string) => res && onRead(res)}
        />
      )}
    </div>
  )
}

export default QrReader
