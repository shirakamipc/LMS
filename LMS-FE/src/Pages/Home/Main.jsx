import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { trending, slide } from 'Dummy';
import Trending from 'Components/Home/Trending';
import ListCourse from 'Components/Courses';
import { fetchLearningPaths, fetchTrendingPosts, fetchSliderData } from 'Apis/homeApi';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className='h-8 w-8 rounded-full shadow-lg flex justify-center items-center absolute top-1/2 translate-y-[-50%] left-[-14px] cursor-pointer bg-white'
      onClick={onClick}
    >
      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
        <path
          fillRule='evenodd'
          d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className='h-8 w-8 rounded-full shadow-lg flex justify-center items-center absolute top-1/2 translate-y-[-50%] right-[-14px] cursor-pointer z-10 bg-white'
      onClick={onClick}
    >
      <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
        <path
          fillRule='evenodd'
          d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );
}

export default function Main() {
  const [slides, setSlides] = useState([]);
  const [learningPathData, setLearningPathData] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Uncomment when backend endpoint for sliders is ready
        // const sliderResponse = await fetchSliderData();
        // setSlides(sliderResponse);
        // For now, using dummy data for slides
        // setSlides(dummySlide);

        const pathsResponse = await fetchLearningPaths();
        setLearningPathData(pathsResponse);

        const trendingResponse = await fetchTrendingPosts();
        setTrendingPosts(trendingResponse);

      } catch (err) {
        console.error("Failed to fetch home page data:", err);
        setError(err.message || "An error occurred while fetching data.");
        // Optionally, fall back to dummy data or keep previous state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <section className='tuyn-slick mb-14'>
        <Slider {...settings}>
          {slide.map((item, index) => (
            <div key={index}>
              <div
                className='flex justify-between h-[270px] items-center rounded-xl'
                style={{ backgroundImage: `linear-gradient(to right, ${item.bgFrom}, ${item.bgTo})` }}
              >
                <div className='text-white mx-4 md:ml-7 w-[640px]'>
                  <h1 className='capitalize font-bold text-2xl md:text-3xl mb-3'>{item.title}</h1>
                  <p className='text-sm md:text-base mb-3'>{item.description}</p>
                  <button className=' text-sm md:text-base border-2 border-white px-4 py-2 rounded-full'>
                    {item.buttonTile}
                  </button>
                </div>
                <div className='hidden md:block'>
                  <img className='rounded-xl' src={item.image_url} alt='' />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>
      <section className='md:px-4 lg:px-9'>
        <h3 className='text-tuyn-gray text-sm'>201.472+ người khác đã học</h3>
        {
          learningPathData.map((val, index) => <ListCourse key={index} lessons={val.courses} isShow title={val.title} />)
        }
        {/*
        <section>
          <div className='flex justify-between pb-5'>
            <h1 className='text-xl font-extrabold'>Videos nổi bật</h1>
            <p className=' text-orange-600 font-bold'>Xem tất cả</p>
          </div>
          <div className='grid grid-flow-col auto-cols-[60%] snap-x overflow-y-auto md:grid-flow-row md:grid-cols-3 lg:grid-cols-4 gap-6 pb-5'>
            {trending.map((post, index) => (
              <Trending key={index} data={post} />
            ))}
          </div>
        </section>
        */}
      </section >
    </>
  );
}
