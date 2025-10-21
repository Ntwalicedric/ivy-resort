import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useRWFConversion from '../../../hooks/useRWFConversion';
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw
} from 'lucide-react';

const ReportGenerator = ({ 
  isOpen, 
  onClose, 
  reservations = [], 
  rooms = [], 
  guests = [] 
}) => {
  const { formatRWF } = useRWFConversion();
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  if (!isOpen) return null;

  const calculateReportData = () => {
    const now = new Date();
    let startDate, endDate;
    
    console.log('ReportGenerator: Calculating report for dateRange:', dateRange);
    console.log('ReportGenerator: Total reservations available:', reservations.length);
    console.log('ReportGenerator: Sample reservation:', reservations[0]);
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(0);
        endDate = now;
    }

    console.log('ReportGenerator: Date range:', { startDate: startDate.toISOString(), endDate: endDate.toISOString() });
    
    const filteredReservations = reservations.filter(reservation => {
      const checkInDate = new Date(reservation.checkIn);
      const isInRange = checkInDate >= startDate && checkInDate <= endDate;
      console.log('ReportGenerator: Checking reservation:', {
        guestName: reservation.guestName,
        checkIn: reservation.checkIn,
        checkInDate: checkInDate.toISOString(),
        isInRange
      });
      return isInRange;
    });
    
    console.log('ReportGenerator: Filtered reservations count:', filteredReservations.length);

    const totalRevenue = filteredReservations.reduce((sum, r) => {
      const amount = typeof r.totalAmount === 'string' 
        ? parseFloat(r.totalAmount.replace(/[^0-9.-]+/g, '')) 
        : r.totalAmount || 0;
      return sum + amount;
    }, 0);

    const statusCounts = filteredReservations.reduce((acc, reservation) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1;
      return acc;
    }, {});

    const roomTypeCounts = filteredReservations.reduce((acc, reservation) => {
      acc[reservation.roomType] = (acc[reservation.roomType] || 0) + 1;
      return acc;
    }, {});

    const averageStayDuration = filteredReservations.reduce((sum, reservation) => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + duration;
    }, 0) / filteredReservations.length || 0;

    const occupancyRate = (filteredReservations.length / (rooms.length * 30)) * 100; // Assuming 30 days

    return {
      period: dateRange,
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      totalReservations: filteredReservations.length,
      totalRevenue,
      averageStayDuration: Math.round(averageStayDuration * 10) / 10,
      statusCounts,
      roomTypeCounts,
      reservations: filteredReservations
    };
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = calculateReportData();
    setGeneratedReport(reportData);
    setIsGenerating(false);
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const reportContent = generateReportContent(generatedReport);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resort-report-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (data) => {
    return `
IVY RESORT - ${data.period.toUpperCase()} REPORT
Generated: ${new Date().toLocaleDateString()}
Period: ${data.startDate} to ${data.endDate}

SUMMARY
• Total Reservations: ${data.totalReservations}
• Total Revenue: ${formatRWF(data.totalRevenue)}
• Average Stay: ${data.averageStayDuration} days

STATUS BREAKDOWN
${Object.entries(data.statusCounts).map(([status, count]) => 
  `• ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`
).join('\n')}

ROOM TYPES
${Object.entries(data.roomTypeCounts).map(([type, count]) => 
  `• ${type}: ${count} bookings`
).join('\n')}

RECENT BOOKINGS
${data.reservations.slice(0, 5).map(reservation => 
  `• ${reservation.guestName} - ${reservation.roomType} - ${formatRWF(reservation.totalAmount)}`
).join('\n')}

---
Ivy Resort Management System
    `.trim();
  };

  const formatCurrency = (amount) => {
    return formatRWF(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <BarChart3 size={24} className="mr-3" />
                    Report Generator
                  </h2>
                  <p className="text-blue-100">Generate comprehensive resort reports</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
              {!generatedReport ? (
                <div className="space-y-6">
                  {/* Date Range Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Calendar size={20} className="mr-2 text-blue-600" />
                      Select Time Period
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'week', label: 'Last 7 Days' },
                        { id: 'month', label: 'This Month' },
                        { id: 'quarter', label: 'This Quarter' },
                        { id: 'year', label: 'This Year' }
                      ].map(({ id, label }) => (
                        <button
                          key={id}
                          onClick={() => setDateRange(id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            dateRange === id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={generateReport}
                      disabled={isGenerating}
                      className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw size={20} className="animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <BarChart3 size={20} />
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Resort Report</h3>
                      <p className="text-slate-600">
                        {generatedReport.startDate} to {generatedReport.endDate}
                      </p>
                    </div>
                    <button
                      onClick={downloadReport}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Reservations</p>
                          <p className="text-2xl font-bold text-blue-900">{generatedReport.totalReservations}</p>
                        </div>
                        <Users className="text-blue-600" size={24} />
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-900">{formatCurrency(generatedReport.totalRevenue)}</p>
                        </div>
                        <DollarSign className="text-green-600" size={24} />
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 text-sm font-medium">Avg Stay Duration</p>
                          <p className="text-2xl font-bold text-purple-900">{generatedReport.averageStayDuration} days</p>
                        </div>
                        <Calendar className="text-purple-600" size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Status & Room Type Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Reservation Status</h4>
                      <div className="space-y-2">
                        {Object.entries(generatedReport.statusCounts).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-slate-700 capitalize">{status.replace('-', ' ')}</span>
                            <span className="font-semibold text-slate-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4">Room Types</h4>
                      <div className="space-y-2">
                        {Object.entries(generatedReport.roomTypeCounts).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-slate-700">{type}</span>
                            <span className="font-semibold text-slate-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setGeneratedReport(null)}
                      className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      New Report
                    </button>
                    <button
                      onClick={downloadReport}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportGenerator;
