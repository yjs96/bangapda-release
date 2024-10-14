import { Input } from '@/components/ui/input';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    defaultValue: { control: 'text', description: 'Default value of the input' },
    modelValue: { control: 'text', description: 'Bound value of the input' },
    class: { control: 'text', description: 'Additional CSS classes for the input' }
  }
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => ({
  components: { Input },
  setup() {
    return { args };
  },
  template: `<Input v-bind="args" />`
});

export const Default = Template.bind({});
Default.args = {
  modelValue: '',
  defaultValue: 'Enter text...',
  class: ''
};

export const FilledInput = Template.bind({});
FilledInput.args = {
  modelValue: 'Filled',
  defaultValue: '',
  class: ''
};

export const CustomClass = Template.bind({});
CustomClass.args = {
  modelValue: '',
  defaultValue: '',
  class: 'bg-gray-200'
};