"use client"

import type React from "react"

import { useState } from "react"
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New incident report assigned",
      description: "Incident #2023-045 has been assigned to you for investigation",
      time: "5 minutes ago",
      read: false,
      type: "assignment",
      priority: "high",
    },
    {
      id: 2,
      title: "AI analysis complete",
      description: "AI analysis for incident #2023-042 is ready for review",
      time: "1 hour ago",
      read: false,
      type: "ai",
      priority: "medium",
    },
    {
      id: 3,
      title: "Report requires attention",
      description: "Chief Analyst has requested changes to report #2023-039",
      time: "3 hours ago",
      read: true,
      type: "alert",
      priority: "high",
    },
    {
      id: 4,
      title: "Evidence uploaded successfully",
      description: "Photo evidence for case #2023-041 has been processed",
      time: "5 hours ago",
      read: true,
      type: "success",
      priority: "low",
    },
    {
      id: 5,
      title: "System maintenance scheduled",
      description: "ISAAC platform will undergo maintenance on Sunday 2:00 AM",
      time: "1 day ago",
      read: false,
      type: "info",
      priority: "medium",
    },
  ])

  const [expandedOpen, setExpandedOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "ai":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "alert":
        return <div className="h-2 w-2 rounded-full bg-orange-500" />
      case "success":
        return <div className="h-2 w-2 rounded-full bg-emerald-500" />
      case "info":
        return <div className="h-2 w-2 rounded-full bg-blue-400" />
      default:
        return <div className="h-2 w-2 rounded-full bg-primary" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "ai":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />
      default:
        return <Bell className="h-4 w-4 text-primary" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto scrollbar-hide">
            {notifications.slice(0, 3).length > 0 ? (
              notifications.slice(0, 3).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 ${!notification.read ? "bg-muted/50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex w-full items-start gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-center cursor-pointer" onClick={() => setExpandedOpen(true)}>
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Expanded Notifications Dialog */}
      <Dialog open={expandedOpen} onOpenChange={setExpandedOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>All Notifications</span>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark all read
                  </Button>
                )}
                <Badge variant="outline">{notifications.length} total</Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              Manage all your notifications and stay updated with the latest activities.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="mt-4">
              <div className="overflow-y-auto max-h-[50vh] pr-2 scrollbar-hide">
                <div className="space-y-3">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                        getTypeIcon={getTypeIcon}
                        getPriorityColor={getPriorityColor}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No unread notifications</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="read" className="mt-4">
              <div className="overflow-y-auto max-h-[50vh] pr-2 scrollbar-hide">
                <div className="space-y-3">
                  {readNotifications.length > 0 ? (
                    readNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                        getTypeIcon={getTypeIcon}
                        getPriorityColor={getPriorityColor}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No read notifications</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              <div className="overflow-y-auto max-h-[50vh] pr-2 scrollbar-hide">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      getTypeIcon={getTypeIcon}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  getTypeIcon,
  getPriorityColor,
}: {
  notification: any
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
  getTypeIcon: (type: string) => React.ReactNode
  getPriorityColor: (priority: string) => string
}) {
  return (
    <div className={`p-4 rounded-lg border ${!notification.read ? "bg-muted/30 border-primary/20" : "bg-background"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getTypeIcon(notification.type)}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                {notification.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{notification.description}</p>
            <p className="text-xs text-muted-foreground">{notification.time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {!notification.read && (
            <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)} className="h-8 w-8 p-0">
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
