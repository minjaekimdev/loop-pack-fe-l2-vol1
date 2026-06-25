import { useState } from 'react';
import type { Coupon, PaymentMethod } from './types/types';
import { ADDRESSES, CART, COUPONS, MEMBER } from './data';
import './market.css';
import { DeliverySection } from './components/DeliverySection';
import { CheckoutContainer } from './ui/container';
import { CouponSection } from './components/CouponSection';
import { OrderItemSection } from './components/OrderItemSection';
import { RequestSection } from './components/RequestSection';
import { PointSection } from './components/PointSection';
import { CheckoutComplete } from './components/CheckoutComplete';
import { PastOrderSection } from './components/PastOrderSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { FinalPriceSection } from './components/FinalPriceSection';
import { TermsSection } from './components/TermsSection';
import { useCheckout } from './utils/calculateCheckout';

// 결제 페이지 전체의 흐름과 레이아웃이라는 페이지 컴포넌트 본연의 역할에만 집중할 수 있도록(1, 2, 3 위배)
// TODO: 하위 컴포넌트로 전달하는 props의 성격 확인하기
export function CheckoutPage() {
  const member = MEMBER;
  const cart = CART;

  const [selectedAddressId, setSelectedAddressId] = useState(ADDRESSES[0].id);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [usePoint, setUsePoint] = useState(false);
  const [pointInput, setPointInput] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState(false);

  const address = ADDRESSES.find((a) => a.id === selectedAddressId)!;

  // 결제 금액을 구하는 비즈니스 로직은 별도 함수로 분리
  const { itemTotal, shippingFee, couponDiscount, pointDiscount, finalPrice } = useCheckout(
    cart,
    address,
    appliedCoupon,
    usePoint,
    pointInput,
    member
  );

  const handleApplyCoupon = () => {
    const found = COUPONS.find((c) => c.code === couponCode.trim());
    setAppliedCoupon(found ?? null);
    if (!found) alert('존재하지 않는 쿠폰이에요');
  };

  // 연관 상태: 최종 금액, placed 상태
  if (placed) {
    return (
      <CheckoutComplete finalPrice={finalPrice} onCheckoutButtonClick={() => setPlaced(false)} />
    );
  }

  return (
    <CheckoutContainer>
      <DeliverySection
        addresses={ADDRESSES}
        selectedAddressId={selectedAddressId}
        onSelectAddress={setSelectedAddressId}
      />
      <RequestSection />
      <OrderItemSection />
      <CouponSection
        couponCode={couponCode}
        onInputChange={(e) => setCouponCode(e.target.value)}
        onApplyButtonClick={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <PointSection
        usePoint={usePoint}
        onToggleCheckbox={(e) => setUsePoint(e.target.checked)}
        pointInput={pointInput}
        onInputChange={(e) => setPointInput(Number(e.target.value.replaceAll(',', '')))}
      />

      <PaymentMethodSection payment={payment} onPaymentMethodChange={(m) => setPayment(m)} />
      <FinalPriceSection
        itemTotal={itemTotal}
        shippingFee={shippingFee}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        // 포인트를 사용한다는 것은 usePoint가 아니라 pointDiscount를 내려주는 것만으로 가능?
        usePoint={usePoint}
        pointDiscount={pointDiscount}
        finalPrice={finalPrice}
      />
      <TermsSection
        agreed={agreed}
        onToggleCheckbox={(e: React.ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
        onButtonClick={() => setIsTermsOpen(true)}
      />
      <button className="pay" disabled={!agreed} onClick={() => setPlaced(true)}>
        {finalPrice.toLocaleString()}원 결제하기
      </button>
      {isTermsOpen ? (
        <div className="modal" onClick={() => setIsTermsOpen(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <h3>이용 약관</h3>
            <p>주문 후 7일 이내 단순 변심 반품이 가능하며, 도서산간은 배송비가 추가됩니다.</p>
            <button onClick={() => setIsTermsOpen(false)}>닫기</button>
          </div>
        </div>
      ) : null}
      <PastOrderSection />
    </CheckoutContainer>
  );
}
