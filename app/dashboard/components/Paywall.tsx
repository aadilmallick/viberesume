import { PricingTable } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PaywallInfo({
  message,
  open,
  setOpen,
}: {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paywall Info</DialogTitle>
          <DialogDescription>
            You have reached the limit for this month. Go pro for unlimited AI
            usage and unlimited portfolios. {message}
          </DialogDescription>
        </DialogHeader>
        <PricingTable newSubscriptionRedirectUrl="/dashboard" />
      </DialogContent>
    </Dialog>
  );
}
