import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log("Cabins could not be loaded");
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log("Cabins could not be loaded");
    throw new Error("Cabins could not be deleted");
  }
}

export async function createCabin(newCabin) {
  // This one works and is a different image in the table
  // https://kfozxafslhzhdihdnswx.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // This is the new url gotten from supabase table row
  // https://kfozxafslhzhdihdnswx.supabase.co/storage/v1/object/public/cabin-images/0.2344930367738649-cabin-008.jpg

  // This one is gotten direct from the buckets and i used it directly in a table in supabase and it works
  // https://kfozxafslhzhdihdnswx.supabase.co/storage/v1/object/public/cabin-images/imageName

  // the last 2 images are the same

  // creating a random number for the image
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // Configuring the path to be saved in the bucket
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error) {
    console.log("Cabins could not be loaded");
    throw new Error("Cabins could not be deleted");
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.log(storageError);
    throw new Error("Cabin image could not be uploaded... Cabin not created");
  }

  return data;
}
