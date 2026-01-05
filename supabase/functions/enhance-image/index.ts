// ForeverFrame Edge Function: enhance-image
// Securely processes image enhancement using Nano Banana Pro API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Milestone-specific prompts for enhancing couple photos
const MILESTONE_PROMPTS: Record<string, { prompt: string; style: string }> = {
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

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'healthy', service: 'enhance-image' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    // Parse request body
    const body = await req.json();
    const { image_url, image_base64, milestone_id, milestone_name } = body;

    if (!milestone_id) {
      throw new Error('Missing milestone_id');
    }

    if (!image_url && !image_base64) {
      throw new Error('Missing image_url or image_base64');
    }

    // Get milestone prompt
    const milestoneConfig = MILESTONE_PROMPTS[milestone_id];
    if (!milestoneConfig) {
      throw new Error(`Unknown milestone: ${milestone_id}`);
    }

    // Build the full prompt
    const fullPrompt = `${milestoneConfig.prompt} Maintain the original subjects' faces and identities while enhancing the overall scene and atmosphere. Output in ultra-high quality 4K resolution.`;

    // Get Nano Banana Pro API key from environment
    const nanoBananaApiKey = Deno.env.get('NANO_BANANA_PRO_API_KEY');
    if (!nanoBananaApiKey) {
      throw new Error('Nano Banana Pro API key not configured');
    }

    // Call Nano Banana Pro API
    const apiResponse = await fetch('https://gateway.nanobananapro.site/api/v1/images/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${nanoBananaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nano-banana-pro',
        prompt: fullPrompt,
        image_input: [image_url || image_base64],
        resolution: '4K',
        aspect_ratio: '4:3',
        style_preset: milestoneConfig.style,
        preserve_faces: true,
        quality: 'ultra',
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${apiResponse.status}`);
    }

    const apiData = await apiResponse.json();

    // Extract the enhanced image URL from response
    let enhancedImageUrl = apiData.image_url || apiData.image || apiData.data?.image_url || apiData.result?.url;

    if (!enhancedImageUrl) {
      throw new Error('No image URL in API response');
    }

    // If the API returns a base64 image, upload it to storage
    if (enhancedImageUrl.startsWith('data:')) {
      const base64Response = await fetch(enhancedImageUrl);
      const blob = await base64Response.blob();
      
      const fileName = `${user.id}/enhanced/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) {
        throw new Error(`Failed to upload enhanced image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      enhancedImageUrl = urlData.publicUrl;
    }

    // Create image record in database
    const { data: imageRecord, error: dbError } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        original_image_url: image_url || 'base64-uploaded',
        enhanced_image_url: enhancedImageUrl,
        milestone_id: milestone_id,
        milestone_name: milestone_name || milestone_id,
        prompt: fullPrompt,
        status: 'completed',
        metadata: {
          model: 'nano-banana-pro',
          resolution: '4K',
          style: milestoneConfig.style,
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue even if DB insert fails - user should still get their image
    }

    return new Response(
      JSON.stringify({
        success: true,
        enhanced_image_url: enhancedImageUrl,
        image_id: imageRecord?.id,
        milestone: milestone_id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

