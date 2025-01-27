import { LightningElement, wire } from 'lwc';
import getLeadsByProductInterest from '@salesforce/apex/doctorsListController.getLeadsByProductInterest';
import ChartJS from '@salesforce/resourceUrl/chartJs'; // Import Chart.js
import ChartDataLabels from '@salesforce/resourceUrl/chartDatalabels';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ProductInterestChart extends LightningElement {
    chart;
    chartData = [];
    chartLabels = [];
    error;

    isChartJsInitialized = false;

    @wire(getLeadsByProductInterest)
    wiredLeads({ error, data }) {
        if (data) {
            console.log('inside wire ', data);

            this.chartLabels = data.map((item) => item.ProductInterest__c);
            this.chartData = data.map((item) => item.recordCount);
            console.log('inside wire ', this.chartLabels);
            console.log('inside wire ', this.chartData);
            // Render chart if Chart.js is already loaded
            if (this.isChartJsInitialized) {
                console.log('inside wire1');
                this.initializeChart();
            }
        } else if (error) {
            this.error = error;
            console.error('Error fetching data:', error);
        }
    }

    renderedCallback() {
        if (this.chart) {
            console.log('Inside chart 1');
            
            return; // Chart already initialized
        }
        // Load the Chart.js library
        loadScript(this, ChartJS)
            .then(() => {
                console.log('inside ChartJS');
                loadScript(this, ChartDataLabels)
                    .then(() => {
                        console.log('inside datalabels');
                        
                        this.initializeChart();
                    })
                    .catch(error => {
                        console.error('Error loading datalabels', error);
                    });

            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
            });
    }

    initializeChart() {
        // Register the plugin explicitly
        Chart.register(ChartDataLabels);
    
        if (this.chart) {
            this.chart.destroy(); // Clear the existing chart
            console.log('Chart destroyed');
        }
        
        console.log('Initializing chart');
        this.isChartJsInitialized = true;
    
        const ctx = this.template.querySelector('canvas').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.chartLabels,
                datasets: [
                    {
                        data: this.chartData,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40',
                            '#C9CBCF'
                        ]
                    }
                ]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    datalabels: {
                        display: true, // Ensures labels are always visible
                        color: '#000', // Label text color
                        anchor: 'center', // Position labels at the center of segments
                        align: 'center',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        formatter: (value, context) => {
                            // Add value and percentage to labels
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${value} (${percentage}%)`;
                        }
                    }
                }
            }
        });
    }
    
}
