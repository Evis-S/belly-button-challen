//Use the D3 library to read in samples.json from the URL

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
  });

  // Initialize the function
function init() {
    // function update
    let dropdownMenu = d3.select ("#selDataset");

    // Use D3 to load the JSON file
    d3.json(url).then((data)=> {
      //Set a variable for the names
        let names = data.names;

      // Log the names 
        names. forEach((id) => {

         // Log the id
         console.log (id);
         dropdownMenu.append("option").text(id).property("value",id);
        });
      //Set the first sample from the list 
      let sampleOne = names[0];
      // log the value of sampleOne
      console.log(sampleOne);

     // Call the functions to display the data and the plots to the page
      buildMetadata(sampleOne);
      buildBarchart(sampleOne);
      buildBubbleChart (sampleOne);
      buildGaugeChart(sampleOne);

    });
};
// Function that builds the metadata panel
function buildMetadata(sample) {
 // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

       // Retrieve all metadata
       let metadata = data.metadata;
       // Log the metadata
       let value = metadata.filter (result => result.id == sample);
        // Log the value
        console.log(value)
        // Get the first index from the array
        let valueData = value[0];
        // Clear out metadata panel each time a new sample is selected
        d3.select("#sample-metadata").html("");
        // Use Object.entries to add each key and value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);
            // Append the key and value to the metadata panel
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};
/*Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
Use sample_values as the values for the bar chart.
Use otu_ids as the labels for the bar chart.
Use otu_labels as the hovertext for the chart.*/

// Function that builds the bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

/*Create a bubble chart that displays each sample.
Use otu_ids for the x values.
Use sample_values for the y values.
Use sample_values for the marker size.
Use otu_ids for the marker colors.
Use otu_labels for the text values.*/

// Function that builds the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);

 };
// Call the initialize function
init();

//Advanced Challenge Assignment
//Gauge Chart
//Create a gauge chart to plot the weekly washing frequency of the individual.
let GaugeData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: "wfreq",
    title: { text: "Belly Button Washing Frequency <br> Scrubs per Week" },
    type: "indicator",
    mode: "gauge+number",
      // Set the gauge range from 0 to 9
    gauge: {
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
      axis: { range: [null,9],tickwith:1 },
      steps: [
        { range: [0, 1],color: "rgba(243, 233, 217, 0),"},
        { range: [1, 2],color: "rgba(232, 226, 202, .5)"},
        { range: [2, 3],color: "rgba(210, 206, 145, .5)"},
        { range: [3, 4],color:  "rgba(202, 209, 95, .5)"},
        { range: [4, 5],color:  "rgba(184, 205, 68, .5)"},
        { range: [5, 6],color: "rgba(170, 202, 42, .5)"},
        { range: [6, 7],color: "rgba(142, 178, 35 , .5)"},
        { range: [7, 8],color:  "rgba(110, 154, 22, .5)"},
        { range: [8, 9],color: "rgba(50, 143, 10, 0.5)"},
      ],
          threshold: {
        line: { color: "red", width: 4 },
        thickness: 1 ,
        value: 490
      }
    }
  }
];
// Set the layout for the gauge chart
let gaugeLayout = { 
  width: 600, 
  height: 450, 
  margin: { t: 0, b: 0 } 
};
// Call Plotly to plot the gauge chart
Plotly.newPlot('gauge',GaugeData, gaugeLayout);

// Call the initialize function
init();

