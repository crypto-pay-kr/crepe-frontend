'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Modal from '@/components/ui/modal/modal'
import { useModalStateStore } from '@/stores/useModalStateStore'

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)
  const {
    modalState: {
      visible,
      title,
      content,
      confirmEvent,
      buttonContent,
      hiddenButton,
      closeButtonDisabled,
      noPadding,
    },
  } = useModalStateStore()

  useEffect(() => {
    setPortalElement(document.getElementById('modal-root'))
  }, [])

  return (
    <>
      {children}
      {portalElement &&
        visible &&
        createPortal(
          <Modal
            title={title}
            content={content}
            confirmEvent={confirmEvent}
            buttonContent={buttonContent}
            hiddenButton={hiddenButton}
            closeButtonDisabled={closeButtonDisabled}
            noPadding={noPadding}
          />,
          portalElement!
        )}
    </>
  )
}
