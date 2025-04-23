// import { ReactNode } from 'react'
// import { motion } from 'framer-motion'
// import useModal from '@/hooks/useModal'
// import Button from '@/components/ui/button'
// import CrossIcon from '@/assets/common/svg/cross-icon'

// export default function Modal({
//   title,
//   content,
//   confirmEvent,
//   buttonContent,
//   setOpen,
//   hiddenButton,
//   closeButtonDisabled,
//   noPadding,
// }: {
//   title: string
//   content: ReactNode
//   confirmEvent?: () => void
//   buttonContent?: ReactNode
//   setOpen?: React.Dispatch<React.SetStateAction<boolean>>
//   hiddenButton?: boolean
//   closeButtonDisabled?: boolean
//   noPadding?: boolean
// }) {
//   const { close } = useModal()

//   const handleConfirmButtonClick = () => {
//     if (confirmEvent) confirmEvent()
//   }

//   return (
//     <div
//       className="fixed left-0 top-0 flex h-full w-full cursor-default items-center justify-center bg-[#00000066]"
//       style={{ zIndex: 10000 }}
//       onClick={e => {
//         e.stopPropagation()
//       }}
//     >
//       <motion.div
//         className={`flex min-w-[240px] max-w-[95%] flex-col justify-center gap-[10px] rounded-[10px] bg-white ${noPadding ? 'pt-[12px]' : 'px-[15px] py-[12px]'}`}
//         initial={{
//           opacity: 0,
//           scale: 0.75,
//         }}
//         animate={{
//           opacity: 1,
//           scale: 1,
//           transition: {
//             ease: 'easeOut',
//             duration: 0.15,
//           },
//         }}
//         exit={{
//           opacity: 0,
//           scale: 0.75,
//           transition: {
//             ease: 'easeIn',
//             duration: 0.15,
//           },
//         }}
//       >
//         <div className="relative">
//           {closeButtonDisabled || (
//             <button
//               className={`absolute ${noPadding ? 'right-[10px]' : 'right-0'}`}
//               onClick={() => {
//                 setOpen ? setOpen(false) : close()
//               }}
//             >
//               <CrossIcon type="modal" />
//             </button>
//           )}
//           <h1 className="text-center text-[18px] font-bold">{title}</h1>
//         </div>
//         <div className="flex min-h-[96px] items-center justify-center text-center text-[13px] font-[350] text-gray03">
//           {content}
//         </div>
//         {hiddenButton || (
//           <div>
//             <Button
//               value="확인"
//               customContent={buttonContent}
//               onClick={() => {
//                 if (confirmEvent) {
//                   handleConfirmButtonClick()
//                 } else if (setOpen) {
//                   setOpen(false)
//                 } else {
//                   close()
//                 }
//               }}
//               style={{ padding: '5.5px', fontSize: '16px' }}
//             />
//           </div>
//         )}
//       </motion.div>
//     </div>
//   )
// }
