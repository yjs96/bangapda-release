import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      if (currentToken) {
        console.log('FCM 토큰:', currentToken);
        // 여기서 토큰을 서버로 전송하는 로직을 추가할 수 있습니다.
        return currentToken;
      } else {
        console.log('토큰을 가져올 수 없습니다.');
        return null;
      }
    } else {
      console.log('알림 권한이 거부되었습니다.');
      return null;
    }
  } catch (err) {
    console.error('토큰 검색 중 오류 발생:', err);
    return null;
  }
};

export const onMessageListener = (): Promise<any> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('포그라운드 메시지 수신:', payload);
      resolve(payload);
    });
  });

export { app, messaging };
