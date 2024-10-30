import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input';

const meta: Meta<typeof Input> = {
  title: 'components/atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
