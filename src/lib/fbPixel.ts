/**
 * Facebook Pixel Client-Side Tracking Utilities
 * Provides helper functions for tracking events with automatic event_id generation
 * for deduplication with Conversions API (CAPI)
 */

// Extend window type to include fbq
declare global {
    interface Window {
        fbq: any;
    }
}

/**
 * Generate a unique event ID for deduplication between Pixel and CAPI
 */
export function generateEventId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Track a generic Facebook Pixel event
 * @param eventName - Name of the event (e.g., 'Lead', 'Contact', 'ViewContent')
 * @param params - Event parameters
 * @param eventId - Optional event ID for deduplication (auto-generated if not provided)
 * @returns The event ID used
 */
export function trackEvent(
    eventName: string,
    params: Record<string, any> = {},
    eventId?: string
): string {
    const id = eventId || generateEventId();

    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, {
            ...params,
            event_id: id,
        });
    }

    return id;
}

/**
 * Track a Lead event (form submission)
 * @param email - User email
 * @param phone - User phone number
 * @param additionalParams - Additional event parameters
 * @returns The event ID used
 */
export function trackLead(
    email?: string,
    phone?: string,
    additionalParams: Record<string, any> = {}
): string {
    const eventId = generateEventId();

    const params: Record<string, any> = {
        ...additionalParams,
    };

    if (email) params.em = email;
    if (phone) params.ph = phone;

    return trackEvent('Lead', params, eventId);
}

/**
 * Track a Contact event
 * @param additionalParams - Additional event parameters
 * @returns The event ID used
 */
export function trackContact(additionalParams: Record<string, any> = {}): string {
    return trackEvent('Contact', additionalParams);
}

/**
 * Track a ViewContent event
 * @param contentName - Name of the content being viewed
 * @param contentCategory - Category of the content
 * @param additionalParams - Additional event parameters
 * @returns The event ID used
 */
export function trackViewContent(
    contentName: string,
    contentCategory?: string,
    additionalParams: Record<string, any> = {}
): string {
    const params: Record<string, any> = {
        content_name: contentName,
        ...additionalParams,
    };

    if (contentCategory) {
        params.content_category = contentCategory;
    }

    return trackEvent('ViewContent', params);
}

/**
 * Track an InitiateCheckout event
 * @param value - Value of the checkout
 * @param currency - Currency code (default: 'COP')
 * @param additionalParams - Additional event parameters
 * @returns The event ID used
 */
export function trackInitiateCheckout(
    value?: number,
    currency: string = 'COP',
    additionalParams: Record<string, any> = {}
): string {
    const params: Record<string, any> = {
        currency,
        ...additionalParams,
    };

    if (value) params.value = value;

    return trackEvent('InitiateCheckout', params);
}

/**
 * Track a Purchase event
 * @param value - Purchase value
 * @param currency - Currency code (default: 'COP')
 * @param additionalParams - Additional event parameters
 * @returns The event ID used
 */
export function trackPurchase(
    value: number,
    currency: string = 'COP',
    additionalParams: Record<string, any> = {}
): string {
    return trackEvent('Purchase', {
        value,
        currency,
        ...additionalParams,
    });
}
