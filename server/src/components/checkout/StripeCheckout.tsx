import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, totalPrice } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred during payment');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setIsComplete(true);
      clearCart();
    } else {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-serif text-2xl mb-2">Payment Successful!</h3>
        <p className="text-[#6E6E6E] mb-6">Thank you for your order. You'll receive a confirmation email shortly.</p>
        <button
          onClick={onClose}
          className="btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#F6F4F2] rounded-xl p-4 mb-6">
        <p className="text-caps text-[#6E6E6E] mb-2">Amount to pay</p>
        <p className="font-serif text-3xl">£{totalPrice}</p>
      </div>

      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              name: '',
              email: '',
            },
          },
        }}
      />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay £${totalPrice}`
        )}
      </button>

      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        className="w-full btn-pill bg-transparent border border-[#E5E5E5] text-[#6E6E6E] hover:bg-[#F6F4F2]"
      >
        Cancel
      </button>
    </form>
  );
}

export function StripeCheckout({ isOpen, onClose }: StripeCheckoutProps) {
  const { items } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && items.length > 0 && !clientSecret) {
      setIsLoading(true);
      setError(null);

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setError('Failed to initialize payment. Please try again.');
          setIsLoading(false);
        });
    }
  }, [isOpen, items, clientSecret]);

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[22px] shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <h2 className="font-serif text-2xl">Secure Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F6F4F2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#D4A27F] mb-4" />
              <p className="text-[#6E6E6E]">Initializing secure payment...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-4">
                {error}
              </div>
              <button
                onClick={onClose}
                className="btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F]"
              >
                Go Back
              </button>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#D4A27F',
                    colorBackground: '#ffffff',
                    colorText: '#2A2A2A',
                    colorDanger: '#ef4444',
                    borderRadius: '12px',
                  },
                },
              }}
            >
              <CheckoutForm onClose={onClose} />
            </Elements>
          ) : null}
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-[#6E6E6E]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
