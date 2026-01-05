/**
 * Nano Banana Pro API Service
 * Handles image generation and editing with AI
 */

const API_KEY = import.meta.env.VITE_NANO_BANANA_PRO_API_KEY;
const BASE_URL = 'https://gateway.nanobananapro.site/api/v1/images/generate';

/**
 * Milestone-specific prompts for enhancing couple photos
 */
const MILESTONE_PROMPTS = {
  'first-date': {
    prompt: 'Transform this couple photo into a romantic, cinematic scene capturing the magic of a first date. Add warm golden hour lighting, soft bokeh background with twinkling city lights or cozy cafe ambiance. Enhance the emotional connection between the subjects with professional portrait lighting. Style: romantic film photography, warm color grading, shallow depth of field.',
    style: 'romantic cinematic',
  },
  'engagement': {
    prompt: 'Transform this couple photo into a stunning engagement portrait. Create a dreamy, ethereal atmosphere with soft backlighting and gentle lens flare. Add elegant touches like subtle sparkles or soft rose petals. Enhance with professional bridal photography lighting. Style: high-end engagement photography, soft pastel tones, magazine quality.',
    style: 'elegant bridal',
  },
  'wedding': {
    prompt: 'Transform this couple photo into an elegant, timeless wedding portrait. Add classic wedding photography elements: soft diffused lighting, romantic atmosphere, subtle vignette. Create a fairy-tale quality with gentle warm tones and professional retouching. Style: luxury wedding photography, classic and timeless, editorial quality.',
    style: 'luxury wedding',
  },
  'anniversary': {
    prompt: 'Transform this couple photo into a celebration of enduring love. Add warm, nostalgic lighting that evokes comfort and deep connection. Create a sophisticated, mature romantic atmosphere with rich colors and elegant composition. Style: anniversary portrait, warm intimate lighting, timeless elegance.',
    style: 'warm intimate',
  },
  'vacation': {
    prompt: 'Transform this couple photo into an epic travel adventure scene. Enhance with vibrant colors, dramatic lighting, and cinematic composition. Add atmosphere that captures the excitement and joy of exploring together. Style: travel photography, vivid colors, National Geographic quality.',
    style: 'adventure travel',
  },
  'celebration': {
    prompt: 'Transform this couple photo into a joyful celebration moment. Add festive, vibrant atmosphere with dynamic lighting and energy. Enhance colors to be rich and lively while maintaining natural skin tones. Style: celebration photography, vibrant and joyful, candid editorial.',
    style: 'festive celebration',
  },
};

/**
 * Convert a base64 data URL to a Blob
 */
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Upload image to a temporary hosting service and get URL
 * This is needed because the API requires image URLs, not base64
 */
async function uploadImageForAPI(base64Image) {
  // For now, we'll send the base64 directly as some APIs support it
  // If the API requires a URL, you would upload to a service like Cloudinary or S3
  return base64Image;
}

/**
 * Generate an enhanced image using Nano Banana Pro
 * @param {string} imageBase64 - The base64 encoded image to enhance
 * @param {string} milestoneId - The milestone ID for prompt selection
 * @returns {Promise<string>} - The URL or base64 of the enhanced image
 */
export async function enhanceImage(imageBase64, milestoneId) {
  if (!API_KEY) {
    throw new Error('Nano Banana Pro API key is not configured. Please set VITE_NANO_BANANA_PRO_API_KEY in your .env file.');
  }

  const milestoneConfig = MILESTONE_PROMPTS[milestoneId];
  if (!milestoneConfig) {
    throw new Error(`Unknown milestone: ${milestoneId}`);
  }

  const fullPrompt = `${milestoneConfig.prompt} Maintain the original subjects' faces and identities while enhancing the overall scene and atmosphere. Output in ultra-high quality 4K resolution.`;

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        prompt: fullPrompt,
        image_input: [imageBase64],
        resolution: '4K',
        aspect_ratio: '4:3',
        style_preset: milestoneConfig.style,
        preserve_faces: true,
        quality: 'ultra',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Return the image URL or base64 from the response
    // Adjust based on actual API response structure
    if (data.image_url) {
      return data.image_url;
    } else if (data.image) {
      return data.image;
    } else if (data.data?.image_url) {
      return data.data.image_url;
    } else if (data.result?.url) {
      return data.result.url;
    }
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Nano Banana Pro API Error:', error);
    throw error;
  }
}

/**
 * Check if the API is properly configured
 */
export function isAPIConfigured() {
  return !!API_KEY;
}

/**
 * Get the prompt for a specific milestone (for debugging/preview)
 */
export function getMilestonePrompt(milestoneId) {
  return MILESTONE_PROMPTS[milestoneId]?.prompt || null;
}

export default {
  enhanceImage,
  isAPIConfigured,
  getMilestonePrompt,
};

