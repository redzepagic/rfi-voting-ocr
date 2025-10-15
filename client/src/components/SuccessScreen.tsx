import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessScreenProps {
  ballotNumber: string;
  timestamp: string;
  onFinish: () => void;
}

export function SuccessScreen({ ballotNumber, timestamp, onFinish }: SuccessScreenProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <div className="max-w-4xl w-full space-y-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 0.5,
              delay: 0.5,
            }}
            className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={3} />
          </motion.div>

          <h1 className="text-5xl font-bold text-green-600 mb-2" data-testid="text-success-title">
            USPJEŠNO!
          </h1>
          <p className="text-2xl text-foreground font-semibold" data-testid="text-success-message">
            VAŠ GLAS JE USPJEŠNO ZABILJEŽEN
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8 border-2 border-green-500/30 bg-green-50/50">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-lg text-muted-foreground mb-2">
                  Broj glasačkog listića
                </p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-ballot-number">
                  #{ballotNumber}
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg">
                <p className="text-lg text-muted-foreground mb-2">Vrijeme</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-timestamp">
                  {timestamp}
                </p>
              </div>

              <div className="col-span-2 text-center p-4 bg-white rounded-lg">
                <p className="text-lg text-muted-foreground mb-2">Status</p>
                <p className="text-3xl font-bold text-green-600">VALJAN</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 text-muted-foreground"
        >
          <Shield className="w-6 h-6" />
          <p className="text-xl">Vaš glas je siguran i anoniman</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            size="lg"
            onClick={onFinish}
            className="h-20 px-20 text-2xl font-semibold min-w-[280px]"
            data-testid="button-finish"
          >
            ZAVRŠI
          </Button>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg text-muted-foreground"
            data-testid="text-countdown"
          >
            Automatsko zatvaranje za {countdown} sekundi...
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
