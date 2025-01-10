import React from 'react';

const EmailView = () => {
  // Dummy email data
  const email = {
    subject: 'Meeting Reminder',
    from: 'sender@example.com',
    to: 'recipient@example.com',
    date: '2023-10-01',
    body: 'This is a reminder for our meeting scheduled tomorrow at 10 AM.',
  };

  const handleReply = () => {
    console.log('Replying to:', email.from);
    // Implement reply functionality here
  };

  const handleForward = () => {
    console.log('Forwarding email to another recipient');
    // Implement forward functionality here
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold">{email.subject}</h2>
      <p className="text-gray-600">From: {email.from}</p>
      <p className="text-gray-600">To: {email.to}</p>
      <p className="text-gray-600">Date: {email.date}</p>
      <div className="mt-4">
        <p>{email.body}</p>
      </div>
      <div className="mt-6 flex space-x-2">
        <button onClick={handleReply} className="bg-blue-600 text-white px-4 py-2 rounded">
          Reply
        </button>
        <button onClick={handleForward} className="bg-green-600 text-white px-4 py-2 rounded">
          Forward
        </button>
      </div>
    </div>
  );
};

export default EmailView;