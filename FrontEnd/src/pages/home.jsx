import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AllSelect from "../components/core/AllSelect";
import ImageDisplay from "../components/core/ImageDisplay";
const Home = () => {

  return (
    <div className="home px-5 py-2">
      <Header />

      <main className="container">
        <h1 className="display-3 my-5 text-center">诗词成画，意境自现</h1>

        <AllSelect />

        <ImageDisplay />
      </main>

      <Footer />
    </div>
  )
}

export default Home;