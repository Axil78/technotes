import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://technotes-api-1-iqy5.onrender.com',  // Backend URL
    credentials: 'include',  // Include cookies (cookies, authorization tokens)
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token  // Get token from redux store

        if (token) {
            headers.set("authorization", `Bearer ${token}`)  // Add token to authorization header
        }

        return headers  // Return the headers object
    },
    // The backend server should ensure that it sends the appropriate CORS headers.
    // The backend must include "Access-Control-Allow-Origin" and other relevant headers.
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    // If access is forbidden (403), attempt to refresh the token
    if (result?.error?.status === 403) {
        console.log('Sending refresh token')

        // Send the refresh request to get a new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            // Store the new token in the redux store
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // Retry the original query with the new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult  // Return the error if refresh fails
        }
    }

    return result  // Return the final result (with or without a new token)
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,  // Use the base query with refresh logic
    tagTypes: ['Note', 'User'],  // Define the types of tags (for cache management)
    endpoints: builder => ({
        // Define your API endpoints here (e.g., 'getNotes', 'createUser', etc.)
    })
})

