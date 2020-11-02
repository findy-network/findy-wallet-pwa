import React, { useState } from 'react'
import Reader from 'react-qr-reader'

interface IProps {
  onRead: (res: string) => void
}

function QrReader({ onRead }: IProps) {
  const [error, setError] = useState(null)
  return (
    <>
      {error ? (
        <div>Error accessing camera</div>
      ) : (
        <Reader
          delay={300}
          onError={(err: any) => setError(err)}
          onScan={(res: string) => res && onRead(res)}
          style={{ width: '100%' }}
        />
      )}
    </>
  )
}

export default QrReader
