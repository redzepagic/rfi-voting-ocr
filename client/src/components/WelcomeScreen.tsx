import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flag, Building2 } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  municipality: string;
  locationNumber: string;
}

export function WelcomeScreen({ onStart, municipality, locationNumber }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <div className="flex flex-col items-center space-y-12 max-w-4xl w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-16"
        >
          <div className="flex flex-col items-center">
            <Flag className="w-28 h-28 text-primary" strokeWidth={1.5} />
            <p className="text-sm font-medium text-muted-foreground mt-2">Grb BiH</p>
          </div>
          <div className="flex flex-col items-center">
            <Building2 className="w-28 h-28 text-primary" strokeWidth={1.5} />
            <p className="text-sm font-medium text-muted-foreground mt-2">CIK BiH</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl font-bold text-foreground leading-tight" data-testid="text-welcome-title">
            DOBRODOŠLI NA GLASAČKO MJESTO
          </h1>
          <div className="space-y-2 text-2xl text-muted-foreground">
            <p className="font-medium" data-testid="text-municipality">Opština {municipality}</p>
            <p data-testid="text-location-number">Glasačko mjesto #{locationNumber}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <Button
            size="lg"
            onClick={onStart}
            className="h-20 px-16 text-2xl font-semibold min-w-[320px] animate-pulse-slow"
            data-testid="button-start-voting"
          >
            POČNI GLASANJE
          </Button>
          <p className="text-lg text-muted-foreground" data-testid="text-start-prompt">
            Pritisnite dugme za početak
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
