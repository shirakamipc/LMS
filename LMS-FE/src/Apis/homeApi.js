import apiClient from './apiClient';

/**
 * Fetches all learning paths with their associated courses.
 * Corresponds to GET /learning-paths on the backend.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of learning paths.
 */
export const fetchLearningPaths = async () => {
    try {
        const response = await apiClient.get('/learning-paths');
        return response.data; // Assuming the API returns the array of learning paths directly
    } catch (error) {
        console.error('Error fetching learning paths:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

/**
 * Fetches a list of trending posts.
 * Corresponds to GET /posts/all?order=desc&limit=X on the backend.
 * @param {number} limit - The number of trending posts to fetch.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of trending posts.
 */
export const fetchTrendingPosts = async (limit = 8) => { // Default to 8 as seen in dummy data
    try {
        const response = await apiClient.get('/posts/all', {
            params: {
                order: 'desc', // Assuming 'desc' gives us the most popular/trending
                limit: limit,
            },
        });
        return response.data; // Assuming the API returns the array of posts directly
    } catch (error) {
        console.error('Error fetching trending posts:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

/**
 * Fetches slider data.
 * NOTE: This endpoint does not exist yet on the backend.
 * This function is a placeholder and will need to be updated
 * once the backend endpoint for sliders is created.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of slider items.
 */
export const fetchSliderData = async () => {
    console.warn('fetchSliderData: Backend endpoint for sliders is not yet implemented.');
    // Placeholder: Return empty array or throw an error until backend is ready
    // For now, we might want to return dummy data or handle this in the component
    // to avoid breaking the UI.
    // return []; 
    // OR
    throw new Error('Slider API endpoint not implemented.');
};

/**
 * Fetches course information by ID.
 * Corresponds to GET /courses/{courseId} on the backend.
 * @param {string|number} courseId - The ID of the course to fetch.
 * @returns {Promise<Object>} A promise that resolves to the course object.
 */
export const fetchCourseById = async (courseId) => {
    try {
        const response = await apiClient.get(`/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        throw error;
    }
};

/**
 * Fetches lessons for a specific chapter.
 * Corresponds to GET /lessons/chapter/{chapterId} on the backend.
 * @param {string} chapterId - The ID of the chapter to fetch lessons for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of lessons.
 */
export const fetchLessonsByChapter = async (chapterId) => {
    try {
        const response = await apiClient.get(`/lessons/chapter/${chapterId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lessons by chapter:', error);
        throw error;
    }
};

/**
 * Fetches a complete course with all chapters and lessons.
 * This is a composite function that fetches course info and all lessons for each chapter.
 * @param {string|number} courseId - The ID of the course to fetch.
 * @returns {Promise<Object>} A promise that resolves to the complete course object with lessons.
 */
export const fetchCompleteCourse = async (courseId) => {
    try {
        // First, fetch the course information
        const courseInfo = await fetchCourseById(courseId);

        // Then, fetch lessons for each chapter
        const chaptersWithLessons = await Promise.all(
            courseInfo.chapters.map(async (chapter) => {
                const lessons = await fetchLessonsByChapter(chapter.id);
                return {
                    ...chapter,
                    lessons: lessons
                };
            })
        );

        // Return the complete course with lessons
        return {
            ...courseInfo,
            chapters: chaptersWithLessons
        };
    } catch (error) {
        console.error('Error fetching complete course:', error);
        throw error;
    }
};

// If you need to fetch individual courses for other parts of the app,
// you can add a function like this:
// /**
//  * Fetches all courses.
//  * Corresponds to GET /courses on the backend.
//  * @returns {Promise<Array<Object>>} A promise that resolves to an array of courses.
//  */
// export const fetchAllCourses = async () => {
//   try {
//     const response = await apiClient.get('/courses');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching all courses:', error);
//     throw error;
//   }
// };
