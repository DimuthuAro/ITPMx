import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        title: '',
        description: '',
        status: '',
    });

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const response = await axios.get(`/api/tickets/${id}`);
                setTicket(response.data);
            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchTicket();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket({ ...ticket, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/tickets/${id}`, ticket);
            navigate('/tickets');
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    return (
        <div className="edit-ticket-container">
            <h2>Edit Ticket</h2>
            <form onSubmit={handleSubmit} className="edit-ticket-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={ticket.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={ticket.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={ticket.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Update Ticket</button>
            </form>
        </div>
    );
};

export default EditTicket;
