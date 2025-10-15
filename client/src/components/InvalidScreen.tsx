import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Check, FileText, Users } from "lucide-react";

interface InvalidScreenProps {
  reason: string;
  onAccept: () => void;
  onNewBallot: () => void;
  onCallCommission: () => void;
}

export function InvalidScreen({ reason, onAccept, onNewBallot, onCallCommission }: InvalidScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl w-full space-y-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-20 h-20 text-yellow-600" strokeWidth={2.5} />
          </div>

          <h1 className="text-5xl font-bold text-yellow-600 mb-4" data-testid="text-invalid-title">
            NEVAŽEĆI LISTIĆ
          </h1>
          <p className="text-2xl text-foreground font-semibold text-center" data-testid="text-invalid-message">
            Vaš listić je označen kao NEVAŽEĆI
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-2 border-yellow-500/30 bg-yellow-50/50">
            <div>
              <p className="text-xl text-muted-foreground mb-3">Razlog:</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-invalid-reason">
                {reason}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          <p className="text-2xl text-center font-semibold text-foreground">
            Da li prihvatate ovaj status?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onAccept}
              className="h-16 px-10 text-xl font-semibold min-w-[220px] gap-3"
              data-testid="button-accept-invalid"
            >
              <Check className="w-6 h-6" />
              DA, PRIHVATAM
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onNewBallot}
              className="h-16 px-10 text-xl font-semibold min-w-[220px] gap-3"
              data-testid="button-request-new-ballot"
            >
              <FileText className="w-6 h-6" />
              ŽELIM NOVI LISTIĆ
            </Button>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="ghost"
              onClick={onCallCommission}
              className="h-14 px-10 text-lg gap-3 text-secondary hover:text-secondary"
              data-testid="button-call-commission"
            >
              <Users className="w-5 h-5" />
              POZOVI KOMISIJU
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
