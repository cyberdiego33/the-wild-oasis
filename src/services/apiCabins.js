import supabase, { supabaseUrl } from "./supabase";

// Function to Get all the cabins table
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log("Cabins could not be loaded");
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

// Function to delete the cabins row with that ID
export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log("Cabins could not be deleted");
    throw new Error("Cabins could not be deleted");
  }
}

// Function to create or edit a cabin row
export async function createEditCabin(newCabin, id) {
  // Example image URL
  // https://kfozxafslhzhdihdnswx.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // creating a random number for the image
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // Configuring the path to be saved in the bucket
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Select the table
  let query = supabase.from("cabins");

  // A) Create if no valid Id
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();

  if (error) {
    console.log("Cabins could not be loaded");
    throw new Error("Cabins could not be deleted");
  }

  // 2. Upload image
  if (hasImagePath) return data;
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // If image wasn't successful delete the row
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error("Cabin image could not be uploaded... Cabin not created");
  }

  return data;
}
