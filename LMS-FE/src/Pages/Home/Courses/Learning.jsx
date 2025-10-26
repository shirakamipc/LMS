import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import QuizModal from 'Components/Quiz/QuizModal';
import ProgressTracker from 'Components/Quiz/ProgressTracker';
import { fetchCompleteCourse } from 'Apis/homeApi';

export default function Learning() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const playerRef = useRef(null);
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Quiz and progress state
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [isVideoLocked, setIsVideoLocked] = useState(false);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [quizAttempts, setQuizAttempts] = useState({});
    const [totalWatchTime, setTotalWatchTime] = useState(0);
    const [watchStartTime, setWatchStartTime] = useState(null);
    const [triggeredQuizzes, setTriggeredQuizzes] = useState(new Set());
    const [lastCheckpoint, setLastCheckpoint] = useState(0);

    // Transform API data to match component structure
    const transformCourseData = async (courseSlug) => {
        try {
            // Get complete course data using the service
            const courseData = await fetchCompleteCourse(courseSlug);

            // Transform lessons to match the expected structure
            const chaptersWithLessons = courseData.chapters.map(chapter => ({
                id: chapter.id,
                title: chapter.title,
                lessons: chapter.lessons.map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description,
                    videoId: lesson.videoRef,
                    duration: formatDuration(lesson.durationSeconds),
                    quizzes: lesson.quizzes.map(quiz => ({
                        id: quiz.id,
                        timestamp: quiz.timestampSeconds,
                        question: quiz.questions[0]?.prompt || '',
                        answers: quiz.questions[0]?.options?.map(opt => opt.text) || [],
                        correctAnswer: quiz.questions[0]?.options?.findIndex(opt => opt.isCorrect) || 0,
                        explanation: quiz.questions[0]?.explanation || '',
                        hint: ''
                    }))
                }))
            }));

            // Transform course to match expected structure
            return {
                id: courseData.id,
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description,
                image_url: courseData.imageUrl,
                chapters: chaptersWithLessons
            };
        } catch (error) {
            console.error('Error transforming course data:', error);
            throw error;
        }
    };

    // Helper function to format duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const loadCourseData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Loading course data for slug:', slug);

                const courseData = await transformCourseData(slug);
                console.log('Transformed course data:', courseData);

                if (courseData) {
                    setCourse(courseData);
                    // Set first lesson as default
                    if (courseData.chapters.length > 0 && courseData.chapters[0].lessons.length > 0) {
                        setCurrentLesson(courseData.chapters[0].lessons[0]);
                        setExpandedChapters(new Set([courseData.chapters[0].id]));
                    }
                } else {
                    // Redirect to courses page if course not found
                    console.log('Course not found, redirecting to /courses');
                    navigate('/courses');
                }
            } catch (error) {
                console.error('Error loading course data:', error);
                setError('Failed to load course data');
                // Redirect to courses page on error
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        loadCourseData();
    }, [slug, navigate]);

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    const expandAllChapters = () => {
        if (course) {
            setExpandedChapters(new Set(course.chapters.map(ch => ch.id)));
        }
    };

    const collapseAllChapters = () => {
        setExpandedChapters(new Set());
    };

    // Video progress and quiz handlers
    const handleVideoProgress = (progress) => {
        const currentTime = Math.floor(progress.playedSeconds);

        // Update watch time
        if (watchStartTime) {
            const watchTime = Math.floor((Date.now() - watchStartTime) / 1000);
            setTotalWatchTime(prev => prev + 1);
        }

        // Check for quiz checkpoints
        if (currentLesson && currentLesson.quizzes) {
            currentLesson.quizzes.forEach(quiz => {
                if (
                    currentTime >= quiz.timestamp &&
                    !triggeredQuizzes.has(quiz.id) &&
                    currentTime > lastCheckpoint
                ) {
                    setTriggeredQuizzes(prev => new Set([...prev, quiz.id]));
                    setLastCheckpoint(currentTime);
                    setCurrentQuiz(quiz);
                    setIsVideoLocked(true);
                    setIsQuizModalOpen(true);

                    // Pause the video
                    if (playerRef.current) {
                        playerRef.current.getInternalPlayer().pauseVideo();
                    }
                }
            });
        }
    };

    const handleVideoStart = () => {
        setWatchStartTime(Date.now());
    };

    const handleVideoEnd = () => {
        // Mark lesson as completed
        if (currentLesson) {
            setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
        }
    };

    const handleQuizCorrectAnswer = () => {
        if (currentQuiz) {
            setQuizAttempts(prev => ({
                ...prev,
                [currentQuiz.id]: {
                    correct: true,
                    timestamp: new Date().toISOString(),
                    attempts: (prev[currentQuiz.id]?.attempts || 0) + 1
                }
            }));
        }
        setIsVideoLocked(false);

        // Resume video
        if (playerRef.current) {
            playerRef.current.getInternalPlayer().playVideo();
        }
    };

    const handleQuizWrongAnswer = () => {
        if (currentQuiz) {
            setQuizAttempts(prev => ({
                ...prev,
                [currentQuiz.id]: {
                    correct: false,
                    timestamp: new Date().toISOString(),
                    attempts: (prev[currentQuiz.id]?.attempts || 0) + 1
                }
            }));
        }
    };

    const handleLessonClick = (lesson, chapterId) => {
        setCurrentLesson(lesson);
        // Reset quiz state for new lesson
        setTriggeredQuizzes(new Set());
        setLastCheckpoint(0);
        setIsVideoLocked(false);
        setIsQuizModalOpen(false);
        setCurrentQuiz(null);
        // Expand the chapter containing this lesson
        setExpandedChapters(prev => new Set([...prev, chapterId]));
    };

    if (loading || !course || !currentLesson) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4">
                        {error ? 'Có lỗi xảy ra' : 'Đang tải khóa học...'}
                    </p>
                    {error && (
                        <p className="mt-2 text-red-500 text-sm">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    const allExpanded = course.chapters.length === expandedChapters.size;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Main Content - Video Player (70% on desktop) */}
            <div className="lg:w-[70%] p-4 lg:p-6">
                <div className="bg-black rounded-lg overflow-hidden mb-4 relative">
                    <div className="aspect-video">
                        <ReactPlayer
                            ref={playerRef}
                            url={`https://www.youtube.com/watch?v=${currentLesson.videoId}`}
                            width="100%"
                            height="100%"
                            controls={!isVideoLocked}
                            playing={!isVideoLocked}
                            onProgress={handleVideoProgress}
                            onStart={handleVideoStart}
                            onEnded={handleVideoEnd}
                            progressInterval={1000}
                        />

                        {/* Video Lock Overlay */}
                        {isVideoLocked && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <p className="text-lg font-medium">Video đã bị tạm dừng</p>
                                    <p className="text-sm mt-2">Vui lòng trả lời câu hỏi kiểm tra để tiếp tục</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson Description */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                    <p className="text-gray-600 mb-4">{currentLesson.description}</p>

                    {/* Course Info */}
                    <div className="border-t pt-4">
                        <h2 className="text-lg font-semibold mb-3">Về khóa học</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span>{course.chapters.length} chương</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>{totalLessons} bài học</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Lesson List (30% on desktop) */}
            <div className="lg:w-[30%] bg-gray-50 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l">
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Nội dung khóa học</h2>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{course.chapters.length} chương • {totalLessons} bài học</span>
                        <button
                            onClick={allExpanded ? collapseAllChapters : expandAllChapters}
                            className="text-orange-500 hover:text-orange-600 font-medium"
                        >
                            {allExpanded ? 'Thu nhỏ' : 'Mở rộng'}
                        </button>
                    </div>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {course.chapters.map((chapter) => (
                        <div key={chapter.id} className="bg-white rounded-lg">
                            <button
                                onClick={() => toggleChapter(chapter.id)}
                                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <span className="font-medium">{chapter.title}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">{chapter.lessons.length} bài</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-4 w-4 transform transition-transform ${expandedChapters.has(chapter.id) ? 'rotate-90' : ''}`}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>

                            {expandedChapters.has(chapter.id) && (
                                <div className="border-t">
                                    {chapter.lessons.map((lesson) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => handleLessonClick(lesson, chapter.id)}
                                            className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors ${currentLesson.id === lesson.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <p className={`text-sm ${currentLesson.id === lesson.id ? 'font-medium text-orange-600' : 'text-gray-700'}`}>
                                                    {lesson.title}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Progress Tracker */}
                <div className="mt-6">
                    <ProgressTracker
                        course={course}
                        currentLesson={currentLesson}
                        completedLessons={completedLessons}
                        quizAttempts={quizAttempts}
                        totalWatchTime={totalWatchTime}
                    />
                </div>
            </div>

            {/* Quiz Modal */}
            <QuizModal
                quiz={currentQuiz}
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                onCorrectAnswer={handleQuizCorrectAnswer}
                onWrongAnswer={handleQuizWrongAnswer}
                isVideoLocked={isVideoLocked}
            />
        </div>
    );
}
