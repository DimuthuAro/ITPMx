import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-indigo-950/90 via-purple-950/90 to-indigo-950/90 backdrop-blur-md text-white border-t border-white/10 mt-auto relative overflow-hidden z-10">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            </div>

            <div className="container mx-auto px-6 py-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">IT</span>
                            </div>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                ITPM Project
                            </span>
                        </div>
                        <p className="text-indigo-200 text-sm mt-4 max-w-md">
                            A comprehensive management solution to streamline your business operations and improve efficiency.
                        </p>
                        <div className="flex space-x-3 pt-4">
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors">
                                <FaTwitter />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors">
                                <FaFacebook />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors">
                                <FaLinkedin />
                            </a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-300 hover:text-white transition-colors">
                                <FaGithub />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="/" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">Home</a>
                            <a href="/about" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">About</a>
                            <a href="/users" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">Users</a>
                            <a href="/notes" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">Notes</a>
                            <a href="/payments" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">Payments</a>
                            <a href="/tickets" className="text-indigo-200 hover:text-white text-sm py-1 transition-colors">Tickets</a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white/5 rounded-lg text-indigo-300">
                                    <FaMapMarkerAlt />
                                </div>
                                <span className="text-indigo-200 text-sm">123 Tech Street, Silicon Valley, CA 94043, USA</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white/5 rounded-lg text-indigo-300">
                                    <FaPhoneAlt />
                                </div>
                                <span className="text-indigo-200 text-sm">+1 (123) 456-7890</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="p-2 bg-white/5 rounded-lg text-indigo-300">
                                    <FaEnvelope />
                                </div>
                                <span className="text-indigo-200 text-sm">info@itpm-project.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-indigo-200 text-sm">
                        &copy; {currentYear} ITPM Project. All rights reserved.
                    </p>
                    <div className="mt-4 sm:mt-0">
                        <div className="flex space-x-4 text-sm text-indigo-200">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;