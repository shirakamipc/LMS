import ListCourse from 'Components/Courses';
import { fetchLearningPaths } from 'Apis/homeApi';
import React, { useState, useEffect } from 'react';
export default function Courses() {
  const [listCourse, setListCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Courses component: useEffect is running.");
    const getLearningPaths = async () => {
      console.log("Courses component: getLearningPaths function called.");
      try {
        setLoading(true);
        console.log("Courses component: Calling fetchLearningPaths...");
        const paths = await fetchLearningPaths();
        console.log("Courses component: fetchLearningPaths successful, data:", paths);
        setListCourse(paths);
      } catch (error) {
        console.error('Courses component: Failed to fetch learning paths:', error);
        // Optionally, set an error state to show a message to the user
      } finally {
        console.log("Courses component: setLoading to false.");
        setLoading(false);
      }
    };

    getLearningPaths();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <main className='lg:px-6'>
      <h1 className='text-3xl font-extrabold mb-6'>Khóa học</h1>
      <p className='mb-4 lg:mb-12'>Các khóa học được thiết kế phù hợp cho cả người mới, miễn phí, nội dung dễ hiểu.</p>
      {listCourse.map((val, index) => (
        <ListCourse key={index} lessons={val.courses} title={val.title} />
      ))}
      <section className='flex justify-between items-center'>
        <div className='w-10/12 md:max-w-[400px] py-7'>
          <h1 className='text-2xl font-extrabold mb-4'>Bạn đang tìm kiếm lộ trình học cho người mới?</h1>
          <p className='text-sm text-justify mb-4'>
            Các khóa học được thiết kế phù hợp cho người mới, lộ trình học rõ ràng, nội dung dễ hiểu.
          </p>
          <button className='py-2 px-5 rounded-full border-2 border-black'>Xem lộ trình</button>
        </div>
        <div className='hidden md:block'>
          <img
            className='max-w-[420px] w-full'
            src=''
            alt='Learning Path'
          />
        </div>
      </section>
    </main>
  );
}
