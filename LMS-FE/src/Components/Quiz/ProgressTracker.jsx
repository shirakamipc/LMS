import React from 'react';
import { CheckCircleIcon, ClockIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function ProgressTracker({
    course,
    currentLesson,
    completedLessons,
    quizAttempts,
    totalWatchTime
}) {
    const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    const completedCount = completedLessons.size;
    const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    // Format time from seconds to HH:MM:SS
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const getLessonStatus = (lessonId) => {
        if (completedLessons.has(lessonId)) {
            return 'completed';
        }
        if (currentLesson && currentLesson.id === lessonId) {
            return 'current';
        }
        return 'locked';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
            case 'current':
                return <PlayIcon className="w-4 h-4 text-blue-600" />;
            default:
                return <ClockIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'current':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Tiến độ học tập</h3>

            {/* Overall Progress */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Hoàn thành khóa học
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                        {completedCount}/{totalLessons} bài học
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {progressPercentage.toFixed(1)}% hoàn thành
                </p>
            </div>

            {/* Statistics */}


            {/* Chapter Progress */}

            {/* Recent Quiz Attempts */}
            {Object.keys(quizAttempts).length > 0 && (
                <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Lịch sử câu hỏi</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {Object.entries(quizAttempts)
                            .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp))
                            .slice(0, 5)
                            .map(([quizId, attempt]) => (
                                <div key={quizId} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600 truncate flex-1">
                                        Quiz {quizId}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${attempt.correct ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {attempt.correct ? 'Đúng' : 'Sai'}
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(attempt.timestamp).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
