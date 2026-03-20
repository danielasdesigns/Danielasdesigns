import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-[#F6F4F2] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="block text-center mb-12">
          <h1 className="font-serif text-3xl text-[#2A2A2A]">Daniela Pemberton</h1>
        </Link>

        <div className="bg-white rounded-[22px] shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-amber-600" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] mb-4">
            Checkout Cancelled
          </h2>

          <p className="text-[#6E6E6E] mb-8 max-w-md mx-auto">
            Your payment was not completed. Don't worry—your cart is still saved and you can try again whenever you're ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F] inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-pill bg-transparent border border-[#E5E5E5] text-[#2A2A2A] hover:bg-[#F6F4F2] inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[#6E6E6E]">
            Having trouble?{' '}
            <a href="mailto:hello@danielasdesigns.com" className="text-[#D4A27F] hover:underline">
              Contact me
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
