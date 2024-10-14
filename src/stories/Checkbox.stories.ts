import { Checkbox } from '@/components/ui/checkbox';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    class: { control: 'text', description: 'Additional CSS classes' },
    disabled: { control: 'boolean', description: 'Disable the checkbox' },
    checked: { control: 'boolean', description: 'Check the checkbox' }
  }
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => ({
  components: { Checkbox },
  setup() {
    return { args };
  },
  template: `
    <Checkbox v-bind="args">
      <template #default>
        <span></span>
      </template>
    </Checkbox>
  `
});

export const Default = Template.bind({});
Default.args = {
  checked: false,
  disabled: false,
  class: ''
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  disabled: false,
  class: ''
};

export const Disabled = Template.bind({});
Disabled.args = {
  checked: false,
  disabled: true,
  class: ''
};
