import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeoButton } from "@/components/ui/NeoButton";
import {
  X,
  Mail,
  Copy,
  Check,
  Clock,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = "email" | "payment" | "success";

interface PaymentData {
  external_reference: string;
  qr_code: string;
  qr_code_base64: string;
  payment_id: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<CheckoutStep>("email");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Polling for payment status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (step === "payment" && paymentData?.external_reference) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(
            `${FUNCTIONS_URL}/payment-status?id=${paymentData.external_reference}`,
            {
              headers: {
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.status === "approved") {
              setDownloadUrl(data.download_url);
              setStep("success");
            }
          }
        } catch (err) {
          console.error("Error checking status:", err);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, paymentData]);

  // Countdown timer
  useEffect(() => {
    if (step === "payment" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle copy
  const handleCopy = async () => {
    if (!paymentData?.qr_code) return;
    try {
      await navigator.clipboard.writeText(paymentData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle email submit & Create Payment
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${FUNCTIONS_URL}/create-pix-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar pagamento. Tente novamente.");
      }

      const data = await response.json();
      setPaymentData(data);
      setStep("payment");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao gerar PIX");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset modal on close
  const handleClose = () => {
    setStep("email");
    setEmail("");
    setTimeLeft(15 * 60);
    setPaymentData(null);
    setError(null);
    setDownloadUrl(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg font-mono">
                {step === "email" && "CHECKOUT"}
                {step === "payment" && "PAGAMENTO PIX"}
                {step === "success" && "PAGAMENTO CONFIRMADO"}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 transition-colors"
                disabled={step === "payment" && !paymentData} // Prevent closing while creating
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-700 p-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              {/* Step 1: Email */}
              {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="block font-bold mb-2 font-mono text-sm">
                      SEU E-MAIL
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading}
                        className="w-full pl-12 pr-4 py-4 border-4 border-black font-mono text-lg focus:outline-none focus:ring-4 focus:ring-brutal-yellow disabled:opacity-50"
                      />
                    </div>
                    <p className="mt-2 text-sm text-stone-500">
                      O link de download será enviado para este e-mail
                    </p>
                  </div>

                  <div className="bg-stone-100 border-2 border-black p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Antigravity Config Pack</span>
                      <span className="font-black text-xl">R$ 47,00</span>
                    </div>
                  </div>

                  <NeoButton
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    className="bg-brutal-orange text-white py-4 shadow-[6px_6px_0px_0px_#000] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        GERANDO PIX...
                      </>
                    ) : (
                      "GERAR PIX"
                    )}
                  </NeoButton>
                </form>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && paymentData && (
                <div className="space-y-6">
                  {/* Timer */}
                  <div className="bg-brutal-yellow border-2 border-black p-4 flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-mono font-bold text-lg">
                      Expira em: {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="border-4 border-black p-4 bg-white">
                      <img
                        src={`data:image/png;base64,${paymentData.qr_code_base64}`}
                        alt="QR Code PIX"
                        className="w-48 h-48 block"
                      />
                    </div>
                  </div>

                  {/* Copy Code */}
                  <div>
                    <label className="block font-bold mb-2 font-mono text-sm">
                      OU COPIE O CÓDIGO PIX
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paymentData.qr_code}
                        readOnly
                        className="flex-1 px-4 py-3 border-2 border-black font-mono text-xs bg-stone-100 truncate focus:outline-none"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        onClick={handleCopy}
                        className="px-4 border-2 border-black bg-white hover:bg-stone-100 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-stone-100 border-2 border-black p-4 space-y-2">
                    <p className="font-bold text-sm">COMO PAGAR:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Abra o app do seu banco</li>
                      <li>Escaneie o QR Code ou cole o código</li>
                      <li>Confirme o pagamento de R$ 47,00</li>
                    </ol>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 text-stone-500 py-2">
                    <Loader2 className="w-5 h-5 animate-spin text-brutal-orange" />
                    <span className="font-mono text-sm font-bold animate-pulse">
                      Aguardando confirmação do banco...
                    </span>
                  </div>
                </div>
              )}

              {/* Step 3: Success */}
              {step === "success" && (
                <div className="space-y-6 text-center">
                  <div className="bg-green-500 w-20 h-20 mx-auto flex items-center justify-center border-4 border-black">
                    <Check className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-black mb-2">
                      PAGAMENTO CONFIRMADO!
                    </h4>
                    <p className="text-stone-600">
                      Seu pacote está pronto para download
                    </p>
                  </div>

                  <div className="bg-brutal-yellow border-4 border-black p-4">
                    <p className="text-sm mb-2">Link enviado para:</p>
                    <p className="font-mono font-bold">{email}</p>
                  </div>

                  <NeoButton
                    onClick={() => {
                      if (downloadUrl) {
                        window.location.href = downloadUrl;
                      }
                    }}
                    fullWidth
                    className="bg-green-500 text-white py-4 shadow-[6px_6px_0px_0px_#000]"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    BAIXAR AGORA
                  </NeoButton>

                  <p className="text-xs text-stone-500">
                    O link de download também foi enviado para seu e-mail
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
