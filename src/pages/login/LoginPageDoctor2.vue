<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupStore } from '@/stores/signupStore';
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@steveyuowo/vue-hot-toast';

// Vue Router와 Signup 스토어 인스턴스를 생성합니다.
const router = useRouter();
const signupStore = useSignupStore();

// 입력 필드를 위한 반응형 변수들을 생성합니다.
const licenseNumber = ref('');
const isLicenseVerified = ref(false);
const representativeName = ref('');
const hospitalPhone = ref('');

// 면허 번호를 확인하는 함수를 정의합니다.
const verifyLicense = async () => {
  if (licenseNumber.value.trim() !== '') {
    // 실제 구현에서는 서버에 확인 요청을 보내야 합니다.
    isLicenseVerified.value = true;
  }
};

// 폼의 유효성을 검사하는 computed 속성을 정의합니다.
const isFormValid = computed(() => {
  return isLicenseVerified.value && type.value.trim() !== '' && hospitalPhone.value.trim() !== '';
});

// '다음' 버튼 클릭 핸들러를 정의합니다.
const handleNextButtonClick = async () => {
  if (isFormValid.value) {
    signupStore.setUserInfo({
      doctorInfo: {
        doctorNo: licenseNumber.value,
        representativeName: representativeName.value,
        hospitalPhoneNo: hospitalPhone.value,
        tp: type.value
      }
    });

    try {
      const { success, nextRoute } = await signupStore.submitSignup();
      if (success) {
        router.push('/success');
      } else {
        toast.error('회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('회원가입 처리 중 오류가 발생했습니다:', error);
      toast.error('회원가입 처리 중 오류가 발생했습니다.');
    }
  } else {
    toast.error('모든 필드를 올바르게 입력해주세요.');
  }
};

const type = ref('');

onMounted(() => {});
</script>

<template>
  <HeadBar :back-button="true">회원가입</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="false">
    <div class="login-doctor">의사 정보를 <br />입력해주세요</div>

    <div class="doctor-container">
      <div class="input-group">
        <Label for="doctor-license">면허 번호</Label>
        <div class="license-container">
          <Input
            type="text"
            inputmode="numeric"
            id="doctor-license"
            v-model="licenseNumber"
            placeholder="면허 번호 입력하세요"
            maxlength="6"
          ></Input>
          <Button @click="verifyLicense" :disabled="isLicenseVerified">등록하기</Button>
          <CheckCircle2 v-if="isLicenseVerified" class="text-yellow-500" />
        </div>
      </div>

      <div class="input-group">
        <!-- <Label for="doctor-representative">대표 원장 성명</Label>
        <Input
          type="text"
          id="doctor-representative"
          v-model="representativeName"
          placeholder="대표 원장 성명 입력"
        ></Input> -->
        <Label for="license-type">면허 종별</Label>
        <Select v-model="type">
          <SelectTrigger>
            <SelectValue placeholder="면허 종별" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="GENERAL_PRACTITIONER">일반의</SelectItem>
              <SelectItem value="INTERNIST">내과 의사</SelectItem>
              <SelectItem value="SURGEON">외과 의사</SelectItem>
              <SelectItem value="PEDIATRICIAN">소아과 의사</SelectItem>
              <SelectItem value="GYNECOLOGIST">산부인과 의사</SelectItem>
              <SelectItem value="DERMATOLOGIST">피부과 의사</SelectItem>
              <SelectItem value="PSYCHIATRIST">정신과 의사</SelectItem>
              <SelectItem value="ORTHOPEDIC_SURGEON">정형외과 의사</SelectItem>
              <SelectItem value="RADIOLOGIST">방사선과 의사</SelectItem>
              <SelectItem value="CARDIOLOGIST">심장내과 의사</SelectItem>
              <SelectItem value="NEUROLOGIST">신경과 의사</SelectItem>
              <SelectItem value="OPHTHALMOLOGIST">안과 의사</SelectItem>
              <SelectItem value="ENT_SPECIALIST">이비인후과 의사</SelectItem>
              <SelectItem value="DENTIST">치과 의사</SelectItem>
              <SelectItem value="VETERINARIAN">수의사</SelectItem>
              <SelectItem value="PHARMACIST">약사</SelectItem>
              <SelectItem value="UNLICENSED">무면허</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="input-group">
        <Label for="hospital-tel">병원 연락처</Label>
        <Input
          type="text"
          inputmode="numeric"
          id="hospital-tel"
          v-model="hospitalPhone"
          placeholder="ex) 021234567"
          maxlength="11"
        ></Input>
      </div>
    </div>

    <div class="next-button">
      <Button size="lg" variant="default" :disabled="!isFormValid" @click="handleNextButtonClick">
        다음
      </Button>
    </div>
  </Main>
</template>

<style scoped>
.login-doctor {
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 60px;
  margin-left: 20px;
}

.doctor-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  margin-left: 20px;
  margin-right: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
}

.input-group label {
  margin-bottom: 8px;
}

.license-container {
  display: flex;
  align-items: center;
  gap: 8px;
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
