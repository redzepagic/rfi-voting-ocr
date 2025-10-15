import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw,
  Settings,
  Lock,
  X
} from "lucide-react";
import type { VotingStats } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: VotingStats | null;
  onForceSuccess: () => void;
  onForceError: () => void;
  onReset: () => void;
}

export function AdminPanel({ isOpen, onClose, stats, onForceSuccess, onForceError, onReset }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
        setError("");
        setPin("");
      } else {
        setError("Pogrešan PIN");
        setPin("");
      }
    } catch (error) {
      setError("Greška pri autentifikaciji");
      setPin("");
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPin("");
    setError("");
    onClose();
  };

  const successRate = stats 
    ? stats.totalScans > 0 
      ? ((stats.successful / stats.totalScans) * 100).toFixed(1)
      : "0.0"
    : "0.0";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-admin-panel">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3" data-testid="heading-admin-panel">
              <Settings className="w-7 h-7" />
              Admin Panel
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="button-close-admin"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <Card className="p-8">
                <div className="flex flex-col items-center gap-6">
                  <Lock className="w-16 h-16 text-primary" />
                  <h3 className="text-xl font-semibold" data-testid="heading-pin-auth">Unesite PIN za pristup</h3>
                  
                  <div className="w-full max-w-xs space-y-4">
                    <Input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                      placeholder="PIN (4 cifre)"
                      maxLength={4}
                      className="text-center text-2xl tracking-widest h-14"
                      data-testid="input-admin-pin"
                    />
                    
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-destructive text-center"
                        data-testid="text-pin-error"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <Button
                      onClick={handleAuth}
                      className="w-full h-12 text-lg"
                      data-testid="button-authenticate"
                    >
                      Potvrdi
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-semibold" data-testid="heading-statistics">Statistika</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1" data-testid="label-total-scans">Ukupno skeniranja</p>
                    <p className="text-3xl font-bold" data-testid="text-total-scans">
                      {stats?.totalScans || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700" data-testid="label-successful">Uspješno</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600" data-testid="text-successful-scans">
                      {stats?.successful || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700" data-testid="label-failed">Greške</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600" data-testid="text-failed-scans">
                      {stats?.failed || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-yellow-700" data-testid="label-invalid">Nevažeći</p>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600" data-testid="text-invalid-scans">
                      {stats?.invalid || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1" data-testid="label-retries">Pokušaji ponovo</p>
                    <p className="text-3xl font-bold text-blue-600" data-testid="text-retries">
                      {stats?.retries || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary mb-1" data-testid="label-success-rate">Stopa uspjeha</p>
                    <p className="text-3xl font-bold text-primary" data-testid="text-success-rate">
                      {successRate}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4" data-testid="heading-error-types">Tipovi grešaka</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1" data-testid="label-multiple-selections">Više izbora</p>
                    <p className="text-2xl font-bold" data-testid="text-multiple-selections">
                      {stats?.multipleSelections || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1" data-testid="label-damaged">Oštećen</p>
                    <p className="text-2xl font-bold" data-testid="text-damaged">
                      {stats?.damaged || 0}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1" data-testid="label-unreadable">Nečitljiv</p>
                    <p className="text-2xl font-bold" data-testid="text-unreadable">
                      {stats?.unreadable || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4" data-testid="heading-test-controls">Test kontrole</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onForceSuccess}
                    variant="outline"
                    className="gap-2"
                    data-testid="button-force-success"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Forsiraj uspjeh
                  </Button>
                  <Button
                    onClick={onForceError}
                    variant="outline"
                    className="gap-2"
                    data-testid="button-force-error"
                  >
                    <XCircle className="w-4 h-4" />
                    Forsiraj grešku
                  </Button>
                  <Button
                    onClick={onReset}
                    variant="destructive"
                    className="gap-2"
                    data-testid="button-reset-stats"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resetuj statistiku
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
