import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface OpenAIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

interface OpenAIResponse {
  choices: { text: string };
}

export const useOpenAI = () => {
  return useMutation({
    mutationFn: async ({
      prompt,
      maxTokens = 100,
      temperature = 0.7,
    }: OpenAIRequest) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

      const response = await axios.post<OpenAIResponse>(
        'https://api.openai.com/v1/completions',
        {
          model: 'gpt-3.5-turbo',
          prompt,
          maxTokens,
          temperature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices.text.trim();
    },
  });
};
