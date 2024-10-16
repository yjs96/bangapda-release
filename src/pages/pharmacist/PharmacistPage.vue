<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadBar from '@/components/HeadBar.vue';
import Main from '@/components/Main.vue';
import ShadowBox from '@/components/ShadowBox.vue';
import Button from '@/components/ui/button/Button.vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { QrcodeStream } from 'vue-qrcode-reader';
import axiosInstance from '@/api/instance';
import { toast } from '@steveyuowo/vue-hot-toast';
import moment from 'moment';

// QR 코드 데이터의 타입을 정의합니다.
interface QRData {
  userId: string;
  prescriptionId: string;
  hello: string;
}

interface Prescription {
  prescriptionPk: number;
  prescriptionNo: number;
  duration: number;
  maxDate: number;
  description: string;
  prescriptionSt: boolean;
  hospitalNm: string;
  hospitalSi: string;
  hospitalGu: string;
  hospitalDong: string;
  hospitalDetailAddress: string | null;
  pharmacyNm: string;
  diseaseList: Disease[];
  createYmd: string;
}

interface Disease {
  diseasePk: number;
  diseaseCd: string;
  diseaseNm: string;
}

// Vue Router를 사용하기 위한 설정
const router = useRouter();

// 다이얼로그 상태를 관리하는 ref
const isDialogOpen = ref(false);

// 최근 처방전 목록을 저장하는 ref
const recentPrescriptions = ref<Prescription[]>([
  {
    prescriptionPk: 26,
    prescriptionNo: 10,
    duration: 3,
    maxDate: 1,
    description: '식이요법에 주의하세요 1형 당뇨 환자입니다',
    prescriptionSt: true,
    hospitalNm: '그대의봄여성의원2',
    hospitalSi: '경기도',
    hospitalGu: '과천시',
    hospitalDong: '과천동',
    hospitalDetailAddress: null,
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 2054,
        diseaseCd: 'E10',
        diseaseNm: '1형 당뇨병'
      }
    ],
    createYmd: '2024-10-15T19:19:44'
  },
  {
    prescriptionPk: 25,
    prescriptionNo: 9,
    duration: 3,
    maxDate: 1,
    description: '당뇨병임',
    prescriptionSt: true,
    hospitalNm: '그대의봄여성의원2',
    hospitalSi: '경기도',
    hospitalGu: '과천시',
    hospitalDong: '과천동',
    hospitalDetailAddress: null,
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 2054,
        diseaseCd: 'E10',
        diseaseNm: '1형 당뇨병'
      }
    ],
    createYmd: '2024-10-15T19:15:34'
  },
  {
    prescriptionPk: 24,
    prescriptionNo: 8,
    duration: 3,
    maxDate: 4,
    description: '대체 조제 불가',
    prescriptionSt: true,
    hospitalNm: '청구경희한의원 건대',
    hospitalSi: '서울특별시',
    hospitalGu: '광진구',
    hospitalDong: '화양동',
    hospitalDetailAddress: '111-47',
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 73,
        diseaseCd: 'A15.1',
        diseaseNm: '배양만으로 확인된 폐결핵'
      }
    ],
    createYmd: '2024-10-15T16:07:40'
  },
  {
    prescriptionPk: 23,
    prescriptionNo: 7,
    duration: 3,
    maxDate: 3,
    description: '대체 조제 불가',
    prescriptionSt: true,
    hospitalNm: '청구경희한의원 건대',
    hospitalSi: '서울특별시',
    hospitalGu: '광진구',
    hospitalDong: '화양동',
    hospitalDetailAddress: '111-47',
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 2056,
        diseaseCd: 'E10.1',
        diseaseNm: '산증을 동반한 1형 당뇨병'
      }
    ],
    createYmd: '2024-10-15T16:04:23'
  },
  {
    prescriptionPk: 21,
    prescriptionNo: 5,
    duration: 3,
    maxDate: 0,
    description: '대체 조제 불가',
    prescriptionSt: true,
    hospitalNm: '청구경희한의원 건대',
    hospitalSi: '서울특별시',
    hospitalGu: '광진구',
    hospitalDong: '화양동',
    hospitalDetailAddress: '111-47',
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 2056,
        diseaseCd: 'E10.1',
        diseaseNm: '산증을 동반한 1형 당뇨병'
      }
    ],
    createYmd: '2024-10-15T13:00:46'
  },
  {
    prescriptionPk: 20,
    prescriptionNo: 4,
    duration: 3,
    maxDate: 3,
    description: '대체 조제 불가',
    prescriptionSt: true,
    hospitalNm: '청구경희한의원 건대',
    hospitalSi: '서울특별시',
    hospitalGu: '광진구',
    hospitalDong: '화양동',
    hospitalDetailAddress: '111-47',
    pharmacyNm: '김성헌 약국',
    diseaseList: [
      {
        diseasePk: 4,
        diseaseCd: 'A00.9',
        diseaseNm: '상세불명의 콜레라'
      }
    ],
    createYmd: '2024-10-15T12:50:01'
  }
]);

// QR 코드가 감지되었을 때 실행되는 함수
async function onDetect(detectedCodes: Array<{ rawValue: string }>) {
  const qrDataString = detectedCodes[0]?.rawValue;
  console.log(qrDataString);
  const qrData = JSON.parse(qrDataString);
  console.log(qrData);
  let isValid = false;
  if (qrData) {
    try {
      if (qrData.hello === 'weBangapda') {
        isValid = await validateQRInfo(qrData);
      }
      if (isValid) {
        isDialogOpen.value = false;
        router.push(`/pharmacist/${qrData.prescriptionId}`);
      } else {
        toast.error('잘못된 QR 코드입니다.');
      }
    } catch (err) {
      toast.error('QR 코드 처리 중 오류가 발생했습니다.');
    }
  } else {
    toast.error('QR 코드를 읽을 수 없습니다.');
  }
}

// QR 코드 스캔 중 오류가 발생했을 때 실행되는 함수
function onError(err: Error) {
  toast.error(`QR 스캔 오류: ${err.message}`);
}

// QR 정보 유효성 검사 함수 (실제 구현 필요)
async function validateQRInfo(qrData: QRData) {
  if (qrData.prescriptionId && qrData.userId) return true;
  return false;
}

// 최근 처방전 목록을 가져오는 함수
const fetchRecentPrescriptions = async () => {
  try {
    const response = await axiosInstance.get('/api/pharmacy/list?pageIndex=0&pageSize=10');
    // console.log(response.data.data.prescriptionList);
    recentPrescriptions.value = response.data.data.prescriptionList;
    // recentPrescriptions.value = response.data.map((prescription) => ({
    //   id: prescription.prescriptionId,
    //   name: prescription.patientName,
    //   date: formatDate(prescription.createdAt),
    //   status: prescription.status
    // }));
  } catch (err) {
    console.error('최근 처방전 목록을 가져오는 데 실패했습니다:', err);
  }
};

// 날짜 형식을 변환하는 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear().toString().slice(2)}. ${(date.getMonth() + 1).toString().padStart(2, '0')}. ${date.getDate().toString().padStart(2, '0')} | ${date.getHours() >= 12 ? '오후' : '오전'} ${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// 컴포넌트가 마운트될 때 최근 처방전 목록을 가져옵니다.
onMounted(() => {
  fetchRecentPrescriptions();
});
</script>

<template>
  <HeadBar :back-button="false">약사 페이지</HeadBar>
  <Main :headbar="true" :navbar="false" :padded="true" :bg-gray="true">
    <div class="pharmacist-container">
      <Dialog v-model:open="isDialogOpen">
        <DialogTrigger asChild>
          <Button class="qr-camera">
            <div class="qr-icon-container">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <div class="qr-text">
              <span class="qr-title">처방전 불러오기</span>
              <span class="qr-subtitle">QR 코드를 스캔하세요</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR 코드 스캔</DialogTitle>
          </DialogHeader>
          <QrcodeStream @detect="onDetect" @error="onError" />
        </DialogContent>
      </Dialog>

      <ShadowBox :padding-x="20" :padding-y="20" :margin-bottom="0">
        <div class="recent-list-title">
          <div>최근 처방전 내역</div>
        </div>
        <div class="divider"></div>
        <div class="recent-list">
          <div
            v-for="prescription in recentPrescriptions"
            :key="prescription.prescriptionPk"
            class="recent-item"
            @click="$router.push(`/pharmacist/${prescription.prescriptionPk}`)"
          >
            <div class="recent-info">
              <div class="recent-group">
                <div class="recent-name">{{ prescription.prescriptionPk }} 환자님</div>
              </div>
              <div class="recent-date">
                <i class="fa-regular fa-calendar"></i
                >{{ moment(prescription.createYmd).format('YY년 MM월 DD일 HH:MM') }}
              </div>
            </div>
            <div class="recent-status">
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </ShadowBox>
    </div>
  </Main>
</template>

<style scoped>
.pharmacist-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}

.qr-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  height: 140px;
  background: var(--css-primary);
  border-radius: 12px;
  margin-bottom: 20px;
}

.qr-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: var(--css-secondary);
  border-radius: 50%;
  margin-bottom: 20px;
}

.qr-icon-container i {
  font-size: 24px;
  color: var(--black);
}

.qr-text {
  display: flex;
  flex-direction: column;
  color: var(--black);
}

.qr-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.qr-subtitle {
  font-size: 14px;
  opacity: 0.8;
}

.error-message {
  color: #ff4b4b;
  margin-top: 10px;
}

.recent-list-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 18px;
}

.divider {
  height: 1px;
  background-color: var(--dark-gray);
  margin-bottom: 16px;
}

.recent-list {
  display: flex;
  flex-direction: column;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding: 0 4px;
}

.recent-item:last-child {
  margin-bottom: 0;
}

.recent-info {
  display: flex;
  flex-direction: column;
}

.recent-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-name {
  font-size: 20px;
  font-weight: 600;
}

.recent-date {
  font-size: 14px;
  color: var(--dark-gray);
  margin-top: 4px;
}

.recent-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.status-text {
  font-size: 14px;
  color: var(--kb-yellow);
}

.fa-calendar {
  margin-right: 6px;
}
</style>
