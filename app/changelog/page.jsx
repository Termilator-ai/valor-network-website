"use client"

import { useState, useEffect } from "react"
import { Calendar, Edit, Trash2, Plus, X, Save, Eye, EyeOff, FileText } from "lucide-react"

export default function ChangelogPage() {
  const [changelogs, setChangelogs] = useState([])
  const [adminMode, setAdminMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    version: "",
    type: "update",
  })

  // Load changelogs from localStorage on component mount
  useEffect(() => {
    const savedChangelogs = localStorage.getItem("valor-changelogs")
    if (savedChangelogs) {
      setChangelogs(JSON.parse(savedChangelogs))
    } else {
      // Default changelogs if none exist
      const defaultChangelogs = []
      setChangelogs(defaultChangelogs)
      localStorage.setItem("valor-changelogs", JSON.stringify(defaultChangelogs))
    }
  }, [])

  // Listen for Ctrl + Shift + V to toggle admin mode OR 5 taps on title
  useEffect(() => {
    let tapCount = 0
    let tapTimer = null

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        e.preventDefault()
        setAdminMode(!adminMode)
        showToast(adminMode ? "Admin mode disabled" : "Admin mode enabled", "info")
      }
    }

    const handleTitleTap = () => {
      tapCount++
      if (tapCount === 1) {
        tapTimer = setTimeout(() => {
          tapCount = 0
        }, 2000) // Reset after 2 seconds
      } else if (tapCount === 5) {
        clearTimeout(tapTimer)
        tapCount = 0
        setAdminMode(!adminMode)
        showToast(adminMode ? "Admin mode disabled" : "Admin mode enabled", "info")
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // Add event listener to title for mobile
    const titleElement = document.getElementById("changelog-title")
    if (titleElement) {
      titleElement.addEventListener("click", handleTitleTap)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (titleElement) {
        titleElement.removeEventListener("click", handleTitleTap)
      }
      if (tapTimer) {
        clearTimeout(tapTimer)
      }
    }
  }, [adminMode])

  // Save changelogs to localStorage
  const saveChangelogs = (newChangelogs) => {
    setChangelogs(newChangelogs)
    localStorage.setItem("valor-changelogs", JSON.stringify(newChangelogs))
  }

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.description) {
      showToast("Please fill in all required fields", "error")
      return
    }

    const newChangelog = {
      id: editingId || Date.now(),
      ...formData,
      date: formData.date || new Date().toISOString().split("T")[0],
    }

    let updatedChangelogs
    if (editingId) {
      updatedChangelogs = changelogs.map((log) => (log.id === editingId ? newChangelog : log))
      showToast("Changelog updated successfully!", "success")
    } else {
      updatedChangelogs = [newChangelog, ...changelogs]
      showToast("Changelog added successfully!", "success")
    }

    saveChangelogs(updatedChangelogs)
    resetForm()
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      description: "",
      version: "",
      type: "update",
    })
    setShowForm(false)
    setEditingId(null)
  }

  // Edit changelog
  const handleEdit = (changelog) => {
    setFormData(changelog)
    setEditingId(changelog.id)
    setShowForm(true)
  }

  // Delete changelog
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this changelog?")) {
      const updatedChangelogs = changelogs.filter((log) => log.id !== id)
      saveChangelogs(updatedChangelogs)
      showToast("Changelog deleted successfully!", "success")
    }
  }

  // Get type badge styling
  const getTypeBadge = (type) => {
    const badges = {
      major: "bg-red-500 text-white",
      update: "bg-blue-500 text-white",
      hotfix: "bg-yellow-500 text-black",
      event: "bg-purple-500 text-white",
      security: "bg-green-500 text-white",
    }
    return badges[type] || badges.update
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div className="text-center mx-auto">
            <h1 id="changelog-title" className="text-5xl font-bold mb-6 cursor-pointer select-none">
              <span className="valor-gradient">Valor</span> <span className="network-text">Network</span> Changelog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track all server updates, improvements, and changes. Stay informed about the latest developments.
            </p>
          </div>

          {adminMode && (
            <div className="flex gap-2 absolute top-24 right-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-white"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
              <button
                onClick={() => {
                  setAdminMode(false)
                  showToast("Admin mode disabled", "info")
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-white"
              >
                <EyeOff className="w-4 h-4" />
                Exit Admin
              </button>
            </div>
          )}
        </div>

        {/* Admin Mode Indicator */}
        {adminMode && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg mb-8 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="font-semibold">Admin Mode Active</span>
            <span className="text-sm opacity-75">- You can now edit and manage changelog entries</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {adminMode && showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? "Edit Changelog Entry" : "Add New Changelog Entry"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Update title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="v1.0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="update">Update</option>
                    <option value="major">Major Release</option>
                    <option value="hotfix">Hotfix</option>
                    <option value="event">Event</option>
                    <option value="security">Security</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Describe the changes..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors text-white"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Changelog List */}
        <div className="space-y-8">
          {changelogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-4">Nothing to look at here.</p>
              {adminMode && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors text-white"
                >
                  Add First Entry
                </button>
              )}
            </div>
          ) : (
            changelogs.map((changelog, index) => (
              <div
                key={changelog.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-2xl font-bold">{changelog.title}</h2>
                      {changelog.version && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-mono">
                          {changelog.version}
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeBadge(changelog.type)}`}
                      >
                        {changelog.type}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(changelog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {adminMode && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(changelog)}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors text-white"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(changelog.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded transition-colors text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{changelog.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600"
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
