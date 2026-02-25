// API Base URL - uses relative paths for Vercel, can be overridden for local dev
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const text = await response.text();
        let data;

        if (!text) {
            throw new Error('Server returned an empty response');
        }

        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('Unable to reach the server. Please try again later.');
        }

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// =====================================================
// WORKOUTS API
// =====================================================
export async function getWorkouts() {
    const response = await fetchApi('/workouts');
    return response.data;
}

export async function getWorkoutById(id) {
    const response = await fetchApi(`/workouts/${id}`);
    return response.data;
}

// =====================================================
// RECIPES API
// =====================================================
export async function getRecipes(filter = 'all') {
    const response = await fetchApi(`/recipes?filter=${filter}`);
    return response.data;
}

export async function getRecipeById(id) {
    const response = await fetchApi(`/recipes/${id}`);
    return response.data;
}

// =====================================================
// CHALLENGES API
// =====================================================
export async function getChallenges() {
    const response = await fetchApi('/challenges');
    return response.data;
}

export async function joinChallenge(challengeId) {
    const response = await fetchApi(`/challenges/${challengeId}/join`, {
        method: 'POST',
    });
    return response.data;
}

// =====================================================
// COMMUNITY FEED API
// =====================================================
export async function getFeed(limit = 20) {
    const response = await fetchApi(`/feed?limit=${limit}`);
    return response.data;
}

export async function likeActivity(activityId) {
    const response = await fetchApi(`/feed/${activityId}/like`, {
        method: 'POST',
    });
    return response.data;
}

// =====================================================
// LEADERBOARD API
// =====================================================
export async function getLeaderboard(limit = 10) {
    const response = await fetchApi(`/leaderboard?limit=${limit}`);
    return response.data;
}

// =====================================================
// USER API
// =====================================================
export async function getUserProfile() {
    const response = await fetchApi('/user/profile');
    return response.data;
}

export async function updateUserProfile(data) {
    const response = await fetchApi('/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    return response.data;
}

// =====================================================
// PLAN API
// =====================================================
export async function getPlannedItems(date) {
    const response = await fetchApi(`/user/plan?date=${date}`);
    return response.data;
}

export async function addPlannedItem(item) {
    const response = await fetchApi('/user/plan', {
        method: 'POST',
        body: JSON.stringify(item),
    });
    return response.data;
}

export async function completePlannedItem(itemId) {
    const response = await fetchApi(`/user/plan/${itemId}/complete`, {
        method: 'POST',
    });
    return response.data;
}
