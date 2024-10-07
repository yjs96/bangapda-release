<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isSupported } from 'firebase/messaging';
import { app as firebaseApp, requestForToken, onMessageListener } from '@/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeadBar from '@/components/HeadBar.vue';
import NavBar from '@/components/NavBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
import NotificationConsent from '@/components/NotificationConsent.vue';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import Button from '@/components/ui/button/Button.vue';
import TimeSelector from '@/components/TimeSelector.vue';
import { useMealTimeStore } from '@/stores/mealtime';
import axiosInstance from '@/api/instance';

const banks = [
  { name: '국민은행', img: '/images/banks/kb-bank.png' },
  { name: '신한은행', img: '/images/banks/shinhan-bank.png' },
  { name: '하나은행', img: '/images/banks/hana-bank.png' },
  { name: '농협은행', img: '/images/banks/nh-bank.png' },
  { name: '우리은행', img: '/images/banks/woori-bank.png' },
  { name: '기업은행', img: '/images/banks/ibk-bank.png' }
];

const selectedBank = ref<{ name: string; img: string } | null>(null);
const router = useRouter();

const selectBank = (bank: { name: string; img: string }) => {
  selectedBank.value = bank;
};

const accountNumber = ref('');
const accountPassword = ref('');

const isFormValid = computed(() => {
  return (
    selectedBank.value !== null &&
    accountNumber.value.trim() !== '' &&
    accountPassword.value.length === 4
  );
});

const handlePasswordInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '').slice(0, 4);
  accountPassword.value = input.value;
};

const mealTimeStore = useMealTimeStore();

const breakfastTime = ref(mealTimeStore.breakfast);
const lunchTime = ref(mealTimeStore.lunch);
const dinnerTime = ref(mealTimeStore.dinner);

const fcmToken = ref<string | null>(null);

const updateMealTimes = () => {
  mealTimeStore.updateAllMealTimes({
    breakfast: breakfastTime.value,
    lunch: lunchTime.value,
    dinner: dinnerTime.value
  });
};

const requestNotificationPermission = async () => {
  try {
    const isFirebaseMessagingSupported = await isSupported();
    if (!isFirebaseMessagingSupported) {
      console.log('이 브라우저는 Firebase 클라우드 메시징을 지원하지 않습니다.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await requestForToken();
      if (token) {
        fcmToken.value = token;
        const patchToken = {
          fcmNo: token
        };
        try {
          const response = await axiosInstance.patch('api/fcm/save/token?userId=1', patchToken);
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      }
    } else if (permission === 'denied') {
      console.log('알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
    } else {
      console.log('알림 권한 요청에 대한 응답을 받지 못했습니다.');
    }
  } catch (error) {
    console.error('알림 권한을 얻는데 실패했습니다:', error);
  }
};

const updateAccount = () => {
  if (isFormValid.value) {
    console.log('계좌가 업데이트되었습니다:', {
      bank: selectedBank.value,
      accountNumber: accountNumber.value,
      accountPassword: accountPassword.value
    });
    // 여기에 실제 계좌 업데이트 로직을 구현하세요
  }
};
</script>

<template>
  <HeadBar :bg-gray="true">마이페이지</HeadBar>
  <NavBar />
  <Main :headbar="true" :navbar="true" :bg-gray="true">
    <ShadowBox :padding-x="24" :padding-y="20" :radius="false">
      <div class="settings-title">내 계좌 정보</div>
      <div class="settings-frame">
        <div class="settings-row">
          <div class="settings-key">은행명</div>
          <div class="settings-value">국민은행</div>
        </div>
        <div class="settings-row">
          <div class="settings-key">계좌번호</div>
          <div class="settings-value">123-456-7890</div>
        </div>
        <Dialog>
          <DialogTrigger>
            <div class="settings-row">
              <div class="settings-key">계좌 수정</div>
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </DialogTrigger>
          <DialogContent>
            <div class="dialog-title">계좌 선택</div>
            <div class="bank-container">
              <div
                v-for="bank in banks"
                :key="bank.name"
                class="bank-list"
                :class="{ selected: selectedBank?.name === bank.name }"
                @click="selectBank(bank)"
              >
                <img :src="bank.img" class="bank-icon" alt="bank logo" />
                {{ bank.name }}
              </div>
            </div>
            <div>
              <div class="bank-info-container">
                <Label for="bank-id-input">계좌 번호</Label>
                <Input
                  type="text"
                  inputmode="numeric"
                  id="bank-id-input"
                  v-model="accountNumber"
                  placeholder="계좌번호를 입력해주세요."
                />
              </div>
              <div class="bank-info-container">
                <Label for="bank-password-input">계좌 비밀번호</Label>
                <Input
                  type="password"
                  inputmode="numeric"
                  id="bank-password-input"
                  v-model="accountPassword"
                  @input="handlePasswordInput"
                  placeholder="(4자리)"
                  maxlength="4"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button size="lg" @click="updateAccount" :disabled="!isFormValid">계좌 변경</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ShadowBox>
    <ShadowBox :padding-x="24" :padding-y="20" :radius="false">
      <div class="settings-title">복약 알림 설정</div>
      <div class="settings-frame">
        <div class="settings-row">
          <div class="settings-key">아침</div>
          <div class="settings-value">{{ mealTimeStore.breakfast }}</div>
        </div>
        <div class="settings-row">
          <div class="settings-key">점심</div>
          <div class="settings-value">{{ mealTimeStore.lunch }}</div>
        </div>
        <div class="settings-row">
          <div class="settings-key">저녁</div>
          <div class="settings-value">{{ mealTimeStore.dinner }}</div>
        </div>
        <Dialog>
          <DialogTrigger>
            <div class="settings-row">
              <div class="settings-key">복약 시간 수정</div>
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </DialogTrigger>
          <DialogContent>
            <TimeSelector title="아침" v-model="breakfastTime" />
            <TimeSelector title="점심" v-model="lunchTime" />
            <TimeSelector title="저녁" v-model="dinnerTime" />
            <DialogFooter class="modal-footer">
              <DialogClose>
                <Button size="lg" @click="updateMealTimes">저장</Button>
              </DialogClose>
              <DialogClose>
                <Button variant="destructive" size="lg">닫기</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ShadowBox>
    <ShadowBox :padding-x="24" :padding-y="20" :radius="false">
      <div class="settings-title">알림 설정</div>
      <div class="settings-frame">
        <div class="settings-row">
          <div class="settings-key">알림 수신 동의</div>
          <NotificationConsent />
        </div>
      </div>
    </ShadowBox>
    <ShadowBox :padding-x="24" :padding-y="20" :radius="false">
      <div class="settings-frame">
        <div class="settings-row">
          <div class="settings-key logout">로그아웃</div>
        </div>
        <div class="settings-row">
          <div class="settings-key">회원탈퇴</div>
        </div>
      </div>
    </ShadowBox>
  </Main>
</template>

<style scoped>
.settings-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 32px;
}

.settings-frame {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-key {
  font-size: 18px;
  font-weight: 600;
}

.settings-value {
  font-size: 16px;
  color: var(--dark-gray);
}

.logout {
  color: var(--red);
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.bank-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.bank-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8%;
  border: 1px solid var(--gray);
  width: 30%;
  height: 96px;
  gap: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.bank-list.selected {
  background-color: hsl(var(--primary));
  border-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  opacity: 1;
}

.bank-list:hover {
  opacity: 1;
}

.bank-icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.bank-info-container {
  margin-bottom: 16px;
}

.bank-info-container label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}
</style>
