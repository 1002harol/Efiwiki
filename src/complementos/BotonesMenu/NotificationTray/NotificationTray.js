import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../Login/AuthContext.js';
import { FaBell, FaTrash ,FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../../../stylesP/NavegationBar.css';

const NotificationTray = () => {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadNotifications = useCallback(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filteredNotifications = storedNotifications.filter(notification =>
      user.role === 'admin' ? notification.role === 'admin' : notification.role !== 'admin'
    );
    setNotifications(filteredNotifications);
  }, [user.role]);

  useEffect(() => {
    loadNotifications();
    const handleStorageChange = () => loadNotifications();
    window.addEventListener('localStorageNotificationChange', handleStorageChange);
    return () => window.removeEventListener('localStorageNotificationChange', handleStorageChange);
  }, [loadNotifications]);

  const toggleTray = () => setShow(!show);

  const closeNotificationTray = () => {
    setShow(false);
  };
  const clearNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify([]));
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    setShow(false);
    switch(notification.type) {
      case 'problem':
        navigate(`/problems/${notification.itemId}`);
        break;
      case 'comunicado':
        navigate(`/comunicados/${notification.itemId}`);
        break;
      case 'manual':
        navigate(`/manuales/${notification.itemId}`);
        break;
      default:
        console.log('Tipo de notificación no reconocido');
    }
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? {...n, read: true} : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  if (!user) return null;

  return (
    <div className="notification-tray">
      <Button
        variant="light"
        onClick={toggleTray}
        className="notification-button position-fixed top-0 end-0"
        aria-label="Boton de notificacion"
      >
        <FaBell size={15} />
        {notifications.length > 0 && (
          <span className="position-absolute top-0 start-100  badge rounded-pill bg-danger" 
                style={{ fontSize: '0.5rem', padding: '0.25em 0.4em' }}>
            {notifications.length}
          </span>
        )}
      </Button>
      {show && (
        <div className="notification-container position-fixed top- end-0 bg-white shadow rounded" 
             style={{ width: '300px', maxHeight: '80vh', overflowY: 'auto', zIndex: 1020, marginTop: '3rem', marginRight: '20px' }}>
          <div className="p-2 bg-light border-bottom">
            <strong>Notificaciones</strong>
            <Button variant="light" size="sm" onClick={closeNotificationTray} style={{ padding: '0.25rem', minWidth: 'auto' }}>
              <FaTimes />
            </Button>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item p-2 border-bottom cursor-pointer hover:bg-light"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="fw-bold">{notification.type}</div>
              <div className="text-muted small">{new Date(notification.timestamp).toLocaleString()}</div>
              <div className="mt-1">{notification.message}</div>
            </div>
          ))}
          {notifications.length > 0 ? (
            <Button
              variant="danger"
              size="sm"
              className="w-100 mt-2"
              onClick={clearNotifications}
            >
              <FaTrash className="me-2" /> Limpiar todas
            </Button>
          ) : (
            <div className="p-3 text-center text-muted">No hay notificaciones</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationTray;