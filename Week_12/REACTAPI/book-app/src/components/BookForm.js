import React, { useState, useEffect } from "react";

function BookForm({ onSubmit, bookToEdit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    rating: "average",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        name: bookToEdit.name || "",
        author: bookToEdit.author || "",
        rating: bookToEdit.rating || "average",
      });
      // show existing photo if any
      setImagePreview(bookToEdit.photo || bookToEdit.photoUrl || null);
      setPhotoFile(null);
    } else {
      setFormData({ name: "", author: "", rating: "average" });
      setPhotoFile(null);
      setImagePreview(null);
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setPhotoFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(bookToEdit?.photo || null);
    }
  };

  const removeImage = () => {
    setPhotoFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // build FormData so file is uploaded correctly
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("author", formData.author);
    payload.append("rating", formData.rating);
    // only append photo when user selected a file
    if (photoFile) {
      // use field name expected by backend; backend logs showed "photo"
      payload.append("photo", photoFile);
    }

    try {
      // await onSubmit so caller handles API and we can reset on success
      await onSubmit(payload);
      // reset only after successful submit
      setFormData({ name: "", author: "", rating: "average" });
      setPhotoFile(null);
      setImagePreview(null);
    } catch (err) {
      // keep state for user to retry; show minimal console for debugging
      console.error("submit error:", err.response?.data || err.message || err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl mb-4">{bookToEdit ? "Edit Buku" : "Tambah Buku Baru"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Judul</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Penulis</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Rating</label>
          <select name="rating" value={formData.rating} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="excellent">Excellent</option>
            <option value="average">Average</option>
            <option value="bad">Bad</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Cover / Photo</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="preview" className="h-40 object-cover rounded" />
              <div>
                <button type="button" onClick={removeImage} className="bg-red-500 text-white px-2 py-1 rounded">Hapus gambar</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="bg-blue-500 text-white px-4 py-2 rounded">
            {submitting ? "Menyimpan..." : bookToEdit ? "Update" : "Tambah"}
          </button>
          {bookToEdit && (
            <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default BookForm;