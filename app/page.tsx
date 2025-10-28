"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

export default function ReimbursementPage() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    nomorWhatsApp: "",
    tujuanPengeluaran: "",
    nominalPenggantian: "",
    tanggalPengeluaran: new Date().toISOString().split("T")[0],
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        buktiPengeluaran: "Format file harus JPG, JPEG, atau PNG",
      }))
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        buktiPengeluaran: "Ukuran file maksimal 5MB",
      }))
      return
    }

    setImageFile(file)
    setErrors((prev) => ({ ...prev, buktiPengeluaran: "" }))

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi"
    }

    if (!formData.nomorWhatsApp.trim()) {
      newErrors.nomorWhatsApp = "Nomor WhatsApp wajib diisi"
    } else if (!/^08\d{8,11}$/.test(formData.nomorWhatsApp)) {
      newErrors.nomorWhatsApp = "Format nomor WhatsApp tidak valid (contoh: 08123456789)"
    }

    if (!formData.tujuanPengeluaran.trim()) {
      newErrors.tujuanPengeluaran = "Tujuan pengeluaran wajib diisi"
    }

    if (!formData.nominalPenggantian) {
      newErrors.nominalPenggantian = "Nominal penggantian wajib diisi"
    } else if (Number(formData.nominalPenggantian) < 1000) {
      newErrors.nominalPenggantian = "Nominal minimal Rp 1.000"
    }

    if (!imageFile) {
      newErrors.buktiPengeluaran = "Bukti pengeluaran wajib diunggah"
    }

    if (!formData.tanggalPengeluaran) {
      newErrors.tanggalPengeluaran = "Tanggal pengeluaran wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Simulate successful submission
      setIsSubmitted(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          namaLengkap: "",
          nomorWhatsApp: "",
          tujuanPengeluaran: "",
          nominalPenggantian: "",
          tanggalPengeluaran: new Date().toISOString().split("T")[0],
        })
        setImageFile(null)
        setImagePreview(null)
      }, 5000)
    }
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "")
    return new Intl.NumberFormat("id-ID").format(Number(number))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-balance">Permohonan Reimbursement</h1>
          <p className="text-slate-600 text-balance">MTs. KH A Wahab Muhsin - Alumni</p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-emerald-800 mb-1">Berhasil Diajukan!</h3>
                <p className="text-emerald-700 text-sm text-pretty">
                  Permohonan reimbursement Anda telah berhasil diajukan! Tim bendahara akan segera memproses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="namaLengkap" className="block text-sm font-medium text-slate-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaLengkap"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.namaLengkap ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                }`}
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.namaLengkap && <p className="mt-1 text-sm text-red-600">{errors.namaLengkap}</p>}
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label htmlFor="nomorWhatsApp" className="block text-sm font-medium text-slate-700 mb-2">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="nomorWhatsApp"
                name="nomorWhatsApp"
                value={formData.nomorWhatsApp}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.nomorWhatsApp ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                }`}
                placeholder="08123456789"
              />
              {errors.nomorWhatsApp && <p className="mt-1 text-sm text-red-600">{errors.nomorWhatsApp}</p>}
            </div>

            {/* Tujuan Pengeluaran */}
            <div>
              <label htmlFor="tujuanPengeluaran" className="block text-sm font-medium text-slate-700 mb-2">
                Tujuan Pengeluaran <span className="text-red-500">*</span>
              </label>
              <textarea
                id="tujuanPengeluaran"
                name="tujuanPengeluaran"
                value={formData.tujuanPengeluaran}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  errors.tujuanPengeluaran ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                }`}
                placeholder="Contoh: Pembelian ATK untuk reuni alumni"
              />
              {errors.tujuanPengeluaran && <p className="mt-1 text-sm text-red-600">{errors.tujuanPengeluaran}</p>}
            </div>

            {/* Nominal Penggantian */}
            <div>
              <label htmlFor="nominalPenggantian" className="block text-sm font-medium text-slate-700 mb-2">
                Nominal Penggantian <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">Rp</span>
                <input
                  type="text"
                  id="nominalPenggantian"
                  name="nominalPenggantian"
                  value={formData.nominalPenggantian ? formatCurrency(formData.nominalPenggantian) : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setFormData((prev) => ({
                      ...prev,
                      nominalPenggantian: value,
                    }))
                    if (errors.nominalPenggantian) {
                      setErrors((prev) => ({ ...prev, nominalPenggantian: "" }))
                    }
                  }}
                  className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.nominalPenggantian ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                  }`}
                  placeholder="150.000"
                />
              </div>
              {errors.nominalPenggantian && <p className="mt-1 text-sm text-red-600">{errors.nominalPenggantian}</p>}
            </div>

            {/* Tanggal Pengeluaran */}
            <div>
              <label htmlFor="tanggalPengeluaran" className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Pengeluaran <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggalPengeluaran"
                name="tanggalPengeluaran"
                value={formData.tanggalPengeluaran}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.tanggalPengeluaran ? "border-red-500 bg-red-50" : "border-slate-300 bg-white"
                }`}
              />
              {errors.tanggalPengeluaran && <p className="mt-1 text-sm text-red-600">{errors.tanggalPengeluaran}</p>}
            </div>

            {/* Bukti Pengeluaran */}
            <div>
              <label htmlFor="buktiPengeluaran" className="block text-sm font-medium text-slate-700 mb-2">
                Bukti Pengeluaran <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.buktiPengeluaran
                    ? "border-red-500 bg-red-50"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400"
                }`}
              >
                <input
                  type="file"
                  id="buktiPengeluaran"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="buktiPengeluaran" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview bukti pengeluaran"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-slate-600">{imageFile?.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setImageFile(null)
                          setImagePreview(null)
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ganti Gambar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="w-12 h-12 mx-auto text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-slate-600 font-medium">Klik untuk unggah gambar</p>
                      <p className="text-xs text-slate-500">JPG, JPEG, atau PNG (Maks. 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.buktiPengeluaran && <p className="mt-1 text-sm text-red-600">{errors.buktiPengeluaran}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-amber-800 font-medium">Menunggu Verifikasi</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              Ajukan Reimbursement
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Pastikan semua data yang Anda masukkan sudah benar sebelum mengajukan
        </p>
      </div>
    </div>
  )
}
