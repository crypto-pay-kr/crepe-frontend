import { ReactNode } from 'react'
import { Sheet } from 'react-modal-sheet'

export default function BottomSheet({
  open,
  setOpen,
  content,
  height,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  content: ReactNode
  height?: number
}) {
  return (
    <Sheet
      isOpen={open}
      onClose={() => {
        setOpen(false)
      }}
      snapPoints={[height ?? 200, 0]}
    >
      <Sheet.Backdrop
        onTap={() => {
          setOpen(false)
        }}
        style={{ backgroundColor: 'transparent' }}
      />
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div style={{ height: '100%', overflow: 'auto' }}>{content}</div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  )
}
