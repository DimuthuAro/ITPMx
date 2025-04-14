import './NotAuthorized.css'; // External CSS for styling

const NotAuthorized = () => {
    return (
        <div className="not-authorized-container">
            <div className="not-authorized-content">
                <h1 className="not-authorized-title">403 - Access Denied</h1>
                <p className="not-authorized-message">
                    You do not have permission to view this page. Please contact the administrator
                    if you believe this is an error.
                </p>
                <button
                    className="not-authorized-button"
                    onClick={() => window.location.href = '/'}
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default NotAuthorized