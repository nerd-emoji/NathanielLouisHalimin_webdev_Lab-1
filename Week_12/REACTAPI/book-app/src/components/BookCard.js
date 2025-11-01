import React from "react";

function BookCard({ book, onEdit, onDelete }) {
  // Fungsi untuk tampilkan rating dengan emoji
  const getRatingDisplay = (rating) => {
    switch (rating) {
      case "excellent":
        return "⭐⭐⭐ Sangat Bagus";
      case "average":
        return "⭐⭐ Biasa";
      case "bad":
        return "⭐ Kurang Bagus";
      default:
        return "⭐⭐ Biasa";
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
      return photoPath;
    }

    // prefer env var REACT_APP_API_BASE, fallback to same origin / localhost:8000
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

    // if backend returns path like '/media/xyz.jpg' or 'media/xyz.jpg' or just filename
    if (photoPath.startsWith("/")) {
      return `${API_BASE}${photoPath}`;
    }
    if (photoPath.startsWith("media/")) {
      return `${API_BASE}/${photoPath}`;
    }
    return `${API_BASE}/media/${photoPath}`;
  };

  const photoUrl = getPhotoUrl(book.photo);
  console.log("Photo URL:", photoUrl);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      {photoUrl ? (
        <div className="h-64 overflow-hidden bg-gray-100">
          <img
            src={photoUrl}
            alt={`Cover ${book.name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", photoUrl);
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="h-64 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <div class="text-center">
                    <span class="text-6xl">❌</span>
                    <p class="text-red-500 mt-2">Failed to load image</p>
                    <p class="text-xs text-red-400 mt-1 px-4">${photoUrl}</p>
                  </div>
                </div>
              `;
            }}
          />
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">📚</span>
            <p className="text-gray-500 mt-2">No Cover</p>
          </div>
        </div>
      )}
      {/* Judul Buku */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">📚 {book.name}</h3>

      {/* Penulis */}
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Penulis:</span> {book.author}
      </p>

      {/* Rating */}
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Rating:</span>{" "}
        {getRatingDisplay(book.rating)}
      </p>

      {/* Tanggal Upload */}
      <p className="text-gray-500 text-sm mb-4">
        Ditambahkan: {formatDate(book.uploaded)}
      </p>

      {/* Tombol Edit dan Hapus */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(book)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          🗑️ Hapus
        </button>
      </div>
    </div>
  );
}

export default BookCard;