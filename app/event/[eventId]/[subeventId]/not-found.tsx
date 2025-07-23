// app/event/[eventId]/[slug]/page.tsx
'use client';
import { useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="error">
      <div className="error__content">
        <h1 className="error__title">Event not found.</h1>
        <button
          className="error__button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/events');
            }
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
