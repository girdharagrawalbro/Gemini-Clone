import { apiClient } from '../supabaseClient';

export const getConversations = async (userId) => {
    try {
        const response = await apiClient.get('/conversations');
        const data = response.data || [];
        // Normalize conversation id field (backend might return _id)
        const normalized = data.map(conv => ({
            ...conv,
            id: conv.id || conv._id || (conv._id && conv._id.toString())
        }));

        // Filter out any malformed conversations and warn
        const valid = normalized.filter(c => c.id);
        if (valid.length !== normalized.length) {
            console.warn('Filtered out malformed conversations:', normalized.filter(c => !c.id));
        }

        return valid;
    } catch (error) {
        console.error('Get conversations error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const createConversation = async (userId, title = 'New Chat') => {
    try {
        const response = await apiClient.post('/conversations', { title });
        const conv = response.data;
        if (!conv) return conv;
        return {
            ...conv,
            id: conv.id || conv._id || (conv._id && conv._id.toString())
        };
    } catch (error) {
        console.error('Create conversation error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const updateConversationTitle = async (conversationId, newTitle) => {
    try {
        await apiClient.put(`/conversations/${conversationId}`, { title: newTitle });
    } catch (error) {
        console.error('Update conversation error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const deleteConversation = async (conversationId) => {
    try {
        await apiClient.delete(`/conversations/${conversationId}`);
    } catch (error) {
        console.error('Delete conversation error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const getMessages = async (conversationId) => {
    try {
        if (!conversationId) {
            throw new Error('Invalid conversation id');
        }
        const response = await apiClient.get(`/conversations/${conversationId}/messages`);
        const data = response.data || [];
        // Normalize messages to frontend shape: { _id, sender, text, timestamp }
        return data.map(m => ({
            _id: m._id || m.id || (m.id && m.id.toString()),
            sender: (m.role === 'user' || m.sender === 'You') ? 'You' : 'Gemini',
            text: m.content ?? m.text ?? '',
            timestamp: m.timestamp ?? m.createdAt ?? m.time ?? null,
            // preserve raw fields if needed
            raw: m
        }));
    } catch (error) {
        console.error('Get messages error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const addMessage = async (conversationId, messageData) => {
    try {
        // If no conversationId provided, create a new conversation first
        let convId = conversationId;
        if (!convId) {
            const conv = await createConversation(null, 'New Chat');
            convId = conv._id || conv.id || conv;
        }

        // Transform messageData from frontend shape to API shape
        const payload = {
            role: (messageData.sender === 'You' || messageData.role === 'user') ? 'user' : 'assistant',
            content: messageData.text ?? messageData.content ?? '',
        };

        // If timestamp present, include it (backend will default if missing)
        if (messageData.timestamp) payload.timestamp = messageData.timestamp;

        // If image is a base64 string or URL, include it as image field; if it's a File, skip (could be implemented later)
        if (messageData.image) {
            if (typeof messageData.image === 'string') {
                payload.image = messageData.image;
            } else if (messageData.image instanceof File) {
                // Optional: convert File to base64 synchronously isn't possible here; skip for now
                // The app will still function with text messages; saving images can be implemented later
            }
        }

        const response = await apiClient.post(`/conversations/${convId}/messages`, payload);
        const m = response.data;
        if (!m) return m;
        return {
            _id: m._id || m.id || (m.id && m.id.toString()),
            sender: (m.role === 'user') ? 'You' : 'Gemini',
            text: m.content ?? m.text ?? '',
            timestamp: m.timestamp ?? m.createdAt ?? null,
            raw: m
        };
    } catch (error) {
        console.error('Add message error:', error);
        throw error.response?.data?.error || error.message;
    }
};

export const updateConversationTimestamp = async (conversationId) => {
    // This is handled automatically by the backend when adding messages
    // No need for explicit API call
    return Promise.resolve();
};
