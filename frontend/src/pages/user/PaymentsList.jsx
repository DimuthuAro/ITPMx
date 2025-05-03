import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPayments } from '../../services/api';
import PaymentCard from '../../components/user/PaymentCard';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';

const PaymentsList = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            if (!currentUser?.id) return; // Don't fetch if no userId
            setLoading(true);
            
            try {
                const response = await getPayments();
                // Filter payments for the current user
                const userPayments = response.data.filter(payment => payment.user === currentUser.id);
                setPayments(userPayments);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError('Failed to load payment history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [currentUser]);

    // Filter payments based on search term and status
    const filteredPayments = payments
        .filter(payment => {
            const nameMatch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
            const methodMatch = payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
            const amountMatch = payment.amount.toString().includes(searchTerm);
            const statusMatch = statusFilter ? payment.status === statusFilter : true;
            return (nameMatch || methodMatch || amountMatch) && statusMatch;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by date, newest first

    // Calculate total amount
    const totalAmount = filteredPayments.reduce((sum, payment) => {
        return payment.status === 'completed' ? sum + payment.amount : sum;
    }, 0);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <UserLayout title="Payment History" subtitle="View and manage your subscription payments">
            <div className="mb-8 bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, amount, or payment method..."
                                className="w-full pl-10 p-3 bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="md:w-1/4">
                        <select
                            className="w-full p-3 bg-gray-900/80 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="text-gray-300 text-sm">
                        <span className="font-medium">{filteredPayments.length}</span> payments found
                    </div>
                    
                    <div className="flex gap-3">
                        <Link
                            to="/pricing"
                            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            View Plans
                        </Link>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-lg text-gray-300">Loading your payment history...</p>
                </div>
            ) : error ? (
                <div className="bg-red-900/40 border-l-4 border-red-500 text-red-100 p-6 rounded-lg backdrop-blur-sm">
                    <p className="flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {error}
                    </p>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    <div className="text-gray-300 text-lg mt-4">
                        {payments.length === 0 ? "You don't have any payment records yet" : "No payments match your search"}
                    </div>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link
                            to="/pricing"
                            className="inline-flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPayments.map((payment) => (
                            <div key={payment._id} className="h-full">
                                <PaymentCard payment={payment} />
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white">Payment Summary</h3>
                                <p className="text-gray-400 text-sm mt-1">Total completed payments</p>
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Transactions</span>
                                <span className="text-white font-medium">{filteredPayments.length}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-400">Subscription Status</span>
                                <span className="text-emerald-400 font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </UserLayout>
    );
};

export default PaymentsList;