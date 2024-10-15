<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
const hospitalName = ref('');
const city = ref('');
const district = ref('');
const neighborhood = ref('');
const detailAddress = ref('');
const hospitalType = ref('');

// 폼의 유효성을 검사하는 computed 속성을 정의합니다.
const isFormValid = computed(() => {
  return (
    hospitalName.value.trim() !== '' &&
    city.value !== '' &&
    district.value !== '' &&
    neighborhood.value !== '' &&
    detailAddress.value.trim() !== '' &&
    hospitalType.value.trim() !== ''
  );
});

// '다음' 버튼 클릭 핸들러를 정의합니다.
const handleNextButtonClick = () => {
  if (isFormValid.value) {
    // 입력된 병원 정보를 Pinia 스토어에 저장합니다.
    signupStore.setUserInfo({
      doctorInfo: {
        hospitalNm: hospitalName.value,
        hospitalAddress: {
          city: city.value,
          district: district.value,
          neighborhood: neighborhood.value,
          detail: detailAddress.value
        },
        hospitalDong: neighborhood.value,
        hospitalDetailAdress: detailAddress.value,
        hospitalType: hospitalType.value
      }
    });
    // 다음 페이지(의사 면허 입력 페이지)로 이동합니다.
    router.push('/login/doctor/license');
  } else {
    console.error('폼이 유효하지 않습니다.');
    // TODO: 사용자에게 유효성 검사 실패 메시지 표시
  }
};

const guList = ref<gu[]>([]);

const getGuBySi = async (si: string) => {
  await axiosInstance
    .get(`/api/address/get/gu/${si}`)
    .then((res) => {
      guList.value = res.data.data.sort((a: any, b: any) => {
        return a.gu_nm.localeCompare(b.gu_nm);
      });
      //console.log(guList.value);
    })
    .catch((err) => {
      console.log(err);
    });
};

const dongList = ref<dong[]>([]);

const getDongByGu = async (gu: string) => {
  await axiosInstance
    .get(`/api/address/get/dong/${gu}`)
    .then((res) => {
      dongList.value = res.data.data.sort((a: any, b: any) => {
        return a.dong_nm.localeCompare(b.dong_nm);
      });
      //console.log(dongList.value);
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {});
</script>

<template>
  <HeadBar :back-button="true">회원가입</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="false">
    <div class="login-doctor">의사 정보를 <br />입력해주세요</div>

    <div class="doctor-container">
      <div class="input-group">
        <Label for="hospital-name">병원명</Label>
        <Input
          type="text"
          id="hospital-name"
          v-model="hospitalName"
          placeholder="병원명 입력"
        ></Input>
      </div>

      <div class="input-group">
        <Label>병원 주소</Label>
        <div class="hospital-container">
          <Select v-model="city" @update:modelValue="getGuBySi">
            <SelectTrigger class="w-[120px]">
              <SelectValue placeholder="시" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="서울특별시">서울특별시</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select v-model="district" @update:modelValue="getDongByGu">
            <SelectTrigger class="w-[90px]">
              <SelectValue placeholder="구" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="(gu, index) in guList" :value="gu.gu_nm" :key="index">
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
                <SelectItem v-for="(dong, index) in dongList" :value="dong.dong_nm" :key="index">
                  {{ dong.dong_nm }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Input
          type="text"
          id="hospital-address"
          v-model="detailAddress"
          placeholder="(상세주소)"
        ></Input>
      </div>

      <div class="input-group">
        <Label for="hospital-type">병원 분류</Label>
        <Input
          type="text"
          id="hospital-type"
          v-model="hospitalType"
          placeholder="병원 분류 입력"
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

.hospital-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
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
