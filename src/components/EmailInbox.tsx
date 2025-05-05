'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EmailList() {
  const { data, error, isLoading } = useSWR('/api/emails', fetcher);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.map((email: { id: string, subject: string }) => (
        <li key={email.id}>{email.subject}</li>
      ))}
    </ul>
  );
}
