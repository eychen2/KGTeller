# KGTeller: An Application for Annotating and Analyzing Knowledge Graph-to-Text Data

The KGTeller system consists of a web-based front-end user interface where users can begin the annotation process by either uploading their existing KG-to-text datasets or creating their own KG-to-text datasets from scratch.
KGTeller expects a JSON file with a specific format, where the KG and text data is parsed through,
and a visual representation for the graph is generated for users using React-Flow. Users can then
visualize these datasets and automatically generate
new text from the input KGs, editing the datasets
until they find the generated text acceptable. As
we currently only support the local installation of
KGTeller due to hardware limitations, namely the
need for GPUs to run the generative models, users
can directly download the annotated KG-to-text
datasets to their machines
