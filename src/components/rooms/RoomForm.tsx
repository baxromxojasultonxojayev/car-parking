'use client';

import { Modal, Form, Input, Select, InputNumber, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Room } from '../../store/roomsStore'

const roomSchema = Yup.object().shape({
  number: Yup.string().required('Room number is required'),
  type: Yup.string().required('Room type is required'),
  capacity: Yup.number().required('Capacity is required').positive(),
  pricePerNight: Yup.number().required('Price is required').positive(),
  status: Yup.string().required('Status is required'),
})

interface RoomFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: Omit<Room, 'id'>) => void
  initialValues?: Room
  isEdit?: boolean
}

export const RoomForm = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: RoomFormProps) => {
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: initialValues || {
      number: '',
      type: 'single',
      capacity: 1,
      pricePerNight: 50,
      status: 'available',
    },
    validationSchema: roomSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values)
      formik.resetForm()
      message.success(isEdit ? 'Room updated' : 'Room added')
    },
  })

  const roomTypes = [
    { label: t('rooms.single'), value: 'single' },
    { label: t('rooms.double'), value: 'double' },
    { label: t('rooms.suite'), value: 'suite' },
    { label: t('rooms.deluxe'), value: 'deluxe' },
  ]

  const statusOptions = [
    { label: t('rooms.available'), value: 'available' },
    { label: t('rooms.occupied'), value: 'occupied' },
    { label: t('rooms.maintenance'), value: 'maintenance' },
  ]

  return (
    <Modal
      title={isEdit ? t('rooms.edit_room') : t('rooms.add_room')}
      open={visible}
      onOk={() => formik.handleSubmit()}
      onCancel={() => {
        onClose()
        formik.resetForm()
      }}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
    >
      <Form layout="vertical">
        <Form.Item
          label={t('rooms.room_number')}
          validateStatus={formik.touched.number && formik.errors.number ? 'error' : ''}
          help={formik.touched.number && formik.errors.number}
        >
          <Input
            name="number"
            value={formik.values.number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={t('rooms.room_type')}
          validateStatus={formik.touched.type && formik.errors.type ? 'error' : ''}
          help={formik.touched.type && formik.errors.type}
        >
          <Select
            name="type"
            value={formik.values.type}
            onChange={(value) => formik.setFieldValue('type', value)}
            options={roomTypes}
          />
        </Form.Item>

        <Form.Item
          label={t('rooms.capacity')}
          validateStatus={formik.touched.capacity && formik.errors.capacity ? 'error' : ''}
          help={formik.touched.capacity && formik.errors.capacity}
        >
          <InputNumber
            name="capacity"
            value={formik.values.capacity}
            onChange={(value) => formik.setFieldValue('capacity', value)}
            min={1}
            max={10}
          />
        </Form.Item>

        <Form.Item
          label={t('rooms.price_per_night')}
          validateStatus={formik.touched.pricePerNight && formik.errors.pricePerNight ? 'error' : ''}
          help={formik.touched.pricePerNight && formik.errors.pricePerNight}
        >
          <InputNumber
            name="pricePerNight"
            value={formik.values.pricePerNight}
            onChange={(value) => formik.setFieldValue('pricePerNight', value)}
            min={0}
            prefix="$"
          />
        </Form.Item>

        <Form.Item
          label={t('rooms.status')}
          validateStatus={formik.touched.status && formik.errors.status ? 'error' : ''}
          help={formik.touched.status && formik.errors.status}
        >
          <Select
            name="status"
            value={formik.values.status}
            onChange={(value) => formik.setFieldValue('status', value)}
            options={statusOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
