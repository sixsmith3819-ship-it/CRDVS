'use client'

import { useState } from 'react'
import { GlassCard } from './GlassCard'
import { cn } from '@/lib/cn'
import { colors } from '@/lib/design-tokens'

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

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Verification Request Completed',
    message: 'Identity verification for John Doe (ID: VER-2024-001) has been successfully processed.',
    type: 'success',
    time: '5 minutes ago',
    read: false,
    action: {
      label: 'View Report',
      onClick: () => console.log('View report')
    }
  },
  {
    id: '2',
    title: 'Duplicate Record Detected',
    message: 'Potential duplicate found for Sarah Johnson. Manual review required.',
    type: 'warning',
    time: '1 hour ago',
    read: false,
    action: {
      label: 'Review',
      onClick: () => console.log('Review duplicate')
    }
  },
  {
    id: '3',
    title: 'System Maintenance Scheduled',
    message: 'Database maintenance scheduled for tonight at 2:00 AM. Expected downtime: 30 minutes.',
    type: 'info',
    time: '2 hours ago',
    read: true
  },
  {
    id: '4',
    title: 'New Record Created',
    message: 'Criminal record CR-2024-0456 has been successfully added to the database.',
    type: 'success',
    time: '3 hours ago',
    read: true
  },
  {
    id: '5',
    title: 'Access Attempt Failed',
    message: 'Failed login attempt detected from unknown IP address 192.168.1.100.',
    type: 'error',
    time: '4 hours ago',
    read: true
  }
]

export function NotificationsPanel({ className }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

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
            <div className="w-6 h-6 rounded-full bg-[#14b8a6] flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">{unreadCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Toggle */}
          <div className="flex rounded-lg" style={{ backgroundColor: colors.surface }}>
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                filter === 'all'
                  ? "bg-[#14b8a6] text-gray-900 shadow-sm"
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
                  ? "bg-[#14b8a6] text-gray-900 shadow-sm"
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
        {filteredNotifications.length === 0 ? (
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
                    ? "border-[#14b8a6]/30 bg-[#14b8a6]/5"
                    : "border-transparent hover:border-[#3a4254]"
                )}
                style={{
                  backgroundColor: notification.read 
                    ? colors.glass 
                    : `${colors.auroraTeal}08`
                }}
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
                        "text-sm font-medium transition-colors",
                        !notification.read ? "text-gray-900" : "text-gray-700"
                      )}>
                        {notification.title}
                      </h4>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#14b8a6] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-xs leading-relaxed mb-2",
                      !notification.read ? "text-gray-700" : "text-gray-600"
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

