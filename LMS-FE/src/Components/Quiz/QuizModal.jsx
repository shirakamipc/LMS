import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function QuizModal({
    quiz,
    isOpen,
    onClose,
    onCorrectAnswer,
    onWrongAnswer,
    isVideoLocked
}) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
            setAttempts(0);
        }
    }, [isOpen, quiz]);

    const handleSubmit = () => {
        if (selectedAnswer === null || selectedAnswer === undefined) return;

        const correct = selectedAnswer === quiz.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);
        setAttempts(prev => prev + 1);

        if (correct) {
            setTimeout(() => {
                onCorrectAnswer();
                onClose();
            }, 1500);
        } else {
            onWrongAnswer();
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setShowResult(false);
    };

    if (!isOpen || !quiz) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-3">
                        {isVideoLocked && (
                            <div className="bg-red-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        )}
                        <h2 className="text-xl font-bold">Câu hỏi kiểm tra</h2>
                    </div>
                    {!isVideoLocked && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Question */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">{quiz.question}</h3>
                        {quiz.explanation && (
                            <p className="text-sm text-gray-600">{quiz.explanation}</p>
                        )}
                    </div>

                    {/* Answers */}
                    <div className="space-y-3 mb-6">
                        {quiz.answers.map((answer, index) => {
                            const isCorrectAnswer = index === quiz.correctAnswer;
                            const isSelected = index === selectedAnswer;

                            return (
                                <button
                                    key={index}
                                    onClick={() => !showResult && setSelectedAnswer(index)}
                                    disabled={showResult}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showResult
                                        ? isCorrectAnswer
                                            ? 'border-green-500 bg-green-50'
                                            : isSelected
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 bg-gray-50'
                                        : isSelected
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        } ${!showResult && 'cursor-pointer'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${showResult && isCorrectAnswer ? 'text-green-700' :
                                            showResult && isSelected && !isCorrectAnswer ? 'text-red-700' :
                                                'text-gray-700'
                                            }`}>
                                            {answer}
                                        </span>
                                        {showResult && (
                                            <div>
                                                {isCorrectAnswer ? (
                                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                ) : isSelected ? (
                                                    <XCircleIcon className="w-5 h-5 text-red-600" />
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback */}
                    {showResult && !isCorrect && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 font-medium mb-2">Câu trả lời chưa chính xác!</p>
                            {quiz.hint && (
                                <p className="text-red-700 text-sm">Gợi ý: {quiz.hint}</p>
                            )}
                            {attempts >= 2 && (
                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <p className="text-yellow-800 text-sm">
                                        <strong>Đáp án đúng:</strong> {quiz.answers[quiz.correctAnswer]}
                                    </p>
                                    {quiz.explanation && (
                                        <p className="text-yellow-700 text-sm mt-1">{quiz.explanation}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {showResult && isCorrect && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium mb-2">Chính xác! Tuyệt vời! 🎉</p>
                            {quiz.explanation && (
                                <p className="text-green-700 text-sm">{quiz.explanation}</p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {showResult && !isCorrect && (
                            <button
                                onClick={handleRetry}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Thử lại
                            </button>
                        )}

                        {!showResult && (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null || selectedAnswer === undefined}
                                className={`flex-1 py-3 px-6 rounded-lg transition-colors font-medium ${selectedAnswer !== null && selectedAnswer !== undefined
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Gửi câu trả lời
                            </button>
                        )}
                    </div>

                    {/* Progress indicator */}
                    {isVideoLocked && (
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p>Bạn cần trả lời đúng câu hỏi này để tiếp tục xem video</p>
                            {attempts > 0 && (
                                <p className="text-orange-600 mt-1">Số lần thử: {attempts}/3</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
