import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { 
  FormContainer, 
  FormHeader, 
  FormError, 
  FormInput, 
  FormCheckbox, 
  FormButton, 
  FormFooter 
} from '../../../components/common/FormElements';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            console.log('User registered:', response.data);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <FormContainer>
            <FormHeader 
                icon={<FaUserPlus className="h-8 w-8 text-white" />}
                title="Create your account"
                subtitle="Join us today and start your journey"
            />
            
            <FormError message={error} />
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput 
                    label="Full Name"
                    id="name"
                    name="name"
                    type="text"
                    icon={<FaUser className="h-5 w-5 text-blue-300" />}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />

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

                <FormInput 
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    icon={<FaLock className="h-5 w-5 text-blue-300" />}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                />

                <FormCheckbox 
                    id="terms"
                    name="terms"
                    label={<>I agree to the <a href="#" className="text-blue-300 hover:text-blue-200">Terms and Conditions</a></>}
                    required
                />

                <FormButton variant="success">
                    Create Account
                </FormButton>
            </form>
            
            <FormFooter 
                text="Already have an account?"
                linkText="Sign in here"
                linkUrl="/login"
            />
        </FormContainer>
    );
};

export default Register;