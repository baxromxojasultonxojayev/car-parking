'use client'

import { Row, Col, Card, Table, Typography } from 'antd'
import {
  CarOutlined,
  PullRequestOutlined,
  DollarOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import { StatCard } from '../../components/common/StatCard'
import { StatusTag } from '../../components/common/StatusTag'
import type { ColumnsType } from 'antd/es/table'
import { Session } from '../../types'

const { Title } = Typography

// Chart data for sessions over time
const sessionsChartData = [
  { name: 'Mon', sessions: 12, requests: 8 },
  { name: 'Tue', sessions: 19, requests: 14 },
  { name: 'Wed', sessions: 15, requests: 11 },
  { name: 'Thu', sessions: 25, requests: 18 },
  { name: 'Fri', sessions: 32, requests: 24 },
  { name: 'Sat', sessions: 28, requests: 20 },
  { name: 'Sun', sessions: 18, requests: 12 },
]

// Chart data for request status distribution
const requestStatusData = [
  { name: 'Open', value: 15, color: '#fa8c16' },
  { name: 'In Progress', value: 8, color: '#722ed1' },
  { name: 'Ready', value: 5, color: '#13c2c2' },
  { name: 'Done', value: 42, color: '#52c41a' },
]

// Revenue data
const revenueData = [
  { name: 'Mon', revenue: 450000 },
  { name: 'Tue', revenue: 620000 },
  { name: 'Wed', revenue: 580000 },
  { name: 'Thu', revenue: 890000 },
  { name: 'Fri', revenue: 1200000 },
  { name: 'Sat', revenue: 980000 },
  { name: 'Sun', revenue: 750000 },
]

export const Dashboard = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { sessions, requests, payments, tickets } = useDataStore()
  const isDark = theme === 'dark'

  // Calculate stats
  const activeSessions = sessions.filter((s) => s.status === 'CREATED' || s.status === 'PARKED').length
  const openRequests = requests.filter(
    (r) => r.status === 'OPEN' || r.status === 'CLAIMED' || r.status === 'IN_PROGRESS' || r.status === 'READY'
  ).length
  const paidPayments = payments.filter((p) => p.status === 'PAID').length
  const availableTickets = tickets.filter((t) => t.state === 'AVAILABLE').length

  // Get recent sessions
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const sessionColumns: ColumnsType<Session> = [
    {
      title: t('sessions.ticket'),
      dataIndex: 'ticket_serial',
      key: 'ticket_serial',
      render: (text) => <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: t('sessions.vehicle_plate'),
      dataIndex: 'vehicle_plate',
      key: 'vehicle_plate',
      render: (text) => (
        <span
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: t('sessions.customer'),
      dataIndex: 'customer_name',
      key: 'customer_name',
    },
    {
      title: t('sessions.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: t('sessions.box'),
      dataIndex: 'parking_box_code',
      key: 'parking_box_code',
      render: (text) => text || '-',
    },
  ]

  const chartTextColor = isDark ? 'rgba(255,255,255,0.65)' : '#666'
  const chartGridColor = isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0'

  return (
    <div>
      <Title
        level={2}
        style={{
          margin: '0 0 24px 0',
          color: isDark ? '#fff' : '#1a1a2e',
        }}
      >
        {t('nav.dashboard')}
      </Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.active_sessions')}
            value={activeSessions}
            icon={<CarOutlined />}
            color="#667eea"
            trend={12}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.open_requests')}
            value={openRequests}
            icon={<PullRequestOutlined />}
            color="#fa8c16"
            trend={-5}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.paid_payments')}
            value={paidPayments}
            icon={<DollarOutlined />}
            color="#52c41a"
            trend={18}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={t('dashboard.available_tickets')}
            value={availableTickets}
            icon={<TagsOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* Sessions & Requests Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={t('dashboard.weekly_activity')}
            style={{
              borderRadius: '16px',
              background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
            }}
            styles={{
              header: {
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
                color: isDark ? '#fff' : '#1a1a2e',
              },
              body: { padding: '16px' },
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionsChartData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa8c16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fa8c16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={{ stroke: chartGridColor }} />
                <YAxis tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={{ stroke: chartGridColor }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1a1b2e' : '#fff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#667eea"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                  name={t('dashboard.sessions')}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#fa8c16"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  name={t('dashboard.requests')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Request Status Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={t('dashboard.request_status')}
            style={{
              borderRadius: '16px',
              background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
              height: '100%',
            }}
            styles={{
              header: {
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
                color: isDark ? '#fff' : '#1a1a2e',
              },
              body: { padding: '16px' },
            }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1a1b2e' : '#fff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {requestStatusData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: item.color,
                    }}
                  />
                  <span style={{ fontSize: '12px', color: chartTextColor }}>{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card
            title={t('dashboard.weekly_revenue')}
            style={{
              borderRadius: '16px',
              background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
            }}
            styles={{
              header: {
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
                color: isDark ? '#fff' : '#1a1a2e',
              },
              body: { padding: '16px' },
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={{ stroke: chartGridColor }} />
                <YAxis
                  tick={{ fill: chartTextColor, fontSize: 12 }}
                  axisLine={{ stroke: chartGridColor }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1a1b2e' : '#fff',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0',
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#333',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} UZS`, t('dashboard.revenue')]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#52c41a"
                  strokeWidth={3}
                  dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Sessions Table */}
      <Card
        title={t('dashboard.recent_sessions')}
        style={{
          borderRadius: '16px',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
        }}
        styles={{
          header: {
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
            color: isDark ? '#fff' : '#1a1a2e',
          },
          body: { padding: 0 },
        }}
      >
        <Table
          columns={sessionColumns}
          dataSource={recentSessions}
          rowKey="id"
          pagination={false}
          style={{ borderRadius: '0 0 16px 16px', overflow: 'hidden' }}
        />
      </Card>
    </div>
  )
}
