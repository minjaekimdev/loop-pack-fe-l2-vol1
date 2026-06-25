import { CART } from '../data';
import { OrderLineRow } from '../OrderLineRow';
import { SectionContainer } from './container';

export const OrderItemSection = () => {
  const cart = CART;
  return (
    <SectionContainer title="주문 상품">
      {cart.map((it) => (
        <OrderLineRow
          key={it.id}
          type="product"
          label={it.name}
          amount={it.price * it.quantity}
          thumbnail={it.thumbnail}
          option={it.option}
          quantity={it.quantity}
        />
      ))}
    </SectionContainer>
  );
};
