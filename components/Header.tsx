
import React, { useState, useEffect, useRef } from 'react';
import { View, Notification } from '../types';
import { MOCK_NOTIFICATIONS, IconLogout } from '../constants';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  activeView: View;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const typeClasses = {
        WARN: 'text-yellow-400',
        INFO: 'text-green-400',
        FAIL: 'text-red-400',
    };
    return (
        <div className="p-3 border-b border-border-color last:border-b-0 hover:bg-primary transition-colors">
            <p className={`font-semibold text-sm ${typeClasses[notification.type]}`}>{notification.type}</p>
            <p className="text-text-primary text-sm mt-1">{notification.message}</p>
            <p className="text-xs text-text-secondary mt-1">{notification.timestamp}</p>
        </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [hasUnread, setHasUnread] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (hasUnread) {
        setHasUnread(false);
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex-shrink-0 bg-secondary border-b border-border-color px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-accent tracking-wide">DIGITAL TWINS</h1>
        <p className="text-sm text-text-secondary">{activeView}</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={handleToggleDropdown} 
            className="relative text-text-secondary hover:text-text-primary transition-colors"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="Toggle notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {hasUnread && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-secondary"></span>}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-secondary rounded-lg shadow-2xl border border-border-color z-10">
                <div className="p-3 flex justify-between items-center border-b border-border-color">
                    <h4 className="font-semibold text-text-primary">Notifications</h4>
                    {notifications.length > 0 && 
                        <button onClick={handleClearNotifications} className="text-xs text-accent hover:underline">Clear all</button>
                    }
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                    ) : (
                        <p className="text-center text-text-secondary p-4">No new notifications.</p>
                    )}
                </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg" alt="HNAI Avatar" className="w-10 h-10 rounded-full" />
          <div className="text-right">
            <p className="font-semibold text-sm text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-secondary italic">"designed with passion for innovation"</p>
          </div>
          <button onClick={logout} className="text-text-secondary hover:text-accent transition-colors p-2 rounded-md" aria-label="Logout">
              <IconLogout className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </header>
  );
};
