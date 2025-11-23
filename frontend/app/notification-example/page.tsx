"use client";

import React from 'react';
import { useNotification } from '@/app/contexts/NotificationContext';
import { Button } from '@/components/Button/Button';
import Card from '@/components/Card/Card';
import CircularProgress from '@/components/CircularProgress/CircularProgress';

export default function NotificationExample() {
  const {
    unreadCount,
    notifications,
    loading,
    error,
    getUnreadCount,
    getNotificationGrid,
    markAsRead,
    markAllAsRead,
    updateNotificationStatus,
    refreshNotifications,
  } = useNotification();

  const handleRefresh = async () => {
    try {
      await refreshNotifications();
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleToggleStatus = async (notificationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'SEND' ? 'OPEN' : 'SEND';
    try {
      await updateNotificationStatus(notificationId, newStatus);
    } catch (err) {
      console.error('Error updating notification status:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notification Context Example</h2>

          {/* Status Overview */}
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Unread Count:</span> {unreadCount}
            </div>
            <div className="text-sm">
              <span className="font-medium">Total Notifications:</span> {notifications.length}
            </div>
            {error && (
              <div className="text-sm text-red-600">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleRefresh}
              disabled={loading.grid || loading.count}
              variant="primary"
            >
              {loading.grid || loading.count ? (
                <CircularProgress size={20} />
              ) : (
                'Refresh'
              )}
            </Button>

            <Button
              onClick={handleMarkAllAsRead}
              disabled={loading.markAllAsRead || unreadCount === 0}
              variant="secondary"
            >
              {loading.markAllAsRead ? (
                <CircularProgress size={20} />
              ) : (
                'Mark All as Read'
              )}
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notifications</h3>

            {loading.grid ? (
              <div className="flex justify-center py-4">
                <CircularProgress />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No notifications found
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            notification.status === 'SEND'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            notification.type === 'INTEREST'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {notification.type}
                          </span>
                          {notification.isSystem && (
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                              System
                            </span>
                          )}
                        </div>

                        <p className="text-sm mb-2">{notification.message}</p>

                        <div className="text-xs text-gray-500">
                          <div>From: {notification.senderName} ({notification.senderType})</div>
                          <div>Created: {new Date(notification.createdAt || '').toLocaleString()}</div>
                          {notification.updatedAt && (
                            <div>Updated: {new Date(notification.updatedAt).toLocaleString()}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {notification.status === 'SEND' && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={loading.markAsRead}
                            size="sm"
                            variant="secondary"
                          >
                            Mark Read
                          </Button>
                        )}

                        <Button
                          onClick={() => handleToggleStatus(notification.id, notification.status || 'SEND')}
                          disabled={loading.updateStatus}
                          size="sm"
                          variant="outlined"
                        >
                          Toggle Status
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}