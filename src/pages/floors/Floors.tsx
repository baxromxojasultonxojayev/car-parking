'use client'

import { useState } from 'react'
import { Card, Table, Button, Space, Modal, Form, Input, Select, Typography, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../../store/themeStore'
import { useDataStore } from '../../store/dataStore'
import type { ColumnsType } from 'antd/es/table'
import { Floor } from '../../types'

const { Title } = Typography

export const Floors = () => {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { floors, locations, addFloor, updateFloor, deleteFloor } = useDataStore()
  const isDark = theme === 'dark'

  const [modalOpen, setModalOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingFloor(null)
    form.resetFields()
    setModalOpen(true)
  }

  const handleEdit = (record: Floor) => {
    setEditingFloor(record)
    form.setFieldsValue({
      name: record.name,
      location_id: record.location_id,
    })
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('floors.confirm_delete'),
      onOk: () => {
        deleteFloor(id)
        message.success(t('common.deleted'))
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingFloor) {
        updateFloor(editingFloor.id, values)
        message.success(t('common.updated'))
      } else {
        addFloor(values)
        message.success(t('common.created'))
      }
      setModalOpen(false)
    } catch (error) {
      // Validation failed
    }
  }

  const getLocationName = (locationId: string) => {
    const location = locations.find((l) => l.id === locationId)
    return location?.name || 'Unknown'
  }

  const columns: ColumnsType<Floor> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text) => (
        <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#888', fontSize: '12px' }}>#{text}</span>
      ),
    },
    {
      title: t('floors.location'),
      dataIndex: 'location_id',
      key: 'location_id',
      render: (locationId) => getLocationName(locationId),
    },
    {
      title: t('floors.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppstoreOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
          </div>
          <span style={{ fontWeight: 500 }}>{text}</span>
        </div>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#667eea' }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ color: '#ff4d4f' }}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: isDark ? '#fff' : '#1a1a2e' }}>
          {t('nav.floors')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('floors.add')}
        </Button>
      </div>

      <Card
        style={{
          borderRadius: '16px',
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table columns={columns} dataSource={floors} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingFloor ? t('floors.edit') : t('floors.add')}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item
            name="location_id"
            label={t('floors.location')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Select placeholder={t('floors.select_location')}>
              {locations.map((loc) => (
                <Select.Option key={loc.id} value={loc.id}>
                  {loc.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label={t('floors.name')}
            rules={[{ required: true, message: t('common.required') }]}
          >
            <Input placeholder={t('floors.name_placeholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
