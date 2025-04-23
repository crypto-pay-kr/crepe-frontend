"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Router from "./Router"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
  },
})

function App() {
  const [buttonColor, setButtonColor] = useState<"blue" | "gray">("blue")

  const toggleButtonColor = () => {
    setButtonColor(buttonColor === "blue" ? "gray" : "blue")
  }

  return (
      <QueryClientProvider client={queryClient}>
            <Router buttonColor={buttonColor} toggleButtonColor={toggleButtonColor} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
  )
}

export default App
