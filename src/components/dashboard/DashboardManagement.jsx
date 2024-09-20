import React from 'react';
import { Chart as ChartJS } from 'chart.js';
import BarsChart from './barsChart';

const DashboardManagement = () => {
    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>
            <div className=''><BarsChart /></div>
        </div>
    )
}

export default DashboardManagement;
