import type { Meta, StoryFn } from '@storybook/vue3';
import { Button } from '@/components/ui/button';

// Define the metadata for the stories
const meta: Meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
      }
    },
    size: {
      control: { type: 'select', options: ['default', 'lg', 'icon'] }
    },
    class: { control: 'text' }
  }
};

export default meta;

// Define the template for the button stories
const Template: StoryFn = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: '<Button v-bind="args">버튼</Button>'
});

// Define the different button stories
export const Default = Template.bind({});
Default.args = {
  variant: 'default',
  size: 'default'
};

export const Destructive = Template.bind({});
Destructive.args = {
  variant: 'destructive',
  size: 'default'
};

export const Outline = Template.bind({});
Outline.args = {
  variant: 'outline',
  size: 'default'
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  size: 'default'
};

export const Large = Template.bind({});
Large.args = {
  variant: 'default',
  size: 'lg'
};