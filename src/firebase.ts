import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyA4Ipq20llNkJEnfgEYYsnbZvudVU-jO0c',
  authDomain: 'kbank-frontend.firebaseapp.com',
  projectId: 'kbank-frontend',
  storageBucket: 'kbank-frontend.appspot.com',
  messagingSenderId: '880064059458',
  appId: '1:880064059458:web:91a9f51ed525673e6235db',
  measurementId: 'G-KL6RDGQ3VD'
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey:
          'BAzxo4c606TtwGazLvAX_S28ayIHUEe9CvLAR86AVxYL56Xggaf0_GrldmLaNsInBPyir-U-mHreSkMJTPw2jk8'
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
