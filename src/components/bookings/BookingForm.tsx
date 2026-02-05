'use client';

import { Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { Booking } from '../../store/bookingsStore'
import { useRoomsStore } from '../../store/roomsStore'
import dayjs from 'dayjs'

const bookingSchema = Yup.object().shape({
  guestName: Yup.string().required('Guest name is required'),
  roomId: Yup.string().required('Room is required'),
  checkIn: Yup.string().required('Check-in date is required'),
  checkOut: Yup.string().required('Check-out date is required'),
  guestEmail: Yup.string().email('Invalid email').required('Email is required'),
  guestPhone: Yup.string().required('Phone is required'),
  status: Yup.string().required('Status is required'),
})

interface BookingFormProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: Omit<Booking, 'id' | 'totalPrice' | 'roomNumber'>) => void
  initialValues?: Booking
  isEdit?: boolean
}

export const BookingForm = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  isEdit = false,
}: BookingFormProps) => {
  const { t } = useTranslation()
  const { rooms } = useRoomsStore()

  const formik = useFormik({
    initialValues: initialValues || {
      guestName: '',
      roomId: '',
      roomNumber: '',
      checkIn: '',
      checkOut: '',
      guestEmail: '',
      guestPhone: '',
      status: 'pending',
    },
    validationSchema: bookingSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values)
      message.success(isEdit ? 'Booking updated' : 'Booking added')
    },
  })

  const roomOptions = rooms
    .filter((r) => r.status === 'available')
    .map((r) => ({
      label: `Room ${r.number} - $${r.pricePerNight}`,
      value: r.id,
    }))

  const statusOptions = [
    { label: t('bookings.pending'), value: 'pending' },
    { label: t('bookings.confirmed'), value: 'confirmed' },
    { label: t('bookings.checked_in'), value: 'checked_in' },
    { label: t('bookings.checked_out'), value: 'checked_out' },
    { label: t('bookings.cancelled'), value: 'cancelled' },
  ]

  return (
    <Modal
      title={isEdit ? t('bookings.edit_booking') : t('bookings.add_booking')}
      open={visible}
      onOk={() => formik.handleSubmit()}
      onCancel={() => {
        onClose()
        formik.resetForm()
      }}
      okText={t('common.save')}
      cancelText={t('common.cancel')}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item
          label={t('bookings.guest_name')}
          validateStatus={formik.touched.guestName && formik.errors.guestName ? 'error' : ''}
          help={formik.touched.guestName && formik.errors.guestName}
        >
          <Input
            name="guestName"
            value={formik.values.guestName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.email')}
          validateStatus={formik.touched.guestEmail && formik.errors.guestEmail ? 'error' : ''}
          help={formik.touched.guestEmail && formik.errors.guestEmail}
        >
          <Input
            type="email"
            name="guestEmail"
            value={formik.values.guestEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={t('guests.phone')}
          validateStatus={formik.touched.guestPhone && formik.errors.guestPhone ? 'error' : ''}
          help={formik.touched.guestPhone && formik.errors.guestPhone}
        >
          <Input
            name="guestPhone"
            value={formik.values.guestPhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Item>

        <Form.Item
          label={t('nav.rooms')}
          validateStatus={formik.touched.roomId && formik.errors.roomId ? 'error' : ''}
          help={formik.touched.roomId && formik.errors.roomId}
        >
          <Select
            name="roomId"
            value={formik.values.roomId || undefined}
            onChange={(value) => formik.setFieldValue('roomId', value)}
            options={roomOptions}
            placeholder="Select a room"
          />
        </Form.Item>

        <Form.Item
          label={t('bookings.check_in')}
          validateStatus={formik.touched.checkIn && formik.errors.checkIn ? 'error' : ''}
          help={formik.touched.checkIn && formik.errors.checkIn}
        >
          <DatePicker
            value={formik.values.checkIn ? dayjs(formik.values.checkIn) : null}
            onChange={(date) => formik.setFieldValue('checkIn', date?.format('YYYY-MM-DD'))}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={t('bookings.check_out')}
          validateStatus={formik.touched.checkOut && formik.errors.checkOut ? 'error' : ''}
          help={formik.touched.checkOut && formik.errors.checkOut}
        >
          <DatePicker
            value={formik.values.checkOut ? dayjs(formik.values.checkOut) : null}
            onChange={(date) => formik.setFieldValue('checkOut', date?.format('YYYY-MM-DD'))}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={t('bookings.status')}
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
