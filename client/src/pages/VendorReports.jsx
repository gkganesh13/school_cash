import React, { useState, useEffect } from 'react';
import { vendors } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VendorMenu from '../components/VendorMenu';
import QuickActions from '../components/QuickActions';
import { FaDownload, FaCalendar, FaChartBar } from 'react-icons/fa';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VendorReports = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await vendors.getReportData({
        startDate: dateRange.start,
        endDate: dateRange.end,
        type: reportType
      });
      setReportData(response.data);
    } catch (err) {
      setError('Failed to load report data');
      console.error('Report data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.text('Vendor Report', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle with date range
    doc.setFontSize(12);
    doc.text(
      `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Summary section
    doc.setFontSize(14);
    doc.text('Summary', 20, 45);
    
    const summaryData = [
      ['Total Sales', `$${reportData.summary.totalSales.toFixed(2)}`],
      ['Total Transactions', reportData.summary.totalTransactions],
      ['Average Transaction', `$${reportData.summary.averageTransaction.toFixed(2)}`],
      ['Most Popular Item', reportData.summary.mostPopularItem]
    ];

    doc.autoTable({
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid'
    });

    // Daily transactions
    doc.setFontSize(14);
    doc.text('Daily Transactions', 20, doc.lastAutoTable.finalY + 20);

    const transactionData = reportData.dailyTransactions.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.count,
      `$${item.amount.toFixed(2)}`
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Date', 'Transactions', 'Amount']],
      body: transactionData,
      theme: 'grid'
    });

    // Save the PDF
    doc.save('vendor-report.pdf');
  };

  const renderSalesChart = () => {
    const data = [{
      id: 'sales',
      data: reportData.dailyTransactions.map(item => ({
        x: new Date(item.date).toLocaleDateString(),
        y: item.amount
      }))
    }];

    return (
      <div className="h-80">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Amount ($)',
            legendOffset: -50,
            legendPosition: 'middle'
          }}
          axisBottom={{
            tickRotation: -45
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          enableSlices="x"
        />
      </div>
    );
  };

  const renderCategoryChart = () => {
    const data = reportData.categoryBreakdown.map(item => ({
      id: item.category,
      label: item.category,
      value: item.amount
    }));

    return (
      <div className="h-80">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
      </div>
    );
  };

  const renderItemsChart = () => {
    const data = reportData.topItems.map(item => ({
      item: item.name,
      sales: item.sales
    }));

    return (
      <div className="h-80">
        <ResponsiveBar
          data={data}
          keys={['sales']}
          indexBy="item"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          axisBottom={{
            tickRotation: -45
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Sales',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VendorMenu />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <VendorMenu />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="sales">Sales Report</option>
              <option value="items">Items Report</option>
              <option value="categories">Category Report</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <QuickActions type="reports" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Total Sales</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${reportData.summary.totalSales.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Total Transactions</div>
                <div className="text-2xl font-bold text-green-600">
                  {reportData.summary.totalTransactions}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Average Transaction</div>
                <div className="text-2xl font-bold text-purple-600">
                  ${reportData.summary.averageTransaction.toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-sm text-gray-500">Most Popular Item</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {reportData.summary.mostPopularItem}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">
                {reportType === 'sales' ? 'Sales Trend' :
                 reportType === 'categories' ? 'Category Distribution' :
                 'Top Items Performance'}
              </h3>
              {reportType === 'sales' && renderSalesChart()}
              {reportType === 'categories' && renderCategoryChart()}
              {reportType === 'items' && renderItemsChart()}
            </div>

            {/* Detailed Data Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Detailed Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.dailyTransactions.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${day.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(day.amount / day.count).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorReports;
