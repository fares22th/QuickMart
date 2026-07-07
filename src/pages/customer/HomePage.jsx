import HeroBanner from '@/components/customer/home/HeroBanner'
import CategoryBar from '@/components/customer/home/CategoryBar'
import StoresSection from '@/components/customer/home/StoresSection'
import ProductsSection from '@/components/customer/home/ProductsSection'
import PromoBanner from '@/components/customer/home/PromoBanner'

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      <HeroBanner />
      <CategoryBar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <StoresSection title="متاجر مميزة قريبة منك" />
        <PromoBanner />
        <ProductsSection title="منتجات مقترحة لك" />
        <StoresSection title="الأعلى تقييماً هذا الأسبوع" />
      </div>
    </div>
  )
}
