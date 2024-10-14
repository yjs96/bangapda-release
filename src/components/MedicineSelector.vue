<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-vue-next';
import axiosInstance from '@/api/instance';

interface Medicine {
  medicinePk: number;
  medicineNm: string;
}

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue', 'update:medicineName']);

const medicines = ref<Medicine[]>([]);
const isOpen = ref(false);
const searchQuery = ref('');

const selectedMedicine = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const selectedMedicine = medicines.value.find((m) => m.medicinePk.toString() === value);
    emit('update:modelValue', value);
    emit('update:medicineName', selectedMedicine?.medicineNm || '');
  }
});

const filteredMedicines = computed(() => {
  return medicines.value.filter((medicine) =>
    medicine.medicineNm.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchMedicines = async () => {
  try {
    const response = await axiosInstance.get('/api/medi/list');
    medicines.value = response.data.data.medicineList;
  } catch (error) {
    console.error('Error fetching medicines:', error);
  }
};

const selectMedicine = (medicine: Medicine) => {
  selectedMedicine.value = medicine.medicinePk.toString();
  isOpen.value = false;
};

onMounted(() => {
  fetchMedicines();
});
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="isOpen"
        class="w-full justify-between h-10 border-border"
      >
        {{
          selectedMedicine
            ? medicines.find((m) => m.medicinePk.toString() === selectedMedicine)?.medicineNm
            : '약 이름을 선택하세요'
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[300px] p-0">
      <Command>
        <CommandInput placeholder="약 검색..." v-model="searchQuery" />
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        <CommandList>
          <CommandItem
            v-for="medicine in filteredMedicines"
            :key="medicine.medicinePk"
            :value="medicine.medicineNm"
            @select="selectMedicine(medicine)"
          >
            <Check
              :class="[
                'mr-2 h-4 w-4',
                selectedMedicine === medicine.medicinePk.toString() ? 'opacity-100' : 'opacity-0'
              ]"
            />
            {{ medicine.medicineNm }}
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
