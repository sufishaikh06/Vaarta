
'use server';

/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  languageCode: z.string().optional().describe('The BCP-47 language code for the text (e.g., "en-US", "hi-IN").'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data URI.').nullable(),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, languageCode }) => {
    try {
        const {media} = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {voiceName: 'Algenib'},
                    },
                    languageCode: languageCode,
                },
            },
            prompt: text,
        });
        if (!media) {
            return { media: null };
        }
        const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
        );
        return {
        media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
        };
    } catch (error) {
        console.error("Text-to-speech API error:", error);
        // Return null instead of throwing, so the client can handle it gracefully.
        return { media: null };
    }
  }
);
