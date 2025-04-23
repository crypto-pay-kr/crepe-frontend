"use client"

import LoginHome from "@/components/signup/LoginHome"
import * as React from "react"

export default function LoginPage() {
  return <LoginHome onStart={() => console.log("Start")} onSignup={() => console.log("Signup")} />
}