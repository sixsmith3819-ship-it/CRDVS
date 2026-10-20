'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from './GlassCard'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  time: string
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationsPanelProps {
  className?: string
}

export function NotificationsPanel({ className }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const supabase = await createClient()
        
        // Fetch the latest 10 audit logs
        const { data: logs, error } = await supabase
          .from('audit_logs')
          .select('id, action, table_name, record_id, description, user_id, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error fetching audit logs:', error)
          setLoading(false)
          return
        }

        // Transform audit logs into notifications
        const transformedNotifications = logs?.map((log: any) => {
          const getNotificationDetails = (action: string, tableName: string, description: string) => {
            const actionMap: Record<string, { title: string; type: Notification['type'] }> = {
              'INSERT': { title: 'New Record Created', type: 'success' },
              'UPDATE': { title: 'Record Updated', type: 'info' },
              'DELETE': { title: 'Record Deleted', type: 'warning' },
              'VERIFY': { title: 'Verification Completed', type: 'success' },
              'CREATE': { title: 'Record Created', type: 'success' },
              'AUTH': { title: 'Authentication Event', type: 'info' },
              'ACCESS_DENIED': { title: 'Access Denied', type: 'error' },
            }
            
            const details = actionMap[action] || { title: action.replace('_', ' '), type: 'info' as const }
            return details
          }

          const details = getNotificationDetails(log.action, log.table_name, log.description)
          const timeAgo = getTimeAgo(new Date(log.created_at))

          return {
            id: log.id,
            title: details.title,
            message: log.description || `${log.action} on ${log.table_name}${log.record_id ? ` (ID: ${log.record_id})` : ''}`,
            type: details.type,
            time: timeAgo,
            read: true, // Assume all fetched logs are read
          }
        }) || []

        setNotifications(transformedNotifications)
      } catch (error) {
        console.error('Error in fetchAuditLogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [])

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const getTypeConfig = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          color: colors.statusSuccess,
          bgColor: `${colors.statusSuccess}15`,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        }
      case 'error':
        return {
          color: colors.statusDanger,
          bgColor: `${colors.statusDanger}15`,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        }
      case 'warning':
        return {
          color: colors.statusWarning,
          bgColor: `${colors.statusWarning}15`,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        }
      default:
        return {
          color: colors.statusInfo,
          bgColor: `${colors.statusInfo}15`,
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        }
    }
  }

  return (
    <GlassCard className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          {unreadCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">{unreadCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <div className="flex rounded-lg bg-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                filter === 'all'
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                filter === 'unread'
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3a4254]">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm mt-2">Loading activity...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-sm">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const typeConfig = getTypeConfig(notification.type)
            
            return (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer group",
                  !notification.read 
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Type Icon */}
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: typeConfig.bgColor,
                      color: typeConfig.color 
                    }}
                  >
                    {typeConfig.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={cn(
                        "text-sm font-semibold transition-colors",
                        !notification.read ? "text-gray-900" : "text-gray-700"
                      )}>
                        {notification.title}
                      </h4>
                      
                      {!notification.read && (
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1 shadow-sm" />
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-xs leading-relaxed mb-2",
                      !notification.read ? "text-gray-800" : "text-gray-600"
                    )}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {notification.time}
                      </span>
                      
                      {notification.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            notification.action?.onClick()
                            markAsRead(notification.id)
                          }}
                          className="text-xs font-medium transition-colors hover:underline"
                          style={{ color: typeConfig.color }}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: colors.glassBorder }}>
        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </GlassCard>
  )
}

export default NotificationsPanel

