import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PoemInput from "../components/core/PoemInput";
import StyleSelector from "../components/core/StyleSelector";
import ImageRatio from "../components/core/ImageRatio";
import AllSelect from "../components/core/AllSelect";
const Home = () => {

  return (
    <div className="home px-5 py-2">
      <Header />

      <main className="container">
        <h1 className="display-3 my-5 text-center">诗词成画，意境自现</h1>

        <AllSelect />

      </main>

      <Footer />
    </div>
  )
}

export default Home;