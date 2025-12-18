import { GoogleGenerativeAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export async function generateTryOnImage(
  personImageBase64: string,
  clothingImageBase64: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Remove data URL prefix if present
    const cleanPersonImage = personImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const cleanClothingImage = clothingImageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are an AI fashion assistant. Create a realistic image showing the person wearing the clothing item. 
    
    Instructions:
    - Seamlessly blend the clothing onto the person
    - Maintain the person's pose, body proportions, and background
    - Ensure natural lighting and shadows
    - Preserve skin tone and facial features
    - Make the clothing fit naturally on the body
    - Keep high image quality and realism
    
    Generate a photorealistic result of this virtual try-on.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanPersonImage,
        },
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanClothingImage,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // For demo purposes, return the person image with some processing indication
    // In production, Gemini would generate the actual try-on image
    // You may need to use a specialized model or API for actual virtual try-on
    console.log('Gemini response:', text);

    // Simulated result - in production, extract actual generated image
    // This is a placeholder - actual implementation depends on Gemini's image generation capabilities
    return personImageBase64; // Replace with actual generated image from Gemini
  } catch (error) {
    console.error('Error generating try-on image:', error);
    throw new Error('Failed to generate virtual try-on image');
  }
}

// Alternative: Use image editing model if available
export async function generateTryOnImageV2(
  personImageBase64: string,
  clothingImageBase64: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = `Create a photorealistic virtual try-on image. Place the clothing from the second image onto the person in the first image. Maintain natural proportions, lighting, and seamless integration. Output: high-quality photorealistic image.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: personImageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: clothingImageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      },
    ]);

    // Extract image from response if available
    // This is model-dependent
    return personImageBase64; // Placeholder
  } catch (error) {
    console.error('Error in V2 generation:', error);
    throw error;
  }
}