import { create } from 'zustand'
import api from '@/lib/axios'

interface SalesFilters {
  fromDate: string
  toDate: string
  distributor: string
  retailer: string
  product: string
  paymentStatus: string
  orderStatus: string
}

interface OrdersFilters {
  fromDate: string
  toDate: string
  orderNumber: string
  retailer: string
  distributor: string
  status: string
  product: string
}

interface PaymentsFilters {
  fromDate: string
  toDate: string
  retailer: string
  distributor: string
  paymentStatus: string
  paymentMethod: string
}

interface DistributorsFilters {
  fromDate: string
  toDate: string
  distributor: string
}

interface RetailersFilters {
  fromDate: string
  toDate: string
  retailer: string
  distributor: string
}

interface ReportState {
  // Sales
  salesFilters: SalesFilters
  salesData: any[]
  salesLoading: boolean
  setSalesFilter: (key: keyof SalesFilters, value: string) => void
  resetSalesFilters: () => void
  generateSalesReport: () => Promise<void>
  downloadSalesPDF: () => Promise<void>

  // Orders
  ordersFilters: OrdersFilters
  ordersData: any[]
  ordersLoading: boolean
  setOrdersFilter: (key: keyof OrdersFilters, value: string) => void
  resetOrdersFilters: () => void
  generateOrdersReport: () => Promise<void>
  downloadOrdersPDF: () => Promise<void>

  // Payments
  paymentsFilters: PaymentsFilters
  paymentsData: any[]
  paymentsLoading: boolean
  setPaymentsFilter: (key: keyof PaymentsFilters, value: string) => void
  resetPaymentsFilters: () => void
  generatePaymentsReport: () => Promise<void>
  downloadPaymentsPDF: () => Promise<void>

  // Distributors
  distributorsFilters: DistributorsFilters
  distributorsData: any[]
  distributorsLoading: boolean
  setDistributorsFilter: (key: keyof DistributorsFilters, value: string) => void
  resetDistributorsFilters: () => void
  generateDistributorsReport: () => Promise<void>
  downloadDistributorsPDF: () => Promise<void>

  // Retailers
  retailersFilters: RetailersFilters
  retailersData: any[]
  retailersLoading: boolean
  setRetailersFilter: (key: keyof RetailersFilters, value: string) => void
  resetRetailersFilters: () => void
  generateRetailersReport: () => Promise<void>
  downloadRetailersPDF: () => Promise<void>
}

const downloadPDF = async (endpoint: string, params: URLSearchParams, filename: string) => {
  const response = await api.get(`${endpoint}?${params.toString()}`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const buildParams = (filters: Record<string, string>, keyMap: Record<string, string>) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value && keyMap[key]) params.append(keyMap[key], value)
  })
  return params
}

export const useReportStore = create<ReportState>()((set, get) => ({
  // Sales
  salesFilters: {
    fromDate: '',
    toDate: '',
    distributor: '',
    retailer: '',
    product: '',
    paymentStatus: '',
    orderStatus: 'delivered',
  },
  salesData: [],
  salesLoading: false,
  setSalesFilter: (key, value) =>
    set((s) => ({ salesFilters: { ...s.salesFilters, [key]: value } })),
  resetSalesFilters: () =>
    set({
      salesFilters: {
        fromDate: '',
        toDate: '',
        distributor: '',
        retailer: '',
        product: '',
        paymentStatus: '',
        orderStatus: 'delivered',
      },
    }),
  generateSalesReport: async () => {
    set({ salesLoading: true })
    try {
      const res = await api.get(`/reports/sales/pdf`)
      const data = res.data.data || res.data
      set({ salesData: Array.isArray(data) ? data : [] })
    } catch {
      set({ salesData: [] })
    } finally {
      set({ salesLoading: false })
    }
  },
  downloadSalesPDF: async () => {
    const f = get().salesFilters
    const params = buildParams(
      { from_date: f.fromDate, to_date: f.toDate, distributor_id: f.distributor, retailer_id: f.retailer, product_id: f.product, payment_status: f.paymentStatus, order_status: f.orderStatus },
      { from_date: 'from_date', to_date: 'to_date', distributor_id: 'distributor_id', retailer_id: 'retailer_id', product_id: 'product_id', payment_status: 'payment_status', order_status: 'order_status' }
    )
    await downloadPDF('/reports/sales/pdf', params, 'sales-report.pdf')
  },

  // Orders
  ordersFilters: {
    fromDate: '',
    toDate: '',
    orderNumber: '',
    retailer: '',
    distributor: '',
    status: '',
    product: '',
  },
  ordersData: [],
  ordersLoading: false,
  setOrdersFilter: (key, value) =>
    set((s) => ({ ordersFilters: { ...s.ordersFilters, [key]: value } })),
  resetOrdersFilters: () =>
    set({
      ordersFilters: {
        fromDate: '',
        toDate: '',
        orderNumber: '',
        retailer: '',
        distributor: '',
        status: '',
        product: '',
      },
    }),
  generateOrdersReport: async () => {
    const f = get().ordersFilters
    set({ ordersLoading: true })
    try {
      const params = buildParams(
        { from_date: f.fromDate, to_date: f.toDate, order_number: f.orderNumber, retailer_id: f.retailer, distributor_id: f.distributor, status: f.status, product_id: f.product },
        { from_date: 'from_date', to_date: 'to_date', order_number: 'order_number', retailer_id: 'retailer_id', distributor_id: 'distributor_id', status: 'status', product_id: 'product_id' }
      )
      const res = await api.get(`/reports/orders?${params.toString()}`)
      const data = res.data.data || res.data
      set({ ordersData: Array.isArray(data) ? data : [] })
    } catch {
      set({ ordersData: [] })
    } finally {
      set({ ordersLoading: false })
    }
  },
  downloadOrdersPDF: async () => {
    const f = get().ordersFilters
    const params = buildParams(
      { from_date: f.fromDate, to_date: f.toDate, order_number: f.orderNumber, retailer_id: f.retailer, distributor_id: f.distributor, status: f.status, product_id: f.product },
      { from_date: 'from_date', to_date: 'to_date', order_number: 'order_number', retailer_id: 'retailer_id', distributor_id: 'distributor_id', status: 'status', product_id: 'product_id' }
    )
    await downloadPDF('/reports/orders/pdf', params, 'orders-report.pdf')
  },

  // Payments
  paymentsFilters: {
    fromDate: '',
    toDate: '',
    retailer: '',
    distributor: '',
    paymentStatus: '',
    paymentMethod: '',
  },
  paymentsData: [],
  paymentsLoading: false,
  setPaymentsFilter: (key, value) =>
    set((s) => ({ paymentsFilters: { ...s.paymentsFilters, [key]: value } })),
  resetPaymentsFilters: () =>
    set({
      paymentsFilters: {
        fromDate: '',
        toDate: '',
        retailer: '',
        distributor: '',
        paymentStatus: '',
        paymentMethod: '',
      },
    }),
  generatePaymentsReport: async () => {
    const f = get().paymentsFilters
    set({ paymentsLoading: true })
    try {
      const params = buildParams(
        { from_date: f.fromDate, to_date: f.toDate, retailer_id: f.retailer, distributor_id: f.distributor, status: f.paymentStatus, payment_method: f.paymentMethod },
        { from_date: 'from_date', to_date: 'to_date', retailer_id: 'retailer_id', distributor_id: 'distributor_id', status: 'status', payment_method: 'payment_method' }
      )
      const res = await api.get(`/reports/payment/pdf?${params.toString()}`)
      const data = res.data.data || res.data
      set({ paymentsData: Array.isArray(data) ? data : [] })
    } catch {
      set({ paymentsData: [] })
    } finally {
      set({ paymentsLoading: false })
    }
  },
  downloadPaymentsPDF: async () => {
    const f = get().paymentsFilters
    const params = buildParams(
      { from_date: f.fromDate, to_date: f.toDate, retailer_id: f.retailer, distributor_id: f.distributor, status: f.paymentStatus, payment_method: f.paymentMethod },
      { from_date: 'from_date', to_date: 'to_date', retailer_id: 'retailer_id', distributor_id: 'distributor_id', status: 'status', payment_method: 'payment_method' }
    )
    await downloadPDF('/reports/payment/pdf', params, 'payments-report.pdf')
  },

  // Distributors
  distributorsFilters: {
    fromDate: '',
    toDate: '',
    distributor: '',
  },
  distributorsData: [],
  distributorsLoading: false,
  setDistributorsFilter: (key, value) =>
    set((s) => ({ distributorsFilters: { ...s.distributorsFilters, [key]: value } })),
  resetDistributorsFilters: () =>
    set({
      distributorsFilters: {
        fromDate: '',
        toDate: '',
        distributor: '',
      },
    }),
  generateDistributorsReport: async () => {
    const f = get().distributorsFilters
    set({ distributorsLoading: true })
    try {
      const params = buildParams(
        { from_date: f.fromDate, to_date: f.toDate, distributor_id: f.distributor },
        { from_date: 'from_date', to_date: 'to_date', distributor_id: 'distributor_id' }
      )
      const res = await api.get(`/reports/distributor?${params.toString()}`)
      const data = res.data.data || res.data
      set({ distributorsData: Array.isArray(data) ? data : [] })
    } catch {
      set({ distributorsData: [] })
    } finally {
      set({ distributorsLoading: false })
    }
  },
  downloadDistributorsPDF: async () => {
    const f = get().distributorsFilters
    const params = buildParams(
      { from_date: f.fromDate, to_date: f.toDate, distributor_id: f.distributor },
      { from_date: 'from_date', to_date: 'to_date', distributor_id: 'distributor_id' }
    )
    await downloadPDF('/reports/distributor/pdf', params, 'distributors-report.pdf')
  },

  // Retailers
  retailersFilters: {
    fromDate: '',
    toDate: '',
    retailer: '',
    distributor: '',
  },
  retailersData: [],
  retailersLoading: false,
  setRetailersFilter: (key, value) =>
    set((s) => ({ retailersFilters: { ...s.retailersFilters, [key]: value } })),
  resetRetailersFilters: () =>
    set({
      retailersFilters: {
        fromDate: '',
        toDate: '',
        retailer: '',
        distributor: '',
      },
    }),
  generateRetailersReport: async () => {
    const f = get().retailersFilters
    set({ retailersLoading: true })
    try {
      const params = buildParams(
        { from_date: f.fromDate, to_date: f.toDate, retailer_id: f.retailer, distributor_id: f.distributor },
        { from_date: 'from_date', to_date: 'to_date', retailer_id: 'retailer_id', distributor_id: 'distributor_id' }
      )
      const res = await api.get(`/reports/retailers?${params.toString()}`)
      const data = res.data.data || res.data
      set({ retailersData: Array.isArray(data) ? data : [] })
    } catch {
      set({ retailersData: [] })
    } finally {
      set({ retailersLoading: false })
    }
  },
  downloadRetailersPDF: async () => {
    const f = get().retailersFilters
    const params = buildParams(
      { from_date: f.fromDate, to_date: f.toDate, retailer_id: f.retailer, distributor_id: f.distributor },
      { from_date: 'from_date', to_date: 'to_date', retailer_id: 'retailer_id', distributor_id: 'distributor_id' }
    )
    await downloadPDF('/reports/retailers/pdf', params, 'retailer-report.pdf')
  },
}))
