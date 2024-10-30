import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '../Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'components/atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
