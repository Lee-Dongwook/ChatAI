import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'components/atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};
