import React from 'react'
import 'bootstrap';
import '../App.css'
import '../assets/remixicon/remixicon.css'
const Home = () =>{
    return(
             <section class="d-flex align-items-center">
                <div class="container position-relative" data-aos="fade-up" data-aos-delay="100">
                    <div class="row justify-content-center">
                        <div class="col-xl-7 col-lg-9 text-center">
                          <h2 class="icon">User Guide<i class="ri-questionnaire-line"></i></h2>
                        </div>
                        <div class="col-xl-7 col-lg-9 text-left">
                        <h4> <b> Visualize </b></h4>
                        <h5> <u> About </u> </h5>
                        <p>The <b>Visualize</b> page serves as an assistant in helping users annotate data for knowledge graph-to-text research and related applications. The assistant allows users to import existing data, including existing knowledge graph-to-text datasets, knowledge graph datasets, or simply textual data. The data must be in the correct format. If both knowledge graph and texts are given, the visualize maps entities from both and enables users to modify/add existing knowledge graphs and texts. If only knowledge graphs or only texts are given, the user can then add the missing component. The data can then be saved and ready to use to train knowledge graph to text models for specific domains. Additionally, the knowledge graph related data can be used in the <b> Generate </b> page to automatically generate texts, which can then be corrected using the <b>Visualize</b>. </p>
                        <h5> <u> Data Fields </u> </h5>
                        <ul>
                        <li> <code>Graph_Name</code></li> The title of the instance.
                        <li> <code>keep_triples</code></li> Triples which are contained in the graph and described by the text.
                        <li> <code>narration</code></li> The text which is a narration of the knowledge graph with abstracted entities.
                        <li> <code>entity_ref_dict</code></li> A dictionary of the entities contained in the text/graph. Each key corresponds to the abstracted entity, <i><code>entity_i</code></i>, where <i>i</i> is the number of entity. Each value is then the specified entity.
                        </ul>
                        <h5> <u> Functions </u> </h5>
                        <p>Below are the currently supported functions in <b>Visualize</b> (more to come):</p>
                         <ul>
                          <li><b>File Upload:</b> Add a new knowledge graph-to-text file in the appropriate format.</li>
                          <li><b>File Saving: </b> Save the current state of the file</li>
                          <li><b>Graph Iterating: </b> Allows one to save multiple graphs and texts in one file with the <i>Add New Graph</i> button.</li>
                          <li><b>Add Graph Name: </b> Give an identifer to the graph</li>
                          <li><b>Add Graph Node: </b> Add 1 node to the graph. </li>
                          <li><b>Add Graph Edge: </b> Add an edge to the graph between existing nodes. </li>
                          <li><b>Add Text: </b> Create a text narrative for the graph. If current entities match those in the text, they will be color-coded.</li>
                          <li><b style={{color: 'red'}}>Clear all: </b> Delete all contents.</li>
                        </ul> 
                        <h4> <b> Generate </b></h4>
                        <h5> <u> About </u> </h5>
                        <p>The <b> Generate </b> page provides users with a playground for generating text from the knowledge graphs through state-of-the-art knowledge graph-to-text models. Currently we support three models, including BART, JointGT, and GAP (also GAP with type encoding). Users can upload their data files, select the instance they want predict from, and compare different model outputs. Here, users can also make corrections on the models and update/save the results on their uploaded file. This can serve as a quick text generator for those files which only have knowledge graphs, where users can go back to the <b>Visualize</b> to make further changes. We currently only support BART-based models, but plan to expand to other models in the future. Here we also color code the corresponding graph entities in the text.</p>
                        <h5> <u> Supported Models </u> </h5>
                        <ul>
                        <li> <code>BART</code></li> Implementation is from the following <a href="https://arxiv.org/pdf/2007.08426.pdf">paper</a>.
                        <li> <code>JointGT</code></li> Implementation is from the following <a href="https://arxiv.org/pdf/2106.10502.pdf">paper</a>.
                        <li><code>GAP</code></li> Implementation is from the following <a href="https://arxiv.org/pdf/2204.06674.pdf">paper</a>.
                        <li><code>GAP w/ Type </code></li> Implementation is from the same <a href="https://arxiv.org/pdf/2204.06674.pdf">paper</a> as above.
                        </ul>
                        <h5> <u> Functions </u> </h5>
                        <p>Below are the currently supported functions in <b>Generate</b>:</p>
                         <ul>
                          <li><b>File Upload:</b> Add a new knowledge graph-to-text file in the appropriate format.</li>
                          <li><b>File Saving: </b> Save the current state of the file</li>
                          <li><b>Graph Iterating: </b> Allows one to save multiple graphs and texts in one file with the <i>Add New Graph</i> button.</li>
                          <li><b>Model Selection: </b> Select which models to predict with. <i>Ctrl(CMD)+Click</i> to select multiple</li>
                          <li><b>Predict: </b> Automatically generate the knowledge graph's corresponding text via the selected models. </li>
                          <li><b>Edit: </b> Edit/manually correct the automatically generated text. </li>
                          <li><b>Update: </b> Update the corresponding generated output in the input file.</li>
                        </ul> 
                        </div>
                    </div>
                </div>
           
        
       

       

         </section>
          
        
    );
}
export default Home;