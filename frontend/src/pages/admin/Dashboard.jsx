import { useEffect, useState } from 'react'
import client, { unwrap } from '../../api/client'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const ACCENT = '#FF5C00'
const PIE_COLORS = ['#FF5C00', '#0D1B2A', '#00B4D8', '#2D6A4F', '#CC4900', '#1B263B']

function Card({ label, value, accent }) {
  return (
    <div className="card p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-slate">{label}</div>
      <div className={`font-display text-4xl mt-1 ${accent ? 'text-gold' : 'text-ink'}`}>{value}</div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    client.get('/admin/dashboard').then((r) => setData(unwrap(r))).catch(() => {})
  }, [])

  if (!data) return <p className="text-slate font-medium">Loading dashboard…</p>

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
        <div className="card p-6">
          <h3 className="font-display text-2xl mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" />
              <XAxis dataKey="label" fontSize={12} stroke="#5C6778" />
              <YAxis fontSize={12} stroke="#5C6778" />
              <Tooltip />
              <Bar dataKey="revenue" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-2xl mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" />
              <XAxis dataKey="label" fontSize={12} stroke="#5C6778" />
              <YAxis fontSize={12} stroke="#5C6778" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0D1B2A" strokeWidth={3} dot={{ fill: ACCENT, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-2xl mb-4">Top Selling Products</h3>
          {data.topSellingProducts.length === 0 ? (
            <p className="text-slate text-sm">No sales yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={data.topSellingProducts}>
                <XAxis type="number" fontSize={12} stroke="#5C6778" />
                <YAxis type="category" dataKey="name" width={120} fontSize={11} stroke="#5C6778" />
                <Tooltip />
                <Bar dataKey="value" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
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
