import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const [user1, user2] = await Promise.all([
        prisma.user.upsert({
            where: { email: 'john@example.com' },
            update: {},
            create: {
                email: 'john@example.com',
                fullName: 'John Doe',
                passwordHash: 'somehash',
            },
        }),
        prisma.user.upsert({
            where: { email: 'jane@example.com' },
            update: {},
            create: {
                email: 'jane@example.com',
                fullName: 'Jane Smith',
                passwordHash: 'somehash',
            },
        }),
    ]);

    const frontendPath = await prisma.learningPath.upsert({
        where: { slug: 'front-end-development' },
        update: {},
        create: {
            title: 'Lộ trình học Front-end',
            slug: 'front-end-development',
            imageUrl:
                'https://files.fullstack.edu.vn/f8-prod/learning-paths/2/61a0439062b82.png',
        },
    });

    const backendPath = await prisma.learningPath.upsert({
        where: { slug: 'back-end-development' },
        update: {},
        create: {
            title: 'Lộ trình học Back-end',
            slug: 'back-end-development',
            imageUrl:
                'https://files.fullstack.edu.vn/f8-prod/learning-paths/3/61a0439cc779b.png',
        },
    });
    // Create courses with proper learning path associations
    const course1 = await prisma.course.upsert({
        where: { slug: 'javascript-co-ban' },
        update: {},
        create: {
            learningPathId: frontendPath.id,
            title: 'Lập Trình JavaScript Cơ Bản',
            slug: 'javascript-co-ban',
            description:
                'Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.',
            imageUrl: 'https://files.fullstack.edu.vn/f8-prod/courses/1.png',
            price: 0,
            isPro: false,
            isPublished: true,
        },
    });

    const course2 = await prisma.course.upsert({
        where: { slug: 'html-css' },
        update: {},
        create: {
            learningPathId: frontendPath.id,
            title: 'HTML, CSS từ Zero đến Hero',
            slug: 'html-css',
            description:
                'Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee.',
            imageUrl: 'https://files.fullstack.edu.vn/f8-prod/courses/2.png',
            price: 0,
            isPro: false,
            isPublished: true,
        },
    });

    const course3 = await prisma.course.upsert({
        where: { slug: 'reactjs' },
        update: {},
        create: {
            learningPathId: frontendPath.id,
            title: 'Xây Dựng Website với ReactJS',
            slug: 'reactjs',
            description:
                'Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.',
            imageUrl: 'https://files.fullstack.edu.vn/f8-prod/courses/13/13.png',
            price: 0,
            isPro: false,
            isPublished: true,
        },
    });

    const course4 = await prisma.course.upsert({
        where: { slug: 'nodejs' },
        update: {},
        create: {
            learningPathId: backendPath.id,
            title: 'Node & ExpressJS',
            slug: 'nodejs',
            description:
                'Học Back-end với Node & ExpressJS framework, hiểu các khái niệm khi làm Back-end và xây dựng RESTful API cho trang web.',
            imageUrl: 'https://files.fullstack.edu.vn/f8-prod/courses/6.png',
            price: 0,
            isPro: false,
            isPublished: true,
        },
    });

    const course5 = await prisma.course.upsert({
        where: { slug: 'lessons-for-newbie' },
        update: {},
        create: {
            learningPathId: frontendPath.id,
            title: 'Kiến Thức Nhập Môn IT',
            slug: 'lessons-for-newbie',
            description:
                'Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.',
            imageUrl: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
            price: 0,
            isPro: false,
            isPublished: true,
        },
    });

    const lessonsData = {
        'lessons-for-newbie': {
            id: 7,
            title: 'Kiến Thức Nhập Môn IT',
            slug: 'lessons-for-newbie',
            description:
                'Để có cái nhìn tổng quan về ngành IT - Lập trình web các bạn nên xem các videos tại khóa này trước nhé.',
            image_url: 'https://files.fullstack.edu.vn/f8-prod/courses/7.png',
            chapters: [
                {
                    id: 1,
                    title: 'Chương 1: Giới thiệu về ngành IT',
                    lessons: [
                        {
                            id: 1,
                            title: '1. Mô hình Client - Server là gì?',
                            duration: '11:35',
                            videoId: 'M62l1xA5Eu8',
                            description:
                                'Tìm hiểu về mô hình Client - Server trong lập trình web',
                            quizzes: [
                                {
                                    id: 'client-server-quiz-1',
                                    timestamp: 180, // 3 minutes
                                    question:
                                        'Trong mô hình Client-Server, đâu là vai trò chính của Client?',
                                    answers: [
                                        'Lưu trữ và xử lý dữ liệu',
                                        'Gửi yêu cầu và nhận phản hồi',
                                        'Quản lý kết nối mạng',
                                        'Phân tích dữ liệu người dùng',
                                    ],
                                    correctAnswer: 1,
                                    explanation:
                                        'Client đóng vai trò gửi yêu cầu (requests) đến Server và nhận phản hồi (responses) từ Server.',
                                    hint: 'Hãy nghĩ về trình duyệt của bạn khi bạn truy cập một trang web.',
                                },
                            ],
                        },
                        {
                            id: 2,
                            title: '2. HTTP và HTTPS là gì?',
                            duration: '15:20',
                            videoId: 'R6plN3FvzFY',
                            description: 'Hiểu về giao thức HTTP và HTTPS',
                            quizzes: [
                                {
                                    id: 'http-https-quiz-1',
                                    timestamp: 120, // 2 minutes
                                    question: 'HTTPS có gì khác biệt so với HTTP?',
                                    answers: [
                                        'Nhanh hơn HTTP',
                                        'Có thêm lớp bảo mật SSL/TLS',
                                        'Sử dụng ít băng thông hơn',
                                        'Chỉ hoạt động trên mobile',
                                    ],
                                    correctAnswer: 1,
                                    explanation:
                                        'HTTPS sử dụng SSL/TLS để mã hóa dữ liệu truyền giữa client và server, cung cấp bảo mật tốt hơn.',
                                    hint: 'Hãy nghĩ về biểu tượng ổ khóa trên trình duyệt.',
                                },
                                {
                                    id: 'http-https-quiz-2',
                                    timestamp: 240, // 4 minutes
                                    question: 'Port mặc định của HTTPS là gì?',
                                    answers: ['80', '443', '8080', '3000'],
                                    correctAnswer: 1,
                                    explanation:
                                        'HTTPS sử dụng port 443 làm port mặc định, trong khi HTTP sử dụng port 80.',
                                    hint: 'Hãy nghĩ về các port phổ biến cho web.',
                                },
                            ],
                        },
                        {
                            id: 3,
                            title: '3. Domain, Hosting và IP Address',
                            duration: '18:45',
                            videoId: '0SJE9dYdpps',
                            description: 'Tìm hiểu về tên miền, hosting và địa chỉ IP',
                        },
                    ],
                },
                {
                    id: 2,
                    title: 'Chương 2: Lập trình web cơ bản',
                    lessons: [
                        {
                            id: 4,
                            title: '4. Front-end là gì?',
                            duration: '12:30',
                            videoId: 'MGhw6XliFgo',
                            description: 'Giới thiệu về lập trình front-end',
                        },
                        {
                            id: 5,
                            title: '5. Back-end là gì?',
                            duration: '14:15',
                            videoId: 'x0fSBAgBrOQ',
                            description: 'Giới thiệu về lập trình back-end',
                        },
                        {
                            id: 6,
                            title: '6. Database là gì?',
                            duration: '16:40',
                            videoId: 'uz5LIP85J5Y',
                            description: 'Tìm hiểu về cơ sở dữ liệu',
                        },
                    ],
                },
            ],
        },
        'html-css': {
            id: 2,
            title: 'HTML, CSS từ Zero đến Hero',
            slug: 'html-css',
            description:
                'Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee.',
            image_url: 'https://files.fullstack.edu.vn/f8-prod/courses/2.png',
            chapters: [
                {
                    id: 1,
                    title: 'Chương 1: HTML cơ bản',
                    lessons: [
                        {
                            id: 1,
                            title: '1. Giới thiệu HTML',
                            duration: '10:15',
                            videoId: 'R6plN3FvzFY',
                            description: 'Giới thiệu về HTML và cấu trúc cơ bản',
                        },
                        {
                            id: 2,
                            title: '2. Các thẻ HTML cơ bản',
                            duration: '20:30',
                            videoId: '0SJE9dYdpps',
                            description: 'Học về các thẻ HTML thông dụng',
                        },
                        {
                            id: 3,
                            title: '3. Form trong HTML',
                            duration: '25:45',
                            videoId: 'MGhw6XliFgo',
                            description: 'Tạo form với các thẻ HTML',
                        },
                    ],
                },
                {
                    id: 2,
                    title: 'Chương 2: CSS cơ bản',
                    lessons: [
                        {
                            id: 4,
                            title: '4. Giới thiệu CSS',
                            duration: '15:20',
                            videoId: 'x0fSBAgBrOQ',
                            description: 'Giới thiệu về CSS và cách hoạt động',
                        },
                        {
                            id: 5,
                            title: '5. Selectors trong CSS',
                            duration: '18:30',
                            videoId: 'uz5LIP85J5Y',
                            description: 'Học về các loại selector trong CSS',
                        },
                        {
                            id: 6,
                            title: '6. Box Model',
                            duration: '22:15',
                            videoId: 'M62l1xA5Eu8',
                            description: 'Hiểu về box model trong CSS',
                        },
                    ],
                },
            ],
        },
        'javascript-co-ban': {
            id: 1,
            title: 'Lập Trình JavaScript Cơ Bản',
            slug: 'javascript-co-ban',
            description:
                'Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.',
            image_url: 'https://files.fullstack.edu.vn/f8-prod/courses/1.png',
            chapters: [
                {
                    id: 1,
                    title: 'Chương 1: JavaScript cơ bản',
                    lessons: [
                        {
                            id: 1,
                            title: '1. Giới thiệu JavaScript',
                            duration: '12:45',
                            videoId: '0SJE9dYdpps',
                            description: 'Giới thiệu về JavaScript và lịch sử phát triển',
                        },
                        {
                            id: 2,
                            title: '2. Biến và kiểu dữ liệu',
                            duration: '18:20',
                            videoId: 'MGhw6XliFgo',
                            description: 'Học về biến và các kiểu dữ liệu trong JS',
                        },
                        {
                            id: 3,
                            title: '3. Toán tử và biểu thức',
                            duration: '15:30',
                            videoId: 'x0fSBAgBrOQ',
                            description: 'Các toán tử và cách sử dụng biểu thức',
                        },
                    ],
                },
                {
                    id: 2,
                    title: 'Chương 2: Control Flow',
                    lessons: [
                        {
                            id: 4,
                            title: '4. Câu lệnh điều kiện if-else',
                            duration: '14:15',
                            videoId: 'uz5LIP85J5Y',
                            description: 'Sử dụng câu lệnh điều kiện trong JavaScript',
                        },
                        {
                            id: 5,
                            title: '5. Vòng lặp for',
                            duration: '16:40',
                            videoId: 'M62l1xA5Eu8',
                            description: 'Học về vòng lặp for và các biến thể',
                        },
                        {
                            id: 6,
                            title: '6. Vòng lặp while và do-while',
                            duration: '13:25',
                            videoId: 'R6plN3FvzFY',
                            description: 'Sử dụng vòng lặp while và do-while',
                        },
                    ],
                },
            ],
        },
        reactjs: {
            id: 13,
            title: 'Xây Dựng Website với ReactJS',
            slug: 'reactjs',
            description:
                'Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.',
            image_url: 'https://files.fullstack.edu.vn/f8-prod/courses/13/13.png',
            chapters: [
                {
                    id: 1,
                    title: 'Chương 1: ReactJS cơ bản',
                    lessons: [
                        {
                            id: 1,
                            title: '1. Giới thiệu ReactJS',
                            duration: '15:30',
                            videoId: 'x0fSBAgBrOQ',
                            description: 'Giới thiệu về ReactJS và các khái niệm cơ bản',
                        },
                        {
                            id: 2,
                            title: '2. JSX và Components',
                            duration: '20:15',
                            videoId: 'M62l1xA5Eu8',
                            description: 'Học về JSX và cách tạo Components',
                        },
                        {
                            id: 3,
                            title: '3. Props và State',
                            duration: '18:45',
                            videoId: 'R6plN3FvzFY',
                            description: 'Hiểu về Props và State trong React',
                        },
                    ],
                },
                {
                    id: 2,
                    title: 'Chương 2: React Hooks',
                    lessons: [
                        {
                            id: 4,
                            title: '4. useState Hook',
                            duration: '16:20',
                            videoId: '0SJE9dYdpps',
                            description: 'Sử dụng useState để quản lý state',
                        },
                        {
                            id: 5,
                            title: '5. useEffect Hook',
                            duration: '19:30',
                            videoId: 'MGhw6XliFgo',
                            description: 'Sử dụng useEffect cho side effects',
                        },
                        {
                            id: 6,
                            title: '6. Custom Hooks',
                            duration: '22:10',
                            videoId: 'uz5LIP85J5Y',
                            description: 'Tạo và sử dụng custom hooks',
                        },
                    ],
                },
            ],
        },
        nodejs: {
            id: 6,
            title: 'Node & ExpressJS',
            slug: 'nodejs',
            description:
                'Học Back-end với Node & ExpressJS framework, hiểu các khái niệm khi làm Back-end và xây dựng RESTful API cho trang web.',
            image_url: 'https://files.fullstack.edu.vn/f8-prod/courses/6.png',
            chapters: [
                {
                    id: 1,
                    title: 'Chương 1: Node.js cơ bản',
                    lessons: [
                        {
                            id: 1,
                            title: '1. Giới thiệu Node.js',
                            duration: '14:20',
                            videoId: 'z2f7RHgvddc',
                            description: 'Giới thiệu về Node.js và cách hoạt động',
                        },
                        {
                            id: 2,
                            title: '2. Modules và require',
                            duration: '17:35',
                            videoId: 'M62l1xA5Eu8',
                            description: 'Học về module system trong Node.js',
                        },
                        {
                            id: 3,
                            title: '3. File System',
                            duration: '20:15',
                            videoId: 'R6plN3FvzFY',
                            description: 'Làm việc với files và directories',
                        },
                    ],
                },
                {
                    id: 2,
                    title: 'Chương 2: ExpressJS Framework',
                    lessons: [
                        {
                            id: 4,
                            title: '4. Giới thiệu ExpressJS',
                            duration: '16:45',
                            videoId: '0SJE9dYdpps',
                            description: 'Tìm hiểu về ExpressJS framework',
                        },
                        {
                            id: 5,
                            title: '5. Routing và Middleware',
                            duration: '19:20',
                            videoId: 'MGhw6XliFgo',
                            description: 'Xây dựng routing và middleware',
                        },
                        {
                            id: 6,
                            title: '6. RESTful API',
                            duration: '23:10',
                            videoId: 'x0fSBAgBrOQ',
                            description: 'Xây dựng RESTful API với Express',
                        },
                    ],
                },
            ],
        },
    };

    function durationToSeconds(duration: string): number {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    // Get existing courses for reference
    const existingCourses = {
        'lessons-for-newbie': course5,
        'html-css': course2,
        'javascript-co-ban': course1,
        reactjs: course3,
        nodejs: course4,
    };

    for (const [courseSlug, courseData] of Object.entries(lessonsData)) {
        const course = existingCourses[courseSlug as keyof typeof existingCourses];

        for (const [chapterIndex, chapterData] of courseData.chapters.entries()) {
            const chapter = await prisma.chapter.create({
                data: {
                    courseId: course.id,
                    title: chapterData.title,
                    position: chapterIndex + 1,
                },
            });

            for (const [lessonIndex, lessonData] of chapterData.lessons.entries()) {
                const lesson = await prisma.lesson.create({
                    data: {
                        chapterId: chapter.id,
                        title: lessonData.title,
                        description: lessonData.description,
                        videoProvider: 'youtube',
                        videoRef: lessonData.videoId,
                        durationSeconds: durationToSeconds(lessonData.duration),
                        position: lessonIndex + 1,
                    },
                });

                if (
                    'quizzes' in lessonData &&
                    lessonData.quizzes &&
                    Array.isArray(lessonData.quizzes)
                ) {
                    for (const quizData of lessonData.quizzes) {
                        const quiz = await prisma.quiz.create({
                            data: {
                                lessonId: lesson.id,
                                title: quizData.question,
                                timestampSeconds: quizData.timestamp,
                            },
                        });

                        const question = await prisma.quizQuestion.create({
                            data: {
                                quizId: quiz.id,
                                prompt: quizData.question,
                                explanation: quizData.explanation,
                            },
                        });

                        for (const [optionIndex, answer] of quizData.answers.entries()) {
                            await prisma.quizOption.create({
                                data: {
                                    questionId: question.id,
                                    text: answer,
                                    isCorrect: optionIndex === quizData.correctAnswer,
                                },
                            });
                        }
                    }
                }
            }
        }
    }
    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
