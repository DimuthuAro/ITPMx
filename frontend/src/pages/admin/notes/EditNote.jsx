import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState({
        title: '',
        content: '',
        category: '',
    });

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/notes/${id}`);
                setNote(response.data);
            } catch (error) {
                console.error('Error fetching note data:', error);
            }
        };

        fetchNote();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote({ ...note, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/notes/${id}`, note);
            navigate('/notes');
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    return (
        <div className="edit-note-container">
            <h2>Edit Note</h2>
            <form onSubmit={handleSubmit} className="edit-note-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={note.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Content:</label>
                    <textarea
                        name="content"
                        value={note.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={note.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Update Note</button>
            </form>
        </div>
    );
};

export default EditNote;