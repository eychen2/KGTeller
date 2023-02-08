import React from 'react'
import 'bootstrap';
import '../App.css'
import '../assets/remixicon/remixicon.css'
const Home = () =>{
    return(
             <section id="hero" class="d-flex align-items-center">
                <div class="container position-relative" data-aos="fade-up" data-aos-delay="100">
                    <div class="row justify-content-center">
                        <div class="col-xl-7 col-lg-9 text-center">
                          <h1>KGTeller</h1>
                          <h2>A Knowledge Graph-to-Text Assistant</h2>
                        </div>
                    </div>
                </div>
           
        
        <div class="row icon-boxes">
        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-5" data-aos="zoom-in" data-aos-delay="200">
          <div class="icon-box">
            <div class="icon"><i class="ri-pencil-line"></i></div>
            <h4 class="title">Annotate</h4>
            <p class="description">Easily annotate knowledge graph-to-text datasets by creating new datasets or importing and modifying existing datasets.</p>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-5" data-aos="zoom-in" data-aos-delay="300">
          <div class="icon-box">
            <div class="icon"><i class="ri-guide-line"></i></div>
            <h4 class="title">Visualize</h4>
            <p class="description">Visualize your dataset's knowledge graphs and their corresonding narratives to quickly find matching components.</p>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-5" data-aos="zoom-in" data-aos-delay="400">
          <div class="icon-box">
            <div class="icon"><i class="ri-draft-line"></i></div>
            <h4 class="title">Generate</h4>
            <p class="description">Generate text using various generative models on existing knowledge graph data or data created from our annotation tool.</p>
          </div>
        </div>
      </div>
         </section>
          
        
    );
}
export default Home;