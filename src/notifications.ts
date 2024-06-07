// notifications.ts
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number; // Duration in milliseconds
}

const createNotification = ({ type, message, duration = 5000 }: NotificationProps) => {
  const container = document.createElement('div');
  container.className = `fixed top-4 right-4 max-w-xs w-full z-50 transition-transform duration-300 transform-gpu translate-x-4 opacity-0`;

  const notification = document.createElement('div');
  notification.className = `flex items-center justify-between p-4 rounded shadow-lg text-white ${getBackgroundColor(
    type
  )}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="ml-4 text-xl leading-none">&times;</button>
  `;

  container.appendChild(notification);
  document.body.appendChild(container);

  // Show the notification
  requestAnimationFrame(() => {
    container.classList.remove('translate-x-4', 'opacity-0');
  });

  // Remove the notification after the specified duration
  setTimeout(() => {
    hideNotification(container);
  }, duration);

  // Handle close button click
  notification.querySelector('button')?.addEventListener('click', () => {
    hideNotification(container);
  });
};

const getBackgroundColor = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    case 'info':
      return 'bg-blue-500';
    case 'warning':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const hideNotification = (container: HTMLDivElement) => {
  container.classList.add('translate-x-4', 'opacity-0');
  setTimeout(() => {
    container.remove();
  }, 300);
};

export { createNotification };
