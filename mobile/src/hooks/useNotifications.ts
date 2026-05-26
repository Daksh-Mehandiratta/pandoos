import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications(
  onNotification?: (notification: Notifications.Notification) => void
) {
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener> | null>(null);
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  const registerForPushNotifications = async (): Promise<string | null> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permission not granted');
      return null;
    }

    // Android needs explicit notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('pandoos-default', {
        name: 'Pandoos Music',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1ED760', // Bamboo green
      });
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (e) {
      console.warn('[Notifications] Firebase not configured for push tokens:', e);
      return null;
    }
  };

  useEffect(() => {
    registerForPushNotifications();

    if (onNotification) {
      notificationListener.current = Notifications.addNotificationReceivedListener(onNotification);
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[Notifications] User tapped:', response.notification.request.content);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const sendLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
  };

  return { sendLocalNotification };
}
