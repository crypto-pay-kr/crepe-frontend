interface LoginFormProps {
    onSubmit: () => void
    children: React.ReactNode
  }
  
  export default function LoginForm({ onSubmit, children }: LoginFormProps) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="flex flex-col w-full"
      >
        {children}
      </form>
    )
  }