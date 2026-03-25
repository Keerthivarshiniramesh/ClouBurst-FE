import React, { useContext, useEffect, useState } from 'react'
import { DContext } from '../../context/Datacontext'
import CustomApexChart from '../blocks/LiveChart'
import { THINGSPEAK_URL } from '../../utils/ThinkSpeak'
import { FiDownload, FiCheck, FiAlertCircle, FiTrendingUp, FiHash, FiRotateCw, FiCompass } from "react-icons/fi";
import { WiThermometer, WiHumidity, WiRain, WiStrongWind } from "react-icons/wi";

export const MotorTest = () => {
    const { controls } = useContext(DContext)

    const [records, setRecords] = useState([])
    const [latest, setLatest] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!THINGSPEAK_URL) return;

        const fetchData = async () => {
            try {
                const res = await fetch(THINGSPEAK_URL);
                const data = await res.json();

                if (!data.feeds?.length) return;

                const feeds = data.feeds.map(f => {
                    // Split the combined field (adjust separator if needed)
                    const values = f.field1 ? f.field1.split(',') : [];

                    return {
                        time: new Date(f.created_at).toLocaleString(),
                        timestamp: new Date(f.created_at).getTime(),

                        temp: values[0] ? Number(values[0]) : 0,
                        humidity: values[1] ? Number(values[1]) : 0,
                        rainfall: values[2] ? Number(values[2]) : 0,
                        index: values[3] ? Number(values[3]) : 0,
                        angle: values[4] ? Number(values[4]) : 0,
                        direction: values[5] ? values[5].trim() : "",
                    };
                });

                setRecords(feeds);
                setLatest(feeds[feeds.length - 1]);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchData();
        const id = setInterval(fetchData, 5000);
        return () => clearInterval(id);
    }, []);

    const getChartData = (label, key) => {
        const labels = {
            temp: "Temperature",
            humidity: "Humidity",
            rainfall: "Rainfall",
            angle: "Angle"
        };
        return [
            {
                seriesName: labels[key] || label,
                'x-axis': records.map(r => r.timestamp),
                'y-axis': records.map(r => r[key] ?? 0)
            }
        ];
    };

    const downloadCSV = () => {
        if (!records.length) return;
        const csv = [
            ["Timestamp", "Temperature (°C)", "Humidity (%)", "Rainfall (mm)", "Index", "Angle", "Direction"],
            ...records.map(r => [r.time, r.temp, r.humidity, r.rainfall, r.index, r.angle, r.direction])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `cloudburst-data-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDirectionName = (code) => {
        const directionMap = {
            'N': 'North',
            'S': 'South',
            'E': 'East',
            'W': 'West',
            'NE': 'North East',
            'NW': 'North West',
            'SE': 'South East',
            'SW': 'South West',
            'EW': 'East-West',
            'WE': 'West-East'
        };
        return directionMap[code?.toString().toUpperCase()] || code || "—";
    };

    const getRisk = () => {
        if (latest?.rainfall > 80) {
            return {
                text: "High Risk",
                color: "text-red-600",
                bgColor: "bg-red-50",
                border: "border-red-500",
                icon: <FiAlertCircle className="w-5 h-5" />,
                confidence: 92
            };
        }
        if (latest?.rainfall > 50) {
            return {
                text: "Moderate Risk",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                border: "border-yellow-500",
                icon: <FiAlertCircle className="w-5 h-5" />,
                confidence: 88
            };
        }
        return {
            text: "Safe",
            color: "text-green-600",
            bgColor: "bg-green-50",
            border: "border-green-500",
            icon: <FiCheck className="w-5 h-5" />,
            confidence: 94
        };
    };

    const risk = getRisk();

    const dataCards = [
        {
            label: "Temperature",
            value: latest?.temp?.toFixed(1) || "—",
            unit: "°C",
            icon: <WiThermometer className="w-8 h-8" />,
            border: "border-red-500",
            iconBg: "bg-red-50",
            range: "Expected: 20-35°C"
        },
        {
            label: "Humidity",
            value: latest?.humidity?.toFixed(1) || "—",
            unit: "%",
            icon: <WiHumidity className="w-8 h-8" />,
            border: "border-blue-500",
            iconBg: "bg-blue-50",
            range: "Expected: 40-100%"
        },
        {
            label: "Rainfall",
            value: latest?.rainfall?.toFixed(1) || "—",
            unit: "mm",
            icon: <WiRain className="w-8 h-8" />,
            border: "border-green-500",
            iconBg: "bg-green-50",
            range: "Alert: > 50 mm"
        },
        {
            label: "Index",
            value: latest?.index?.toFixed(1) || "—",
            unit: "",
            icon: <FiHash className="w-8 h-8" />,
            border: "border-purple-500",
            iconBg: "bg-purple-50",
            range: "Monitoring value"
        },
        {
            label: "Angle",
            value: latest?.angle?.toFixed(1) || "—",
            unit: "°",
            icon: <FiRotateCw className="w-8 h-8" />,
            border: "border-orange-500",
            iconBg: "bg-orange-50",
            range: "Current angle"
        },
        {
            label: "Direction",
            value: getDirectionName(latest?.direction) || "—",
            unit: "",
            icon: <FiCompass className="w-8 h-8" />,
            border: "border-indigo-500",
            iconBg: "bg-indigo-50",
            range: "Wind direction"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading monitoring data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 lg:px-6">
            {/* HEADER */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Cloudburst Monitoring System
                        </h1>
                        <p className="text-gray-600 mt-1">Real-time environmental sensor data and risk assessment</p>
                    </div>

                    <button
                        onClick={downloadCSV}
                        disabled={!records.length}
                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-lg transition font-medium text-sm shadow-sm"
                    >
                        <FiDownload className="w-4 h-4" /> Download Data
                    </button>
                </div>

                {/* DATA CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {dataCards.map((card, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-lg border-l-4 ${card.border} shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                                            <span className="text-gray-500 text-sm ml-1">{card.unit}</span>
                                        </div>
                                    </div>
                                    <div className={`${card.iconBg} p-2 rounded-lg text-gray-700`}>
                                        {card.icon}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">{card.range}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS SECTION */}
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FiTrendingUp className="w-6 h-6" /> Sensor Trends
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Historical data visualization (last 100 readings)</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[
                            { key: "temp", label: "Temperature", color: "#f51616" },
                            { key: "humidity", label: "Humidity", color: "#3b82f6" },
                            { key: "rainfall", label: "Rainfall", color: "#10b981" },
                            { key: "angle", label: "Angle", color: "#f97316" }
                        ].map((chart, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-gray-900 font-semibold text-base mb-4">{chart.label}</h3>
                                <CustomApexChart
                                    data={getChartData(chart.label, chart.key)}
                                    chartType="line"
                                    controls={{ ...controls, show: true }}
                                    color={chart.color}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DATA TABLE SECTION */}
                {/* <div className="mb-8">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">All Records</h2>
                        <p className="text-gray-600 text-sm mt-1">Complete dataset ({records.length} readings)</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0">Temperature</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0">Humidity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0">Rainfall</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky top-0">Wind Speed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {records.length > 0 ? (
                                        [...records].reverse().map((record, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-3 text-sm text-gray-900 font-medium">{record.time}</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{record.temp.toFixed(2)}°C</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{record.humidity.toFixed(2)}%</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{record.rainfall.toFixed(2)}mm</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{record.wind.toFixed(2)}km/h</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="max-h-96 overflow-y-auto border-t border-gray-200">
                           
                        </div>
                    </div>
                </div> */}

                {/* ML PREDICTION CARD */}
                <div className={`${risk.bgColor} border-l-4 ${risk.border} rounded-lg p-6 shadow-sm`}>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">{risk.icon}</span> Early Warning Assessment
                            </h3>
                            <div className="mt-4">
                                <p className={`text-3xl font-bold ${risk.color}`}>{risk.text}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Confidence Score: <span className="font-semibold text-gray-900">{risk.confidence}%</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-3">
                                    {latest?.rainfall > 80
                                        ? "Heavy rainfall detected. Cloudburst risk is HIGH. Immediate action recommended."
                                        : latest?.rainfall > 50
                                            ? "Moderate rainfall levels detected. Monitor situation closely."
                                            : "Current conditions are within normal parameters. No immediate risk detected."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}