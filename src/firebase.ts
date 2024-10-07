import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from '@steveyuowo/vue-hot-toast';

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

// @ts-ignore
export const requestForToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        'BAzxo4c606TtwGazLvAX_S28ayIHUEe9CvLAR86AVxYL56Xggaf0_GrldmLaNsInBPyir-U-mHreSkMJTPw2jk8'
    });
    if (currentToken) {
      alert(`발급 성공 : ${currentToken}`);
      console.log('current token for client: ', currentToken);
      // 여기서 토큰을 서버로 전송하는 로직을 추가할 수 있습니다.
      return currentToken;
    } else {
      alert('발급 실패');
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.error('토큰 검색 중 오류 발생:', err);
    return null;
  }
};

// 포그라운드 메시지 처리
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);

      if (document.visibilityState === 'visible') {
        const notificationTitle = payload.notification?.title || '제목없음';
        const notificationOptions = {
          body: payload.notification?.body
        };

        // 알림 표시
        new Notification(notificationTitle, notificationOptions);
        // @ts-ignore
        toast.success(notificationOptions?.body);
      }

      resolve(payload);
    });
  });

export { app, messaging };
