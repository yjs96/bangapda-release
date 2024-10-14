import ShadowBox from '@/components/ShadowBox.vue';
import type { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Components/ShadowBox',
  component: ShadowBox,
  argTypes: {
    height: { control: 'number', description: 'Height of the box in pixels' },
    paddingX: { control: 'number', description: 'Horizontal padding' },
    paddingY: { control: 'number', description: 'Vertical padding' },
    marginBottom: { control: 'number', description: 'Margin at the bottom of the box' },
    radius: { control: 'boolean', description: 'Apply border-radius' }
  }
} as Meta<typeof ShadowBox>;

const Template: StoryFn<typeof ShadowBox> = (args: any) => ({
  components: { ShadowBox },
  setup() {
    return { args };
  },
  template: '<ShadowBox v-bind="args">Example</ShadowBox>'
});

export const Default = Template.bind({});
Default.args = {
  paddingX: 20,
  paddingY: 20,
  marginBottom: 16,
  radius: true
};

export const CustomHeight = Template.bind({});
CustomHeight.args = {
  height: 200,
  paddingX: 16,
  paddingY: 16,
  marginBottom: 16,
  radius: true
};

export const NoRadius = Template.bind({});
NoRadius.args = {
  paddingX: 16,
  paddingY: 16,
  marginBottom: 16,
  radius: false
};

export const LargePadding = Template.bind({});
LargePadding.args = {
  paddingX: 40,
  paddingY: 40,
  marginBottom: 16,
  radius: true
};
