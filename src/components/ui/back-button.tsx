"use client"

import { Button } from "./button"
import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href?: string
  label?: string
}

const BackButton = ({ href, label = "Back", ...props }: BackButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={cn("gap-2")}
      {...props}
    >
      <MoveLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}

export default BackButton
