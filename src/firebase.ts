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

export { app, messaging };

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        'BAzxo4c606TtwGazLvAX_S28ayIHUEe9CvLAR86AVxYL56Xggaf0_GrldmLaNsInBPyir-U-mHreSkMJTPw2jk8'
    });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      // 여기서 토큰을 서버로 전송하는 로직을 추가할 수 있습니다.
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

// 포그라운드 메시지 처리
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
