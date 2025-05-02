import React from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
    // Function to truncate content to a specific length
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    };

    // Function to format date nicely
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 h-full flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{note.title}</h3>
                {note.category && (
                    <span className="text-xs bg-blue-900/80 backdrop-blur-sm text-blue-300 px-2 py-1 rounded-full">
                        {note.category}
                    </span>
                )}
            </div>

            <p className="text-gray-300 mb-4 flex-grow overflow-hidden">
                {truncateText(note.content, 150)}
            </p>

            <div className="mt-auto pt-3 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                    {formatDate(note.updated_at)}
                </span>

                <div className="flex gap-2">
                    <Link
                        to={`/notes/${note._id}`}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        View
                    </Link>
                    <Link
                        to={`/notes/edit/${note._id}`}
                        className="text-sm text-gray-400 hover:text-gray-300"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
