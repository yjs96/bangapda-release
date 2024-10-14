<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupStore } from '@/stores/signupStore';
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@steveyuowo/vue-hot-toast';
import axiosInstance from '@/api/instance';

interface gu {
  gu_nm: string;
  gu_pk: number;
  gu_si_fk: number;
}

interface dong {
  dong_nm: string;
  dong_pk: number;
  dong_gu_fk: number;
}

// Vue Router와 Signup 스토어 인스턴스를 생성합니다.
const router = useRouter();
const signupStore = useSignupStore();

// 폼 입력값을 위한 반응형 변수들을 생성합니다.
const pharmacyName = ref('');
const city = ref('');
const district = ref('');
const neighborhood = ref('');
const detailAddress = ref('');

// 폼의 유효성을 검사하는 computed 속성을 정의합니다.
const isFormValid = computed(
  () =>
    pharmacyName.value.trim() !== '' &&
    city.value !== '' &&
    district.value !== '' &&
    neighborhood.value !== '' &&
    detailAddress.value.trim() !== ''
);

// '다음' 버튼 클릭 핸들러를 정의합니다.
const handleNextButtonClick = async () => {
  if (isFormValid.value) {
    signupStore.setUserInfo({
      pharmacistInfo: {
        pharmacyNm: pharmacyName.value,
        pharmacyAddress: {
          city: city.value,
          district: district.value,
          neighborhood: neighborhood.value,
          detail: detailAddress.value
        },
        pharmacyDong: neighborhood.value,
        pharmacyDetailAddress: detailAddress.value
      }
    });

    try {
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
  } else {
    toast.error('모든 필드를 올바르게 입력해주세요.');
  }
};

const guList = ref<gu[]>([]);

const getGuBySi = async (si: string) => {
  try {
    const response = await axiosInstance.get(`/api/address/get/gu/${si}`);
    guList.value = response.data.data.sort((a: gu, b: gu) => a.gu_nm.localeCompare(b.gu_nm));
  } catch (err) {
    console.error(err);
    toast.error('구 정보를 가져오는데 실패했습니다.');
  }
};

const dongList = ref<dong[]>([]);

const getDongByGu = async (gu: string) => {
  try {
    const response = await axiosInstance.get(`/api/address/get/dong/${gu}`);
    dongList.value = response.data.data.sort((a: dong, b: dong) =>
      a.dong_nm.localeCompare(b.dong_nm)
    );
  } catch (err) {
    console.error(err);
    toast.error('동 정보를 가져오는데 실패했습니다.');
  }
};
</script>

<template>
  <HeadBar :back-button="true">회원가입</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="false">
    <div class="login-pharmacist">약사 정보를 <br />입력해주세요</div>

    <div class="pharmacist-container">
      <div class="input-group">
        <Label for="pharmacy-name">약국명</Label>
        <Input
          type="text"
          id="pharmacy-name"
          v-model="pharmacyName"
          placeholder="약국명을 입력해주세요"
        />
      </div>

      <div class="input-group">
        <Label>약국 주소</Label>
        <div class="pharmacy-container">
          <Select v-model="city" @update:modelValue="getGuBySi">
            <SelectTrigger class="w-[120px]">
              <SelectValue placeholder="시" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="서울특별시"> 서울특별시 </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select v-model="district" @update:modelValue="getDongByGu">
            <SelectTrigger class="w-[90px]">
              <SelectValue placeholder="구" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="gu in guList" :key="gu.gu_pk" :value="gu.gu_nm">
                  {{ gu.gu_nm }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select v-model="neighborhood">
            <SelectTrigger class="w-[90px]">
              <SelectValue placeholder="동" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="dong in dongList" :key="dong.dong_pk" :value="dong.dong_nm">
                  {{ dong.dong_nm }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input
          type="text"
          id="pharmacist-address"
          v-model="detailAddress"
          placeholder="(상세주소)"
        />
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
.login-pharmacist {
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 60px;
  margin-left: 20px;
}

.pharmacist-container {
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
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  padding: 10px 0;
}
</style>
