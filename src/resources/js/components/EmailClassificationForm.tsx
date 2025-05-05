'use client' ;
import { useState } from 'react';

const EmailClassificationForm = () => {
  const [subject, setSubject] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [body, setBody] = useState('');
  const [classification, setClassification] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/classifyEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, fromEmail, body }),
    });

    const data = await response.json();
    if (response.ok) {
      setClassification(data.email.status); // Set the classification status
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Email Classification</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>From Email</label>
          <input
            type="email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Classify Email</button>
      </form>

      {classification && (
        <div>
          <h2>Email Classified As: {classification}</h2>
        </div>
      )}
    </div>
  );
};

export default EmailClassificationForm;
