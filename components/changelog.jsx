"use client"

import { useState, useEffect } from "react"
import { Calendar, Edit, Trash2, Plus, X, Save, Eye, EyeOff } from "lucide-react"

export default function Changelog() {
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
    const savedChangelogs = localStorage.getItem("minecraft-changelogs")
    if (savedChangelogs) {
      setChangelogs(JSON.parse(savedChangelogs))
    } else {
      // Default changelogs if none exist
      const defaultChangelogs = [
        {
          id: 1,
          title: "Season 5 Launch",
          version: "v5.0.0",
          date: "2024-12-15",
          type: "major",
          description:
            "Major season update with new maps, custom enchantments, and faction mechanics. Three new worlds available for conquest!",
        },
        {
          id: 2,
          title: "Holiday Event",
          version: "v4.8.1",
          date: "2024-12-10",
          type: "event",
          description:
            "Special holiday celebration with limited-time rewards, festive decorations, and exclusive holiday crates.",
        },
        {
          id: 3,
          title: "Anti-Cheat Enhancement",
          version: "v4.7.2",
          date: "2024-12-05",
          type: "security",
          description: "Implemented advanced anti-cheat measures and security improvements for fair gameplay.",
        },
      ]
      setChangelogs(defaultChangelogs)
      localStorage.setItem("minecraft-changelogs", JSON.stringify(defaultChangelogs))
    }
  }, [])

  // Listen for Ctrl + Shift + V to toggle admin mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        e.preventDefault()
        setAdminMode(!adminMode)
        showToast(adminMode ? "Admin mode disabled" : "Admin mode enabled", "info")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [adminMode])

  // Save changelogs to localStorage
  const saveChangelogs = (newChangelogs) => {
    setChangelogs(newChangelogs)
    localStorage.setItem("minecraft-changelogs", JSON.stringify(newChangelogs))
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Server</span>{" "}
              <span className="text-purple-400">Changelog</span>
            </h1>
            <p className="text-gray-400">Stay updated with the latest server changes and improvements</p>
          </div>

          {adminMode && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Changelog
              </button>
              <button
                onClick={() => {
                  setAdminMode(false)
                  showToast("Admin mode disabled", "info")
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Exit Admin
              </button>
            </div>
          )}
        </div>

        {/* Admin Mode Indicator */}
        {adminMode && (
          <div className="bg-yellow-600 text-black px-4 py-2 rounded-lg mb-6 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span className="font-semibold">Admin Mode Active</span>
            <span className="text-sm opacity-75">- You can now edit and manage changelogs</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {adminMode && showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Changelog" : "Add New Changelog"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                  placeholder="Describe the changes..."
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Changelog List */}
        <div className="space-y-6">
          {changelogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No changelogs available yet.</p>
              {adminMode && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Add First Changelog
                </button>
              )}
            </div>
          ) : (
            changelogs.map((changelog) => (
              <div
                key={changelog.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white">{changelog.title}</h2>
                      {changelog.version && (
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm font-mono">
                          {changelog.version}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getTypeBadge(changelog.type)}`}
                      >
                        {changelog.type}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
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
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(changelog.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed">{changelog.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        {!adminMode && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Press <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">Ctrl</kbd> +
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs mx-1">Shift</kbd> +
              <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">V</kbd> for admin access
            </p>
          </div>
        )}
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
