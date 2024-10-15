<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSignupStore } from '@/stores/signupStore';
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@steveyuowo/vue-hot-toast';
import { requestForToken } from '@/firebase';
import axiosInstance from '@/api/instance';

// Vue Router와 Store 인스턴스 생성
const router = useRouter();
const route = useRoute();
const signupStore = useSignupStore();

// 스토어에서 은행 이름을 가져오고, 라우트 쿼리에서 은행 이미지 URL을 가져옵니다.
const bankName = computed(() => signupStore.patientInfo.bankNm);
const bankImg = computed(() => route.query.bankImg as string);

// 폼 입력값 및 약관 동의 상태
const accountNumber = ref('');
const accountPassword = ref('');
const allTermsChecked = ref(false);
const serviceTerms = ref(false);
const privacyTerms = ref(false);
const medicalInfoTerms = ref(false);
const ePrescriptionTerms = ref(false);
const sensitiveInfoTerms = ref(false);
const notificationTerms = ref(false);

// FCM 토큰 상태
const fcmToken = ref<string | null>(null);
const isTokenLoading = ref(false);

// 폼 유효성 검사
const isFormValid = computed(
  () =>
    accountNumber.value !== '' &&
    accountPassword.value.length === 4 &&
    serviceTerms.value &&
    privacyTerms.value &&
    medicalInfoTerms.value &&
    ePrescriptionTerms.value &&
    sensitiveInfoTerms.value &&
    notificationTerms.value &&
    fcmToken.value !== null
);

// 모든 약관 동의 체크박스 핸들러
const handleAllTermsChange = async (checked: boolean) => {
  allTermsChecked.value = checked;
  serviceTerms.value = checked;
  privacyTerms.value = checked;
  medicalInfoTerms.value = checked;
  ePrescriptionTerms.value = checked;
  sensitiveInfoTerms.value = checked;
  notificationTerms.value = checked;

  if (checked) {
    await getAndSendFirebaseToken();
  }
};

// 개별 약관 동의 체크박스 핸들러
const handleIndividualTermChange = async (termName: string, checked: boolean) => {
  if (termName === 'notification' && checked) {
    await getAndSendFirebaseToken();
  }

  // 각 약관 상태 업데이트
  switch (termName) {
    case 'service':
      serviceTerms.value = checked;
      break;
    case 'privacy':
      privacyTerms.value = checked;
      break;
    case 'medicalInfo':
      medicalInfoTerms.value = checked;
      break;
    case 'ePrescription':
      ePrescriptionTerms.value = checked;
      break;
    case 'sensitiveInfo':
      sensitiveInfoTerms.value = checked;
      break;
    case 'notification':
      notificationTerms.value = checked;
      break;
  }

  allTermsChecked.value =
    serviceTerms.value &&
    privacyTerms.value &&
    medicalInfoTerms.value &&
    ePrescriptionTerms.value &&
    sensitiveInfoTerms.value &&
    notificationTerms.value;
};

// 계좌 비밀번호 입력 핸들러
const handlePasswordInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '').slice(0, 4);
  accountPassword.value = input.value;
};

// Firebase 토큰 요청 및 서버로 전송하는 함수
const getAndSendFirebaseToken = async () => {
  isTokenLoading.value = true;
  try {
    const token = await requestForToken();
    if (token) {
      fcmToken.value = token;
      //await axiosInstance.post('/api/save-firebase-token', { token });
      //localStorage.setItem('fcm', fcmToken.value);
      console.log('Firebase 토큰이 서버로 전송되었습니다.');
      toast.success('알림 수신 동의가 완료되었습니다.');
    } else {
      throw new Error('알림 권한을 허용해주세요.');
    }
  } catch (error) {
    console.error('Firebase 토큰 처리 중 오류:', error);
    toast.error('알림 설정 중 오류가 발생했습니다. 다시 시도해주세요.');
    notificationTerms.value = false;
  } finally {
    isTokenLoading.value = false;
  }
};

// '다음' 버튼 클릭 핸들러
const handleNextClick = async () => {
  if (isFormValid.value) {
    try {
      signupStore.setUserInfo({
        patientInfo: {
          bankNm: bankName.value,
          accountNo: accountNumber.value,
          accountPw: accountPassword.value,
          fcmNo: fcmToken.value
        },
        terms: {
          service: serviceTerms.value,
          privacy: privacyTerms.value,
          medicalInfo: medicalInfoTerms.value,
          ePrescription: ePrescriptionTerms.value,
          sensitiveInfo: sensitiveInfoTerms.value,
          notification: notificationTerms.value
        }
      });

      const { success } = await signupStore.submitSignup();
      if (success) {
        router.push('/success');
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류가 발생했습니다:', error);
      toast.error('회원가입 처리 중 오류가 발생했습니다.');
    }
  }
};
</script>

<template>
  <HeadBar :back-button="true">회원가입</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="false">
    <div class="bank-name">
      <img :src="bankImg" class="bank-icon" />
      <div>{{ bankName }}</div>
    </div>

    <div class="bank-container">
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

      <div class="terms-container">
        <div class="flex items-center space-x-2">
          <Checkbox
            id="all-terms"
            v-model:checked="allTermsChecked"
            @update:checked="handleAllTermsChange"
          />
          <label for="all-terms" class="text-sm font-medium leading-none">
            <div class="term-info">전체 이용 약관 동의</div>
          </label>
        </div>
        <div class="divider"></div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="service-terms"
            v-model:checked="serviceTerms"
            @update:checked="(checked) => handleIndividualTermChange('service', checked)"
          />
          <label for="service-terms" class="text-sm font-medium leading-none">
            <div class="term-info">[필수] 서비스 이용 약관</div>
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="privacy-terms"
            v-model:checked="privacyTerms"
            @update:checked="(checked) => handleIndividualTermChange('privacy', checked)"
          />
          <label for="privacy-terms" class="text-sm font-medium leading-none">
            <div class="term-info">[필수] 개인정보 수집 및 이용 동의</div>
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="medical-info-terms"
            v-model:checked="medicalInfoTerms"
            @update:checked="(checked) => handleIndividualTermChange('medicalInfo', checked)"
          />
          <label for="medical-info-terms" class="text-sm font-medium leading-none">
            <div class="term-info">[필수] 의료정보 처리 동의</div>
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="e-prescription-terms"
            v-model:checked="ePrescriptionTerms"
            @update:checked="(checked) => handleIndividualTermChange('ePrescription', checked)"
          />
          <label for="e-prescription-terms" class="text-sm font-medium leading-none">
            <div class="term-info">[필수] 전자처방전 이용 동의</div>
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="sensitive-info-terms"
            v-model:checked="sensitiveInfoTerms"
            @update:checked="(checked) => handleIndividualTermChange('sensitiveInfo', checked)"
          />
          <label for="sensitive-info-terms" class="text-sm font-medium leading-none">
            <div class="term-info">[필수] 민감정보 처리 동의</div>
          </label>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox
            id="notification-terms"
            v-model:checked="notificationTerms"
            @update:checked="(checked) => handleIndividualTermChange('notification', checked)"
            :disabled="isTokenLoading"
          />
          <label for="notification-terms" class="text-sm font-medium leading-none">
            <div class="term-info">
              [필수] 알림 수신 동의
              <span v-if="isTokenLoading"> (처리 중...)</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="next-button">
      <Button size="lg" variant="default" :disabled="!isFormValid" @click="handleNextClick">
        다음
      </Button>
    </div>
  </Main>
</template>

<style scoped>
.bank-name {
  display: flex;
  justify-content: left;
  align-items: end;
  font-size: 28px;
  font-weight: 600;
  margin-top: 60px;
  margin-bottom: 40px;
  margin-left: 20px;
  gap: 16px;
}

.bank-icon {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  border: 1px solid var(--gray);
}

.bank-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  margin-left: 20px;
  margin-right: 20px;
}

.bank-info-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 40px;
}

.terms-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.term-info {
  font-weight: 600;
  font-size: 14px;
}

.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 8px 0;
}

.next-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  padding: 10px 0;
}
</style>
