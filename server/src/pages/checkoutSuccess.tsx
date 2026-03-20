import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, ArrowLeft } from 'lucide-react';

export function CheckoutSuccess() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem('cart');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4A27F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6E6E6E]">Confirming your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="block text-center mb-12">
          <h1 className="font-serif text-3xl text-[#2A2A2A]">Daniela Pemberton</h1>
        </Link>

        <div className="bg-white rounded-[22px] shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-[#2A2A2A] mb-4">
            Thank You for Your Order!
          </h2>

          <p className="text-[#6E6E6E] mb-8 max-w-md mx-auto">
            Your payment has been processed successfully. We've sent a confirmation email with your order details.
          </p>

          <div className="bg-[#F6F4F2] rounded-xl p-6 mb-8 text-left">
            <div className="flex items-start gap-4 mb-4">
              <Package className="w-5 h-5 text-[#D4A27F] mt-0.5" />
              <div>
                <p className="font-medium text-[#2A2A2A]">What happens next?</p>
                <p className="text-sm text-[#6E6E6E] mt-1">
                  I'll carefully craft your jewellery by hand and ship it within 5-7 business days. You'll receive tracking information once it's on its way.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-[#D4A27F] mt-0.5" />
              <div>
                <p className="font-medium text-[#2A2A2A]">Questions?</p>
                <p className="text-sm text-[#6E6E6E] mt-1">
                  Email me anytime at{' '}
                  <a href="mailto:hello@danielasdesigns.com" className="text-[#D4A27F] hover:underline">
                    hello@danielasdesigns.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-pill bg-[#2A2A2A] text-white hover:bg-[#D4A27F] inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[#6E6E6E] mt-8">
          Daniela Pemberton Jewellery • Handmade with care
        </p>
      </div>
    </div>
  );
}
