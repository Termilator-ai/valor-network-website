"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Users,
  Clock,
  Pin,
  Lock,
  User,
  LogIn,
  Plus,
  Eye,
  Reply,
  AlertCircle,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { namelessAPI, type ForumCategory, type ForumTopic } from "@/lib/nameless-api"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function ForumsPage() {
  const { user, login, register, logout, isLoading: authLoading } = useAuth()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [recentTopics, setRecentTopics] = useState<ForumTopic[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTopics: 0,
    totalPosts: 0,
    onlineUsers: 0,
  })
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authTab, setAuthTab] = useState("login")
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false)
  const [newTopicForm, setNewTopicForm] = useState({ title: "", content: "" })

  useEffect(() => {
    loadForumData()
  }, [])

  const showToast = (message: string, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const loadForumData = async () => {
    setIsLoading(true)
    try {
      // Load forum categories
      const categoriesResponse = await namelessAPI.getForumCategories()
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }

      // Load recent topics
      const topicsResponse = await namelessAPI.getForumTopics()
      if (topicsResponse.success && topicsResponse.data) {
        setRecentTopics(topicsResponse.data.slice(0, 10)) // Show latest 10 topics
      }

      // Load server stats
      const statsResponse = await namelessAPI.getServerInfo()
      if (statsResponse.success && statsResponse.data) {
        setStats({
          totalUsers: statsResponse.data.users.count,
          onlineUsers: statsResponse.data.users.online,
          totalTopics: statsResponse.data.forum.topics,
          totalPosts: statsResponse.data.forum.posts,
        })
      }
    } catch (error) {
      console.error("Failed to load forum data:", error)
      showToast("Failed to load forum data. Please refresh the page.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await login(loginForm.username, loginForm.password)

    if (result.success) {
      setShowAuthDialog(false)
      setLoginForm({ username: "", password: "" })
      showToast("Successfully logged in!", "success")
    } else {
      showToast(result.error || "Login failed", "error")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast("Passwords do not match!", "error")
      return
    }

    if (registerForm.password.length < 6) {
      showToast("Password must be at least 6 characters long!", "error")
      return
    }

    const result = await register(registerForm.username, registerForm.email, registerForm.password)

    if (result.success) {
      showToast("Registration successful! Please check your email to verify your account.", "success")
      setAuthTab("login")
      setRegisterForm({ username: "", email: "", password: "", confirmPassword: "" })
    } else {
      showToast(result.error || "Registration failed", "error")
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedCategory) {
      showToast("Please select a category and ensure you're logged in", "error")
      return
    }

    try {
      const response = await namelessAPI.createForumTopic(
        selectedCategory,
        newTopicForm.title,
        newTopicForm.content,
        user.id.toString(), // Using user ID as token for now
      )

      if (response.success) {
        showToast("Topic created successfully!", "success")
        setShowNewTopicDialog(false)
        setNewTopicForm({ title: "", content: "" })
        setSelectedCategory(null)
        // Reload topics
        loadForumData()
      } else {
        showToast(response.error || "Failed to create topic", "error")
      }
    } catch (error) {
      showToast("Failed to create topic", "error")
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp * 1000
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return formatDate(timestamp)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading forums...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="valor-gradient">Valor</span> <span className="network-text">Network</span> Forums
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with the community, share strategies, get support, and stay updated with the latest discussions.
          </p>
        </motion.div>

        {/* User Status & Auth */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {user ? (
                    <>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">Welcome back, {user.displayname || user.username}!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <Badge variant="secondary" className="mr-2">
                            {user.group_name}
                          </Badge>
                          {user.reputation > 0 && (
                            <Badge variant="outline" className="mr-2">
                              {user.reputation} reputation
                            </Badge>
                          )}
                          Member since {formatDate(user.registered)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold">Welcome to Valor Forums</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Please log in or register to participate in discussions
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {user ? (
                    <>
                      <Button
                        onClick={() => setShowNewTopicDialog(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Topic
                      </Button>
                      <Button onClick={logout} variant="outline">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login / Register
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Join the Community</DialogTitle>
                          <DialogDescription>
                            Login to your account or create a new one to participate in forums
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs value={authTab} onValueChange={setAuthTab}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                          </TabsList>
                          <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                              <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  type="text"
                                  value={loginForm.username}
                                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={loginForm.password}
                                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full" disabled={authLoading}>
                                {authLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                  </>
                                ) : (
                                  "Login"
                                )}
                              </Button>
                            </form>
                          </TabsContent>
                          <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                              <div>
                                <Label htmlFor="reg-username">Username</Label>
                                <Input
                                  id="reg-username"
                                  type="text"
                                  value={registerForm.username}
                                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={registerForm.email}
                                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="reg-password">Password</Label>
                                <Input
                                  id="reg-password"
                                  type="password"
                                  value={registerForm.password}
                                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                  required
                                  minLength={6}
                                />
                              </div>
                              <div>
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  value={registerForm.confirmPassword}
                                  onChange={(e) =>
                                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                                  }
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full" disabled={authLoading}>
                                {authLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                  </>
                                ) : (
                                  "Register"
                                )}
                              </Button>
                            </form>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Topic Dialog */}
        <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
              <DialogDescription>Start a new discussion in the community forums</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="topic-title">Title</Label>
                <Input
                  id="topic-title"
                  type="text"
                  value={newTopicForm.title}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
                  placeholder="Enter topic title..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="topic-content">Content</Label>
                <Textarea
                  id="topic-content"
                  value={newTopicForm.content}
                  onChange={(e) => setNewTopicForm({ ...newTopicForm, content: e.target.value })}
                  placeholder="Write your post content..."
                  rows={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Topic"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewTopicDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Forum Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.totalTopics.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Reply className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="h-8 w-8 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
              <div className="text-2xl font-bold">{stats.onlineUsers}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forum Categories */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6">Forum Categories</h2>
              {categories.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No forum categories available. Please check your NamelessMC configuration.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {category.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-semibold">{category.topics_count} topics</div>
                                <div className="text-gray-600 dark:text-gray-400">{category.posts_count} posts</div>
                              </div>
                            </div>
                            {category.latest_post && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>Last post: </span>
                                <span className="font-medium">{category.latest_post.topic_title}</span>
                                <span>by {category.latest_post.username}</span>
                                <span>{formatRelativeTime(category.latest_post.created)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Topics Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">Recent Topics</h2>
              {recentTopics.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">No recent topics found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentTopics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-2">
                          {topic.sticky && <Pin className="h-4 w-4 text-blue-500 mt-1" />}
                          {topic.locked && <Lock className="h-4 w-4 text-gray-500 mt-1" />}
                          <h4 className="font-semibold text-sm hover:text-blue-600 transition-colors line-clamp-2">
                            {topic.title}
                          </h4>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>by {topic.author}</div>
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1">
                              <Reply className="h-3 w-3" />
                              {topic.posts}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {topic.views}
                            </span>
                          </div>
                          <div>Last reply: {formatRelativeTime(topic.last_reply_created)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600"
          } text-white max-w-md`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "error" && <AlertCircle className="h-4 w-4" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
