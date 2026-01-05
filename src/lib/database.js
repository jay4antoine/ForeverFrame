import { supabase } from './supabase';

/**
 * Database service for ForeverFrame
 * Handles all database operations for images and edits
 */

/**
 * Create a new image record
 */
export async function createImageRecord({
  userId,
  originalImageUrl,
  enhancedImageUrl,
  milestoneId,
  milestoneName,
  prompt,
  metadata = {},
}) {
  const { data, error } = await supabase
    .from('images')
    .insert({
      user_id: userId,
      original_image_url: originalImageUrl,
      enhanced_image_url: enhancedImageUrl,
      milestone_id: milestoneId,
      milestone_name: milestoneName,
      prompt: prompt,
      metadata: metadata,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all images for a user
 */
export async function getUserImages(userId, options = {}) {
  const { limit = 50, offset = 0, orderBy = 'created_at', ascending = false } = options;

  let query = supabase
    .from('images')
    .select('*')
    .eq('user_id', userId)
    .order(orderBy, { ascending })
    .range(offset, offset + limit - 1);

  const { data, error } = await query;
  return { data, error };
}

/**
 * Get a single image by ID
 */
export async function getImageById(imageId) {
  const { data, error } = await supabase
    .from('images')
    .select(`
      *,
      edits (*)
    `)
    .eq('id', imageId)
    .single();

  return { data, error };
}

/**
 * Delete an image
 */
export async function deleteImage(imageId) {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  return { error };
}

/**
 * Add an edit to an image (for future edit history)
 */
export async function addImageEdit({
  imageId,
  editType,
  editParams,
  resultImageUrl,
}) {
  const { data, error } = await supabase
    .from('edits')
    .insert({
      image_id: imageId,
      edit_type: editType,
      edit_params: editParams,
      result_image_url: resultImageUrl,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all edits for an image
 */
export async function getImageEdits(imageId) {
  const { data, error } = await supabase
    .from('edits')
    .select('*')
    .eq('image_id', imageId)
    .order('created_at', { ascending: true });

  return { data, error };
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(imageId, metadata) {
  const { data, error } = await supabase
    .from('images')
    .update({ metadata, updated_at: new Date().toISOString() })
    .eq('id', imageId)
    .select()
    .single();

  return { data, error };
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(file, userId, folder = 'originals') {
  const fileExt = file.name?.split('.').pop() || 'jpg';
  const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return { 
    data: { 
      path: data.path, 
      url: urlData.publicUrl 
    }, 
    error: null 
  };
}

/**
 * Upload a base64 image to Supabase Storage
 */
export async function uploadBase64Image(base64Data, userId, folder = 'originals') {
  // Convert base64 to blob
  const base64Response = await fetch(base64Data);
  const blob = await base64Response.blob();
  
  const fileName = `${userId}/${folder}/${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return { 
    data: { 
      path: data.path, 
      url: urlData.publicUrl 
    }, 
    error: null 
  };
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

export default {
  createImageRecord,
  getUserImages,
  getImageById,
  deleteImage,
  addImageEdit,
  getImageEdits,
  updateImageMetadata,
  uploadImage,
  uploadBase64Image,
  getUserProfile,
  updateUserProfile,
};

