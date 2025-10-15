import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, AlertTriangle, RotateCcw, FileText, Phone } from "lucide-react";

interface ErrorScreenProps {
  errorType: "multiple_selections" | "damaged" | "unreadable";
  errorMessage: string;
  onRetry: () => void;
  onNewBallot: () => void;
  onCallHelp: () => void;
}

const errorIcons = {
  multiple_selections: AlertTriangle,
  damaged: XCircle,
  unreadable: XCircle,
};

const errorReasons = {
  multiple_selections: "Označeno više kandidata",
  damaged: "Listić je oštećen",
  unreadable: "Nečitljive oznake",
};

export function ErrorScreen({ errorType, errorMessage, onRetry, onNewBallot, onCallHelp }: ErrorScreenProps) {
  const ErrorIcon = errorIcons[errorType];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-12 py-8"
    >
      <motion.div
        initial={{ x: -10 }}
        animate={{ x: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl w-full space-y-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ErrorIcon className="w-20 h-20 text-destructive" strokeWidth={2.5} />
          </div>

          <h1 className="text-5xl font-bold text-destructive mb-4" data-testid="text-error-title">
            GREŠKA
          </h1>
          <p className="text-2xl text-foreground font-semibold text-center" data-testid="text-error-message">
            LISTIĆ NIJE MOGAO BITI OBRAĐEN
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-2 border-destructive/30 bg-destructive/5">
            <div className="space-y-6">
              <div>
                <p className="text-xl text-muted-foreground mb-3">Razlog:</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-error-reason">
                  {errorReasons[errorType]}
                </p>
              </div>

              {errorMessage && (
                <div className="pt-4 border-t border-destructive/20">
                  <p className="text-lg text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
              )}
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
            Šta želite da uradite?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onRetry}
              className="h-16 px-8 text-xl font-semibold min-w-[200px] gap-3"
              data-testid="button-retry"
            >
              <RotateCcw className="w-6 h-6" />
              POKUŠAJ PONOVO
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onNewBallot}
              className="h-16 px-8 text-xl font-semibold min-w-[200px] gap-3"
              data-testid="button-new-ballot"
            >
              <FileText className="w-6 h-6" />
              NOVI LISTIĆ
            </Button>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="ghost"
              onClick={onCallHelp}
              className="h-14 px-10 text-lg gap-3 text-secondary hover:text-secondary"
              data-testid="button-call-help"
            >
              <Phone className="w-5 h-5" />
              POZOVI POMOĆ
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
