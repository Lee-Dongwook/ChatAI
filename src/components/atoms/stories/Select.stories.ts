import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../Select';

const meta: Meta<typeof Select> = {
  title: 'components/atoms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
