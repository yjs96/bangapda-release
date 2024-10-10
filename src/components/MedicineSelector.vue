<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/api/instance';  // axios 인스턴스 가져오기

interface Medicine {
  medicinePk: number;
  medicineNm: string;
}

const medicines = ref<Medicine[]>([]);  // 약 리스트 저장
const selectedMedicinePk = ref('');  // 선택된 약의 PK 값

// 백엔드에서 약 리스트를 가져오는 함수
const fetchMedicines = async () => {
  try {
    const response = await axiosInstance.get('/api/medi/list');  // 실제 API 경로
    medicines.value = response.data.data.medicineList;  // 약 리스트를 받아옴
  } catch (error) {
    console.error('Error fetching medicines:', error);  // 오류 처리
  }
};

// 컴포넌트가 마운트될 때 약 리스트를 가져옴
onMounted(() => {
  fetchMedicines();
});

// 약 선택 시 내부 상태로 관리
const handleMedicineSelect = (medicinePk: string) => {
  const selectedMedicine = medicines.value.find(m => m.medicinePk.toString() === medicinePk);
  if (selectedMedicine) {
    console.log('선택된 약 정보:', selectedMedicine);  // 콘솔에서 확인
    selectedMedicinePk.value = selectedMedicine.medicinePk.toString();  // 선택된 약의 PK 저장
  } else {
    console.log('약 선택 실패');
  }
};
</script>

<template>
  <Select @change="handleMedicineSelect($event.target.value)">
    <SelectTrigger>
      <!-- 선택된 약의 이름을 표시하거나 placeholder를 보여줌 -->
      <SelectValue :placeholder="selectedMedicinePk ? medicines.find(m => m.medicinePk.toString() === selectedMedicinePk)?.medicineNm : '약 이름을 선택하세요'" />
    </SelectTrigger>
    <SelectContent>
      <!-- 약 리스트에서 선택 가능하게 표시 -->
      <SelectItem
        v-for="(medicine) in medicines"
        :key="medicine.medicinePk"
        :value="medicine.medicinePk.toString()"
      >
        {{ medicine.medicineNm }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
