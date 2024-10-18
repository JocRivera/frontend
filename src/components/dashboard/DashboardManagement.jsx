import React from 'react';
import { Chart as ChartJS } from 'chart.js';
import BarsChart from './barsChart';
import LinesChart from './linesChart';
import DoughnutsChart from './doughnutChart.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


const DashboardManagement = () => {
    return (
        <div className='container mt-5'>
            <div className='col-md-10'>
                <div className='card h-100'>
                    <div className='card-body'>
                        <BarsChart />
                    </div>
                </div>
            </div>
            <div className='col-md-10 mt-3'>
                <div className='card h-100'>
                    <div className='card-body'>
                        <LinesChart />
                    </div>
                </div>
            </div>
            <div className='col-md-10 mt-3'>
                <div className='card h-100'>
                    <div className='card-body'>
                        <DoughnutsChart />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DashboardManagement;