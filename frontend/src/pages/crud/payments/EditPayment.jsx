import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPayment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState({
        name:'',
        amount: '',
        method: '',
        date:'',
        status: '',
    });

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(`/api/payments/${id}`);
                setPayment(response.data);
            } catch (error) {
                console.error('Error fetching payment data:', error);
            }
        };

        fetchPayment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment({ ...payment, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/payments/${id}`, payment);
            navigate('/payments');
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    return (
        <div className="edit-payment-container">
            <h2>Edit Payment</h2>
            <form onSubmit={handleSubmit} className="edit-payment-form">

                
                <div className="form-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={payment.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Method:</label>
                    <input
                        type="text"
                        name="method"
                        value={payment.method}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <input
                        type="text"
                        name="status"
                        value={payment.status}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Update Payment</button>
            </form>
        </div>
    );
};

export default EditPayment;