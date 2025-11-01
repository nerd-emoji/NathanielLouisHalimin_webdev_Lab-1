import React, {useState, useEffect} from "react";

function BookForm({ onSubmit, bookEdit, onCancel}) {
    const [formData, setFormData] = useState({
        name: "",
        author: "",
        rating: "average",
    });

    useEffect(() => {
        if (bookEdit) {
            setFormData({
                name: bookEdit.name || "",
                author: bookEdit.author || "",
                rating: bookEdit.rating || "",
            });
        }
    }, [bookEdit]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            name: "",
            author: "",
            rating: "average",
        });

    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="font-bold text-2xl mb-4 text-gray-600">
                {bookEdit ? "Edit Book" : "Add New Book"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">
                        judul buku
                    </label>
                    <input type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukan Judul Buku"
                    required
                    />                
                </div>
                    <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">
                        Penulis
                    </label>
                    <input type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukan Nama Penulis"
                    required
                    />                
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        rating
                    </label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="sumbit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        {bookEdit ? "Update Book" : "Add Book"}
                    </button>
                    {bookEdit && (
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

        </div>
    );
};
export default BookForm;