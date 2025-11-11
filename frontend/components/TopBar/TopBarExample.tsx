// Ejemplo de uso de la TopBar actualizada
import TopBar from '@/components/TopBar/TopBar';
import NotificationButton from '@/components/TopBar/NotificationButton';

function MyPage() {
  const handleUserClick = () => {
    // Abrir menú de perfil de usuario
    console.log('User profile clicked');
  };

  const handleNotificationsClick = () => {
    // Abrir panel de notificaciones
    console.log('Notifications clicked');
  };

  return (
    <TopBar
      title="Mi Aplicación"
      logoSrc="/logo.png"

      // Botón de usuario (opcional)
      showUserButton={true}
      onUserClick={handleUserClick}

      // Nombre de usuario (opcional)
      userName="Juan Pérez"

      // Notificaciones (opcional)
      showNotifications={true}
      notificationCount={5} // Muestra badge con "5"
      onNotificationsClick={handleNotificationsClick}

      // Menú lateral (existente)
      menuItems={[
        { label: 'Inicio', url: '/' },
        { label: 'Perfil', url: '/profile' },
      ]}
    />
  );
}

// El NotificationButton también se puede usar de forma independiente
function StandaloneNotification() {
  return (
    <NotificationButton
      count={10}
      onClick={() => console.log('Notifications clicked')}
      className="custom-class"
      data-test-id="my-notifications"
    />
  );
}

export default MyPage;