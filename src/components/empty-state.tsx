import type React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description: string
  icon: React.ReactNode
  actions?: React.ReactNode
}

export function EmptyState({ title, description, icon, actions }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-col items-center text-center pb-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>{description}</p>
      </CardContent>
      {actions && <CardFooter className="flex justify-center gap-2 pt-2">{actions}</CardFooter>}
    </Card>
  )
}
