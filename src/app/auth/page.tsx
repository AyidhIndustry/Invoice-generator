'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth.context'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SignInForm() {
  const { error, signin, isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.username || !form.password) {
      toast.error('Please fill the fields')
      return
    }

    const res = await signin({
      username: form.username,
      password: form.password,
    })
    if (res.ok) {
      router.push('/')
    }
    // on failure the `error` from context will show in the UI
  }

  useEffect(() => {
    console.log("called")
    if (isAuthenticated && user) {
      router.push('/')
    }
  }, [router, isAuthenticated, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 relative rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo-dark.png"
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority={true}
                />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Sign In
              </CardTitle>
              <CardDescription className="text-sm">
                Sign in to your invoice platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter your username"
                className="input-focus bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <InputGroup>
                {/* IMPORTANT: add name="password" so handleChange can update form.password */}
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    size="icon-xs"
                    variant="ghost"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 font-semibold tracking-wide"
            >
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
