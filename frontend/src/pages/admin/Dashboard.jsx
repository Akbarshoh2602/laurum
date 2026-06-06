import { useEffect, useState } from 'react'
import client, { unwrap } from '../../api/client'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const GOLD = '#C9A227'
const PIE_COLORS = ['#C9A227', '#1A1A1A', '#9A7B1A', '#E3C766', '#6b6b6b', '#444']

function Card({ label, value, accent }) {
  return (
    <div className="bg-white border border-neutral-200 p-5">
      <div className="text-xs uppercase tracking-widest text-neutral-400">{label}</div>
      <div className={`font-display text-4xl mt-2 ${accent ? 'text-gold-dark' : ''}`}>{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    client.get('/admin/dashboard').then((r) => setData(unwrap(r))).catch(() => {})
  }, [])

  if (!data) return <p className="text-neutral-500">Loading dashboard…</p>

  const money = (n) => `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Products" value={data.totalProducts} />
        <Card label="Total Categories" value={data.totalCategories} />
        <Card label="Total Customers" value={data.totalCustomers} />
        <Card label="Total Orders" value={data.totalOrders} />
        <Card label="Pending Orders" value={data.pendingOrders} />
        <Card label="Completed Orders" value={data.completedOrders} />
        <Card label="Monthly Revenue" value={money(data.monthlyRevenue)} accent />
        <Card label="Low Stock" value={data.lowStockProducts} accent />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-display text-2xl mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill={GOLD} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-display text-2xl mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} dot={{ fill: GOLD }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-display text-2xl mb-4">Top Selling Products</h3>
          {data.topSellingProducts.length === 0 ? (
            <p className="text-neutral-400 text-sm">No sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={data.topSellingProducts}>
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" width={120} fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill={GOLD} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-neutral-200 p-6">
          <h3 className="font-display text-2xl mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.categoryDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                {data.categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
