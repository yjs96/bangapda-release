<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import axiosInstance from '@/api/instance'; // axios 인스턴스 가져오기

interface Disease {
  diseasePk: number;
  diseaseCd: string;
}

// Props로 선택된 질병 코드를 전달 받음
const props = defineProps<{
  modelValue: string; // modelValue를 string 타입으로 설정
}>();

const emit = defineEmits(['update:modelValue']);

// 질병 코드 리스트를 저장하는 ref
const diseaseCodes = ref<Disease[]>([]);
const isOpen = ref(false);
const searchQuery = ref('');

// 선택된 질병 코드를 관리하는 computed 속성
const selectedDiseaseCode = computed({
  get: () => props.modelValue, // string 타입으로 받음
  set: (value: string) => emit('update:modelValue', value) // string 타입으로 emit
});

// 검색어에 맞춰 필터링된 질병 코드 리스트
const filteredDiseaseCodes = computed(() => {
  return diseaseCodes.value.filter((disease) =>
    disease.diseaseCd.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 백엔드에서 질병 코드 리스트를 가져오는 함수
const fetchDiseaseCodes = async () => {
  try {
    const response = await axiosInstance.get('/api/hospital/disease'); // 실제 API 엔드포인트로 변경
    diseaseCodes.value = response.data.data.diseaseList;
  } catch (error) {
    console.error('Error fetching disease codes:', error);
  }
};

// 질병 코드를 선택하는 함수
const selectDiseaseCode = (disease: Disease) => {
  selectedDiseaseCode.value = disease.diseasePk.toString();
  isOpen.value = false;
};

// 컴포넌트가 마운트될 때 질병 코드 리스트를 가져옴
onMounted(() => {
  fetchDiseaseCodes();
});
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="isOpen"
        class="w-full justify-between h-10 border-input font-medium text-sm text-muted-foreground"
      >
        {{
          selectedDiseaseCode
            ? diseaseCodes.find((d) => d.diseasePk.toString() === selectedDiseaseCode)?.diseaseCd
            : '질병 코드를 선택하세요'
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[300px] p-0">
      <Command>
        <CommandInput placeholder="질병 코드 검색..." v-model="searchQuery" />
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        <CommandList>
          <CommandItem
            v-for="disease in filteredDiseaseCodes"
            :key="disease.diseasePk"
            :value="disease.diseaseCd"
            @select="selectDiseaseCode(disease)"
          >
            <Check
              :class="[
                'mr-2 h-4 w-4',
                selectedDiseaseCode === disease.diseasePk.toString() ? 'opacity-100' : 'opacity-0'
              ]"
            />
            {{ disease.diseaseCd }}
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
