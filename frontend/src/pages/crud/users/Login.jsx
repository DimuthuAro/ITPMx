import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { 
  FormContainer, 
  FormHeader, 
  FormError, 
  FormInput, 
  FormCheckbox, 
  FormButton, 
  FormFooter 
} from '../../../components/common/FormElements';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:3000/api/login', formData);
            console.log('User logged in:', response.data);
            localStorage.setItem('token', response.data.token); // Save token to localStorage
            navigate('/'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <FormContainer>
            <FormHeader 
                icon={<FaSignInAlt className="h-8 w-8 text-white" />}
                title="Sign in to your account"
                subtitle="Enter your credentials to access your dashboard"
            />
            
            <FormError message={error} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput 
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    icon={<FaEnvelope className="h-5 w-5 text-blue-300" />}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                />

                <FormInput 
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    icon={<FaLock className="h-5 w-5 text-blue-300" />}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                <div className="flex items-center justify-between">
                    <FormCheckbox 
                        id="remember-me"
                        name="remember-me"
                        label="Remember me"
                    />

                    <div className="text-sm">
                        <a href="#" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-200">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <FormButton>
                    Sign in
                </FormButton>
            </form>
            
            <FormFooter 
                text="Don't have an account?"
                linkText="Register here"
                linkUrl="/register"
            />
        </FormContainer>
    );
};

export default Login;