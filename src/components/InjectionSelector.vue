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

interface Injection {
  injectionPk: number;
  injectionNm: string;
}

// Props로 선택된 주사를 전달 받음
const props = defineProps<{
  modelValue: string; // modelValue를 string 타입으로 설정
}>();

const emit = defineEmits(['update:modelValue', 'update:injectionName']);

// 주사 리스트를 저장하는 ref
const injections = ref<Injection[]>([]);
const isOpen = ref(false);
const searchQuery = ref('');

// 선택된 주사를 관리하는 computed 속성
const selectedInjection = computed({
  get: () => props.modelValue, // string 타입으로 받음
  set: (value: string) => {
    const selectedInjection = injections.value.find((i) => i.injectionPk.toString() === value);
    emit('update:modelValue', value); // string 타입으로 emit
    emit('update:injectionName', selectedInjection?.injectionNm || '');
  }
});

const filteredInjections = computed(() => {
  return injections.value.filter((injection) =>
    injection.injectionNm.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 백엔드에서 주사 리스트를 가져오는 함수
const fetchInjections = async () => {
  try {
    const response = await axiosInstance.get('/api/hospital/injection'); // 실제 API 경로
    injections.value = response.data.data.injectionList;
  } catch (error) {
    console.error('Error fetching injections:', error);
  }
};

// 주사를 선택하는 함수
const selectInjection = (injection: Injection) => {
  selectedInjection.value = injection.injectionPk.toString();
  isOpen.value = false;
};

// 컴포넌트가 마운트될 때 주사 리스트를 가져옴
onMounted(() => {
  fetchInjections();
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
          selectedInjection
            ? injections.find((i) => i.injectionPk.toString() === selectedInjection)?.injectionNm
            : '주사 이름을 선택하세요'
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[300px] p-0">
      <Command>
        <CommandInput placeholder="주사 검색..." v-model="searchQuery" />
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        <CommandList>
          <CommandItem
            v-for="injection in filteredInjections"
            :key="injection.injectionPk"
            :value="injection.injectionNm"
            @select="selectInjection(injection)"
          >
            <Check
              :class="[
                'mr-2 h-4 w-4',
                selectedInjection === injection.injectionPk.toString() ? 'opacity-100' : 'opacity-0'
              ]"
            />
            {{ injection.injectionNm }}
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
