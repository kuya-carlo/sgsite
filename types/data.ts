// types/supabase.ts
import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Interface for raw event data from the database.
 */
export interface EventRecord {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subevents?: number[];
  registration_url?: string | null;
  event_start: string;
  event_end: string;
}

/**
 * Domain class for an Event.
 * Implements EventRecord and provides a constructor for easy instantiation.
 */
export const EventModel = {
  from(obj: EventRecord): EventRecord {
    return { ...obj };
  },
};

/**
 * Interface for raw subevent data from the database.
 */
export interface SubeventRecord {
  id: number;
  event_id: string;
  title: string;
  description: string;
  registration_url?: string | null;
  subevent_index: number;
  event_start: string;
  event_end: string;
}

/**
 * Domain class for a SubEvent.
 * Implements SubeventRecord and provides a constructor for easy instantiation.
 */
export const SubEventModel = {
  from(obj: SubeventRecord): SubeventRecord {
    return { ...obj };
  },
};

export interface ErrorFormat {
  code?: string;
  details?: string;
  hint?: string;
  context?: string;
  cause?: string;
}

export class APIError extends Error implements ErrorFormat {
  code?: string;
  details?: string;
  hint?: string;
  context?: string;
  cause?: string;

  constructor(message: string, options: ErrorFormat = {}) {
    // for offline use
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "APIError";
    Object.assign(this, options);
  }

  static from(error: PostgrestError & { context?: string }): APIError {
    // for Supabase use
    return new APIError(error.message, {
      code: error.code,
      details: error.details,
      hint: error.hint,
      context: error.context,
    });
  }
}
