import React, { useState } from 'react';
import UserLayout from '../../components/user/UserLayout';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is NoteGenius?",
            answer: "NoteGenius is a comprehensive platform designed to help users organize notes, submit tickets for assistance, and manage user profiles efficiently. It's an all-in-one solution for personal and professional note-taking with additional support features."
        },
        {
            question: "How do I create a new note?",
            answer: "To create a new note, log in to your account, click on the 'Create Note' option in the navigation menu, fill in the required details like title, content, and any tags, then click on the 'Save' button. Your note will be stored securely and can be accessed from your dashboard."
        },
        {
            question: "Can I customize my user profile?",
            answer: "Yes! You can customize your profile by clicking on the 'Profile' link in the navigation bar. From there, you can update your personal information, change your profile picture, adjust notification preferences, and manage your account settings."
        },
        {
            question: "How do I submit a support ticket?",
            answer: "To submit a support ticket, navigate to the 'Create Ticket' page from the main navigation menu. Fill out the form with details about your issue, including a title, description, priority level, and any relevant attachments. Our support team will respond to your ticket as soon as possible."
        },
        {
            question: "How can I check the status of my support ticket?",
            answer: "You can check the status of your support tickets by navigating to the 'Tickets List' page in your dashboard. There, you'll see all your submitted tickets with their current status (Open, In Progress, Resolved, or Closed). Click on any ticket to view detailed information and any responses from our support team."
        },
        {
            question: "What are the different priority levels for support tickets?",
            answer: "We offer three priority levels for support tickets: Low (for general questions and minor issues), Medium (for issues affecting your workflow but with workarounds available), and High (for critical issues preventing you from using essential features). The response time varies based on priority level and your subscription plan."
        },
        {
            question: "Can I update or add information to an existing support ticket?",
            answer: "Yes, you can add additional information to an existing ticket by navigating to the 'Tickets List' page, clicking on the specific ticket, and using the reply function at the bottom of the ticket details. You can also attach additional files if needed to help explain your issue further."
        },
        {
            question: "What is the typical response time for support tickets?",
            answer: "Our typical response time for support tickets depends on the priority level and your subscription plan. High priority tickets are usually addressed within 4-8 hours, Medium priority within 24 hours, and Low priority within 48 hours. Premium subscribers receive faster response times for all ticket types."
        },
        {
            question: "Can I attach files to my support tickets?",
            answer: "Yes, you can attach files such as screenshots, documents, or any other relevant materials to your support tickets. When creating or updating a ticket, look for the 'Attach Files' option below the description field. We accept common file formats including PNG, JPG, PDF, and DOC with a maximum size of 10MB per file."
        },
        {
            question: "How do I reopen a closed support ticket?",
            answer: "If you need to reopen a closed ticket, navigate to your 'Tickets List', find the closed ticket, and click on it to view the details. At the bottom of the ticket, you'll find a 'Reopen Ticket' button. Click this button and provide a reason for reopening the ticket. Our support team will be notified and will resume assistance with your issue."
        },
        {
            question: "Can I delete a support ticket?",
            answer: "While you cannot completely delete a support ticket for record-keeping purposes, you can request to close a ticket at any time. If you've submitted a ticket by mistake or no longer need assistance, simply open the ticket and click the 'Request to Close' button, optionally providing a reason for closing the ticket."
        },
        {
            question: "Is my data secure on NoteGenius?",
            answer: "Absolutely! We take security very seriously. All your data is encrypted both in transit and at rest. We implement industry-standard security protocols and regularly update our systems to ensure your information remains protected from unauthorized access."
        },
        {
            question: "Can I share my notes with other users?",
            answer: "Currently, we're working on implementing a sharing feature that will allow you to collaborate with other users. In the upcoming update, you'll be able to share notes with specific users and set different permission levels such as view-only or edit access."
        },
        {
            question: "What if I forget my password?",
            answer: "If you forget your password, click on the 'Login' page and then select the 'Forgot Password' option. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password and regain access to your account."
        },
        {
            question: "Are there any mobile apps available?",
            answer: "We're currently developing mobile applications for both iOS and Android platforms. The beta version should be available for testing soon. In the meantime, our website is fully responsive and works well on mobile browsers."
        },
        {
            question: "How do I create a new note?",
            answer: "You can create a new note by navigating to the Dashboard and clicking on the 'Create Note' button. Fill in the note details in the form provided and click 'Save' to create your note."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We currently accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. You can manage your payment methods in the Payment section of your account."
        },
        {
            question: "How can I change my subscription plan?",
            answer: "To change your subscription plan, navigate to the Pricing page, select your desired plan, and follow the payment process. Your subscription will be updated immediately, and any price differences will be prorated."
        },
        {
            question: "How secure is my data?",
            answer: "We take data security very seriously. All your data is encrypted both in transit and at rest. We implement industry-standard security practices and regularly audit our systems to ensure your information remains protected."
        },
        {
            question: "Can I export my notes?",
            answer: "Yes, you can export your notes in various formats including PDF, plain text, and HTML. Look for the export option in the note details page or select multiple notes from the Dashboard to perform batch exports."
        },
        {
            question: "How do I reset my password?",
            answer: "If you've forgotten your password, click on 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password. For security reasons, password reset links expire after 24 hours."
        },
        {
            question: "Is there a limit on how many notes I can create?",
            answer: "The number of notes you can create depends on your subscription plan. Basic plans allow up to 2,500 notes, Standard plans allow up to 7,500 notes, and Premium plans offer unlimited notes. You can view your current usage in your account settings."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can contact our customer support team through the Support page by creating a support ticket. We aim to respond to all inquiries within 24 hours. Premium subscribers have access to priority support with faster response times."
        },
        {
            question: "Can I use the application offline?",
            answer: "Yes, our web application has offline capabilities. You can continue creating and editing notes even without an internet connection. Your changes will automatically sync once you're back online."
        },
        {
            question: "How do I cancel my subscription?",
            answer: "You can cancel your subscription at any time from your account settings. Navigate to the Subscription section and click on 'Cancel Subscription'. Your access will remain active until the end of the current billing period."
        }
    ];

    return (
        <UserLayout title="Frequently Asked Questions" subtitle="Find answers to common questions about our services">
            <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg mb-6">
                    <p className="text-white">
                        Can't find the answer you're looking for? Visit our{' '}
                        <a href="/support" className="text-blue-400 hover:text-blue-300 underline">
                            Support page
                        </a>{' '}
                        to get personalized assistance.
                    </p>
                </div>

                <div className="bg-gray-800/40 rounded-xl backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <div className="divide-y divide-gray-700">
                        {faqData.map((faq, index) => (
                            <div key={index} className="p-6">
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                    <svg
                                        className={`w-6 h-6 text-blue-400 transition-transform duration-200 ${
                                            openIndex === index ? 'transform rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        ></path>
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="mt-4 text-gray-300 leading-relaxed">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Can't find what you're looking for?</h3>
                    <p className="text-gray-300 mb-4">
                        Our support team is ready to assist you with any questions or issues you may have.
                    </p>
                    <a
                        href="/support"
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        Contact Support
                    </a>
                </div>
            </div>
        </UserLayout>
    );
};

export default FAQ;