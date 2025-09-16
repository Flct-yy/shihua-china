import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AllSelect from "../components/core/AllSelect";
import ImageDisplay from "../components/core/ImageDisplay";
import '@/scss/page/home.scss'

const Home = () => {
  // 管理生成的图片列表
  const [generatedImages, setGeneratedImages] = useState([]);

  // 处理图片生成事件
  const handleImageGenerated = (newImage) => {
    // 将新生成的图片添加到列表开头
    setGeneratedImages(prevImages => [newImage, ...prevImages]);
  };

  return (
    <div className="home px-5 py-2">
      <Header />

      <main className="container">
        <h1 className="display-3 my-5 text-center">诗词成画，意境自现</h1>

        <AllSelect onImageGenerated={handleImageGenerated} />

        <ImageDisplay images={generatedImages} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;