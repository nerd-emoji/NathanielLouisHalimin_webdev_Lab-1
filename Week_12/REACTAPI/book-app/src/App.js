import React, { useState, useEffect } from "react";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "./services/bookService";

function App() {
  const [books, setBooks] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  // new: rating filter state ('all' | 'excellent' | 'average' | 'bad')
  const [ratingFilter, setRatingFilter] = useState("all");

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBooks();
      console.log("API books response:", data);

      // helper to normalize rating values to one of: excellent, average, bad
      const normalizeRating = (val) => {
        const s = (val || "").toString().toLowerCase();
        if (/excel|excellent|5|very good|great/.test(s)) return "excellent";
        if (/avg|average|3|4|medium|fair/.test(s)) return "average";
        if (/bad|poor|1|2|terrible/.test(s)) return "bad";
        return s || "average"; // default fallback
      };

      const normalized = (Array.isArray(data) ? data : []).map((b) => ({
        ...b,
        title: (b.title || b.judul || b.name || "").toString().trim(),
        author: (b.author || b.penulis || b.writer || "").toString().trim(),
        rating: normalizeRating(b.rating || b.rate || b.nilai || b.kualitas),
      }));

      setBooks(normalized);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data buku. Pastikan server jalan ya beb");
      console.error("loadBooks error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (bookToEdit) {
        await updateBook(bookToEdit.id, formData);
        alert("Buku berhasil diupdate!");
        setBookToEdit(null);
        await loadBooks();
      } else {
        await createBook(formData);
        alert("Buku berhasil ditambahkan!");
        await loadBooks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (book) => {
    setBookToEdit(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setBookToEdit(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      alert("Buku berhasil dihapus!");
      await loadBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books.filter((b) => {
    if (!query.trim() && ratingFilter === "all") return true;
    const q = query.toLowerCase();
    const matchesQuery =
      !query.trim() ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.judul && b.judul.toLowerCase().includes(q)) ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.penulis && b.penulis.toLowerCase().includes(q));

    const matchesRating = ratingFilter === "all" || (b.rating && b.rating === ratingFilter);

    return matchesQuery && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Perpustakaan Digital
          </h1>
          <p className="text-gray-600">
            Kelola koleksi buku favoritmu dengan mudah!
          </p>
        </div>

        {/* Form Tambah/Edit Buku */}
        <BookForm
          onSubmit={handleSubmit}
          bookToEdit={bookToEdit}
          onCancel={handleCancelEdit}
        />

        {/* Search + Rating filter */}
        <div className="my-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border rounded shadow-sm focus:outline-none"
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full md:w-1/6 px-3 py-2 border rounded shadow-sm focus:outline-none bg-white"
          >
            <option value="all">Semua rating</option>
            <option value="excellent">Sangat Bagus</option>
            <option value="average">Biasa</option>
            <option value="bad">Kurang Bagus</option>
          </select>
        </div>

        {/* Tampilkan Loading */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">⏳ Memuat data...</p>
          </div>
        )}

        {/* Tampilkan Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Daftar Buku */}
        {!loading && !error && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Daftar Buku ({filteredBooks.length}/{books.length})
            </h2>

            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-xl text-gray-500">
                  📭 Tidak ada buku yang cocok dengan pencarian.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default App;