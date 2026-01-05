import { supabase } from './supabase';

/**
 * API service for ForeverFrame
 * Handles calls to Edge Functions for AI processing
 */

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : null;

/**
 * Enhance an image using the backend Edge Function
 * This keeps the Nano Banana Pro API key secure on the server
 */
export async function enhanceImageViaBackend({
  imageUrl,
  imageBase64,
  milestoneId,
  milestoneName,
}) {
  if (!EDGE_FUNCTION_URL) {
    throw new Error('Supabase not configured. Cannot call backend functions.');
  }

  // Get the current session for authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('You must be logged in to enhance images.');
  }

  const response = await fetch(`${EDGE_FUNCTION_URL}/enhance-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      image_url: imageUrl,
      image_base64: imageBase64,
      milestone_id: milestoneId,
      milestone_name: milestoneName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Enhancement failed with status ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  if (!EDGE_FUNCTION_URL) {
    return { healthy: false, error: 'Supabase not configured' };
  }

  try {
    const response = await fetch(`${EDGE_FUNCTION_URL}/enhance-image`, {
      method: 'GET',
    });
    
    return { 
      healthy: response.ok, 
      status: response.status 
    };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.message 
    };
  }
}

export default {
  enhanceImageViaBackend,
  checkBackendHealth,
};

