// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let buttonAllMeta = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let buttonMeta = buttonAllMeta.filter(result => result.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metaSample = d3.select('#sample-metadata');
    
    // Use `.html("") to clear any existing metadata
    metaSample.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(buttonMeta[0]).forEach(([key, value]) => {
      upperKey = key.toUpperCase()
      metaSample.append('li').text(`${upperKey}: ${value}`)
    })
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let buttonAllSamples = data.samples;

    // Filter the samples for the object with the desired sample number
    let buttonSample = buttonAllSamples.filter(result => result.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let sample_otu_ids = buttonSample[0].otu_ids
    let sample_otu_labels = buttonSample[0].otu_labels
    let sample_values = buttonSample[0].sample_values

    // Build a Bubble Chart
    let bubbleTrace = {
      x: sample_otu_ids,
      y: sample_values,
      text: sample_otu_labels,
      mode: "markers",
      marker: {
          size: sample_values,
          color: sample_otu_ids,
      }
    };

    let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Number of Bacteria"},
        height: 450,
        width: 1000
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let sample_otu_ids_str = sample_otu_ids.map(id => `OTU ${id} `)

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = [{
      x: sample_values.slice(0,10).reverse(),
      y: sample_otu_ids_str.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"},
      height: 450,
      width: 700            
    }; 

    // Render the Bar Chart
    Plotly.newPlot('bar', barTrace, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(function(name){
      dropdownMenu.append("option").text(name).property("value");
    });

    // Get the first sample from the list
    let firstValue = names[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstValue)
    buildCharts(firstValue)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();