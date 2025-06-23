import { useAuthContext } from "@/context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSellerDashboard } from "@/hooks/useDashboard";
import { Navigate } from "react-router-dom";
import * as React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    TrendingUp, 
    Package, 
    Clock, 
    DollarSign, 
    ShoppingCart,
    RefreshCw,
    BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SellerDashboard = () => {
    const { user, isLoading, isAuthenticated } = useAuthContext();
    const { data, isLoading: dashboardLoading, isError } = useSellerDashboard();
    const [timeRange, setTimeRange] = React.useState("all");
    const [activeTab, setActiveTab] = React.useState("revenue");

    const availableTimeRanges = React.useMemo(() => {
        if (!data?.monthlyRevenue) return ["all"];
        
        const daysOfData = data.monthlyRevenue.reduce(
            (sum, month) => sum + month.days.length, 0
        );
        
        const ranges = [];
        if (daysOfData >= 7) ranges.push("7d");
        if (daysOfData >= 30) ranges.push("30d");
        if (daysOfData >= 90) ranges.push("90d");
        
        return ranges.length ? ranges : ["all"];
        }, [data]);
    
    // Prepare chart data
    const revenueChartData = React.useMemo(() => {
        if (!data?.monthlyRevenue) return [];
        
        return data.monthlyRevenue
            .flatMap(month => 
            month.days.map(day => ({
                date: `${month._id.year}-${String(month._id.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`,
                revenue: day.revenue,
                month: month._id.month
            }))
            )
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);
    
    const orderChartData = React.useMemo(() => {
        if (!data?.monthlyOrders) return [];
    
        return data.monthlyOrders
        .flatMap(month =>
            month.days.map(day => ({
            date: `${month._id.year}-${String(month._id.month).padStart(2, "0")}-${String(day.day).padStart(2, "0")}`,
            orders: day.count,
            month: month._id.month,
            }))
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);
    
      // Filter data based on time range
    const filteredData = React.useMemo(() => {
        if (timeRange === "all") return revenueChartData;
        
        const referenceDate = new Date(revenueChartData[revenueChartData.length - 1]?.date || new Date());
        let daysToSubtract = 90;
        if (timeRange === "30d") daysToSubtract = 30;
        if (timeRange === "7d") daysToSubtract = 7;
        
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        
        return revenueChartData.filter(item => new Date(item.date) >= startDate);
    }, [timeRange, revenueChartData]);
    
    const filteredOrderData = React.useMemo(() => {
        if (timeRange === "all") return orderChartData;
    
        const referenceDate = new Date(orderChartData[orderChartData.length - 1]?.date || new Date());
        let daysToSubtract = 90;
        if (timeRange === "30d") daysToSubtract = 30;
        if (timeRange === "7d") daysToSubtract = 7;
    
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
    
        return orderChartData.filter(item => new Date(item.date) >= startDate);
    }, [timeRange, orderChartData]);
    
      // Calculate derived metrics
    const metrics = React.useMemo(() => {
        if (!revenueChartData.length) return null;
        if (!orderChartData.length) return null;
    
        // Calculate peak across all data
        const revenuePeakEntry = [...revenueChartData].sort((a, b) => b.revenue - a.revenue)[0];
        const ordersPeakEntry = [...orderChartData].sort((a, b) => b.orders - a.orders)[0];
    
        return {
            peakRevenue: revenuePeakEntry.revenue,
            peakRevenueDate: revenuePeakEntry.date,
            peakOrder: ordersPeakEntry.orders,
            peakOrderDate: ordersPeakEntry.date
        };
    }, [revenueChartData, orderChartData]);

    if (isLoading || dashboardLoading) {
        return <div className="mt-10 text-center">Loading...</div>;
    }
    
    if (!isAuthenticated || user?.role !== "seller") {
        return <Navigate to="/" replace />;
    }
    
    if (isError || !data) {
        return (
            <div className="mt-10 text-center text-red-500">
                Failed to load dashboard data.
            </div>
        );
    }
    
    const { productCount, pendingOrders, revenue } = data;

    return (
        <>
        <div className="bg-white px-4 py-4 border-b md:px-8 md:py-[13px]">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm md:text-[14px] text-gray-400">Home /</span>
                <span className="text-xl md:text-[24px] text-gray-700 font-medium">
                Dashboard
                </span>
            </div>
        </div>
    
        <div className="max-w-6xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold">Welcome, {user.storeName} 👋</h1>
    
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-lg border bg-blue-50 text-blue-600 border-blue-100`}>
                                    <Package className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-gray-900">{productCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-lg border bg-orange-50 text-orange-600 border-orange-100`}>
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">Pending Orders</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-lg border bg-green-50 text-green-600 border-green-100`}>
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-gray-900">${revenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">{
                metrics && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900">Peak Revenue Day</h3>
                                <p className="text-sm text-blue-700">Best performing day</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-blue-900">
                                ${metrics?.peakRevenue.toFixed(2)}
                            </p>
                            <p className="text-sm text-blue-700">
                                {metrics?.peakRevenueDate ? new Date(metrics.peakRevenueDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric"
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                )}
                {metrics && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-900">Peak Orders Day</h3>
                                <p className="text-sm text-green-700">Highest order volume</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-green-900">
                                {metrics?.peakOrder}
                            </p>
                            <p className="text-sm text-green-700">
                                {metrics?.peakOrderDate ? new Date(metrics.peakOrderDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric"
                                }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
    
            {/* Chart Section */}
            <Card className="mb-6">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <p className="text-sm text-gray-500">
                    {timeRange === "7d" ? "Last 7 days" : 
                        timeRange === "30d" ? "Last 30 days" : 
                        timeRange === "90d" ? "Last 3 months" : 
                        "All available data"}
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select 
                    value={timeRange} 
                    onValueChange={setTimeRange}
                    disabled={revenueChartData.length === 0}
                    >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All data</SelectItem>
                        {availableTimeRanges.includes("7d") && (
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        )}
                        {availableTimeRanges.includes("30d") && (
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        )}
                        {availableTimeRanges.includes("90d") && (
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        )}
                    </SelectContent>
                    </Select>
                </div>
                </CardHeader>
    
                <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="revenue">Revenue</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue">
                    {filteredData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px]">
                        <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No revenue data available</p>
                        <Button variant="ghost" className="mt-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                        </div>
                    ) : (
                        <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981cd ba" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => 
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                                }
                            />
                            <YAxis
                                tickFormatter={(val) => `$${val.toFixed(2)}`}
                            />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                fill="url(#fillRevenue)"
                                strokeWidth={2}
                            />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                    )}
                    </TabsContent>

                    <TabsContent value="orders">
                        {filteredOrderData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px]">
                            <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">No order data available</p>
                            <Button variant="ghost" className="mt-2">
                            <RefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                        </div>
                        ) : (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredOrderData}>
                            <defs>
                            <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                            dataKey="date"
                            tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                            }
                            />
                            <YAxis tickFormatter={(val) => `${val}`} />
                            <Tooltip />
                            <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#3b82f6"
                            fill="url(#fillOrders)"
                            strokeWidth={2}
                            />
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        )}
                    </TabsContent>
                </Tabs>
                </CardContent>
            </Card>
        </div>
        </>
    );
};

export default SellerDashboard;
